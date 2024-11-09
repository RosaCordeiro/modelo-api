import { Router } from "express";
import { outrosRouter } from "./outros.routes";
import { SFTPRouter } from "./sftp.routes";

const router = Router();

router.use('/outros', outrosRouter);
router.use('/sftp', SFTPRouter);

export { router };