import { Router } from "express";
import { outrosRouter } from "./outros.routes";

const router = Router();

router.use('/', outrosRouter);

export { router };