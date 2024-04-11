import app from "./app.js";
// Define the port
const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
