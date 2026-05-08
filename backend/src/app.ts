import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { authRouter } from "./modules/auth/routes";
import { listingsRouter } from "./modules/listings/routes";
import { verificationRouter } from "./modules/verification/routes";

const app = express();
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 300 });
app.use("/api/", limiter);

app.use("/api/auth", authRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/verification", verificationRouter);

app.use(errorHandler);

export default app;
