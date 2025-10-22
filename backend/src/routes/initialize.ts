import { Router } from "express";

import userRoutes from "@routes/userRoutes";
import postRoutes from "@routes/postRoutes";
import rootRoutes from "@routes/rootRoutes";

const router = Router();

router.use("/", rootRoutes);
router.use("/user", userRoutes);
router.use("/post", postRoutes);

export default router;
