import { Router } from "express";
import morgan from "morgan";

import config from "@config";

const router = Router();

router.use(morgan(config.morgan));

export default router;
