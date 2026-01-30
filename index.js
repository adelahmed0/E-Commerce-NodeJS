const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const i18next = require("i18next");
const middleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");
const cors = require("cors");

const categoryRoute = require("./routes/category.route");

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

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
  }),
);

app.use(`${api}/categories`, categoryRoute);

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
