import { config } from "dotenv";

config(); // carga el .env

export const MONGO = {
  MONGO_URI: process.env.MONGO_URI as string,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME as string,
};

export const APP = {
  PORT: process.env.PORT || 4000,
};

export const SECRET = {
  SECRET: process.env.SECRET as string,

};
