import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { getCorsOptions } from "../config/utils/misc";
import { errorHandler } from "../config/middlewares/errorHandler";

export const app = express();

app.use(morgan("dev"));

app.use(cors(getCorsOptions()));

app.use("/auth", require("./auth/routes").default);

app.use(errorHandler);

const server = http.createServer(app);

export default server;
