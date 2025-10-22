import express from "express";

import middleware from "@middleware/initialize";
import routes from "@routes/initialize";
import { notFoundHandler, errorHandler } from "@middleware/errorHandler";

const app = express();

app.use(middleware);

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
