import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const startServer = async () => {
  // connect database
  await connectDB();

  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();
