import { ItsAliveController } from "@/modules/outros/itsAlive/useCases/ItsAliveController";
import { PrometheusLogsController } from "@/modules/outros/metrics/useCases/PrometheusLogsController";
import { Router } from "express";

const outrosRouter = Router();

const itsAliveController =
    new ItsAliveController();
outrosRouter.get(
    "/itsAlive",
    itsAliveController.handle
);

const prometheusLogsController =
    new PrometheusLogsController()
outrosRouter.get(
    '/metrics',
    prometheusLogsController.handle
);

export { outrosRouter };