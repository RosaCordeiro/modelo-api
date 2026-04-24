import { metricsHandler } from 'light-node-metrics';
import { ItsAliveController } from "@/presentation/controllers/Its-alive.controller";
import { getLoggerLevel, loggerLevelHandler } from '@/shared/singletons/logger.singleton';
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

outrosRouter.post(
    "/log-level",
    loggerLevelHandler
)

outrosRouter.get(
    "/actives-log-levels",
    getLoggerLevel
)

export { outrosRouter };