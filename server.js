import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import routes from "./routes/Routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "API Running" }));

app.use("/api", routes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
