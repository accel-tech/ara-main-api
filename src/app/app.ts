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
app.use("/departments", require("./departments/routes").default);
app.use("/users", require("./users/routes").default);
app.use("/reports", require("./reports/routes").default);
app.use("/certifications", require("./certifications/routes").default);
app.use("/projects", require("./projects/routes").default);

app.use(errorHandler);

const server = http.createServer(app);

export default server;
