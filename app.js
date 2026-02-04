import express from "express";
import helmet from "helmet";
import middleware from "i18next-http-middleware";
import cors from "cors";
import morgan from "morgan";
import configureI18n from "./config/i18n.js";

import categoryRouter from "./routes/category.route.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.middleware.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

const app = express();
const api = process.env.API_PREFIX || "/api";

app.use(helmet());

// i18n initialization
const i18next = configureI18n();
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

export default app;
