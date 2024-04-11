import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose
      .connect(process.env.MONGO_URL, {
        dbName: "Debug-Experts",
      })
      .then(() => {
        console.log("Database connection established");
      })
      .catch((err) =>
        console.error(
          `Some error occurred while connecting to database: ${err}`
        )
      );
}
