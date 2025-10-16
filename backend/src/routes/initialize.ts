import { Router } from "express";

import userRoutes from "./userRoutes";
import postRoutes from "./postRoutes";
import rootRoutes from "./rootRoutes";

const router = Router();

router.use("/", rootRoutes);
router.use("/user", userRoutes);
router.use("/post", postRoutes);

export default router;
