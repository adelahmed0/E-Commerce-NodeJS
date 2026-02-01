import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import i18next from "i18next";
import middleware from "i18next-http-middleware";
import Backend from "i18next-fs-backend";
import cors from "cors";
import morgan from "morgan";

import categoryRouter from "./routes/category.route.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.middleware.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const api = process.env.API_PREFIX;

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: { loadPath: "locales/{{lng}}.json" },
  });

app.use(middleware.handle(i18next));

app.use(express.json());

app.use(morgan("tiny"));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
  }),
);

app.use(authMiddleware);
app.use("/public/uploads", express.static("public/uploads"));

// Routes
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/auth`, authRouter);
app.use(`${api}/products`, productRouter);
app.use(`${api}/orders`, orderRouter);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
