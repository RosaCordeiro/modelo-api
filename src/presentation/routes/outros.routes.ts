import { metricsHandler } from './../../shared/providers/metrics/instrumentation';
import { ItsAliveController } from "@/presentation/controllers/ItsAliveController";
import { Router } from "express";

const outrosRouter = Router();

const itsAliveController =
    new ItsAliveController();
outrosRouter.get(
    "/itsAlive",
    itsAliveController.handle
);

outrosRouter.get(
    "/metrics",
    metricsHandler
)

export { outrosRouter };