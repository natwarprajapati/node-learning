import express from "express";
import userRoutes from "./routes/user.routes.js";
import homepageRoutes from "./routes/homepage.routes.js";
import logger from "./middlewares/logger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(logger);

app.use("/api", userRoutes);
app.use("/", homepageRoutes);

app.use(errorHandler);

export default app;
