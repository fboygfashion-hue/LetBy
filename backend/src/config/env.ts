import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET!,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN!,
  DATABASE_URL: process.env.DATABASE_URL!,
  CLIENT_URL: process.env.CLIENT_URL!,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || "",
};
