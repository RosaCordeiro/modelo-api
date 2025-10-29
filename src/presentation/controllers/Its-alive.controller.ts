import { Request, Response } from "express";

class ItsAliveController {
    async handle(request: Request, response: Response): Promise<Response> {
        return response.status(200).json({
            api: `${process.env.APINAME} (${process.env.AMBIENTE})`
        })
    }
}

export { ItsAliveController }