import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import productRoutes from "./routes/product.route.js";
import technicianRoutes from "./routes/technician.route.js";
import customerRoutes from "./routes/customer.route.js";
import registrationRoutes from "./routes/registration.route.js";
import incidentRoutes from "./routes/incident.route.js";
import db from "./utils/dbconfig.js";

dotenv.config();
const app = express();


app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));


app.use((req, res, next) => {
  req.db = db;
  next();
});


app.use("/api/products", productRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/incident", incidentRoutes);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});