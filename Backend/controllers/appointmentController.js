import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

/*
**************************
//* POST APPOINTMENT LOGIC
**************************
*/

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    fullName,
    githubUsername,
    email,
    appointment_date,
    department,
    expert_fullName,
    hasVisited,
  } = req.body;
  if (!fullName || !githubUsername || !email || !appointment_date || !department || !expert_fullName) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isConflict = await User.find({
    fullName: expert_fullName,
    role: "Expert",
    expertDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Expert not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Expert Conflict! Please Contact Through Email!",
        400
      )
    );
  }
  const expertId = isConflict[0]._id;
  const studentId = req.user._id;
  const appointment = await Appointment.create({
    fullName,
    githubUsername,
    email,
    appointment_date,
    department,
    expert: {
      fullName: expert_fullName,
    },
    hasVisited,
    expertId,
    studentId,
  });
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Send!",
  });
});

/*
**************************
//* ALL APPOINTMENT LOGIC
**************************
*/

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});

/*
**************************
//* UPDATED APPOINTMENT STATUS LOGIC
**************************
*/

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
      appointment
    });
  }
);

/*
**************************
//* DELETE APPOINTMENT LOGIC
**************************
*/

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
    appointment
  });
});