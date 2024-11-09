import { Request, Response } from "express";
import client from 'prom-client';

class PrometheusLogsController {
    async handle(request: Request, response: Response): Promise<void> {
        response.set('Content-Type', client.register.contentType);
        response.end(await client.register.metrics());
    }
}

export { PrometheusLogsController }