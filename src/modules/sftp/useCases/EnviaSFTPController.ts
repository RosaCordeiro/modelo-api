import { Request, Response } from "express";
import { EnviaSFTPUseCase } from "./EnviaSFTPUseCase";
import { container } from "tsyringe";

class EnviaSFTPController {

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            if (!request.file) {
                return response.status(400).send('Nenhum arquivo enviado.');
            }

            const enviaSFTPUseCase = container.resolve(
                EnviaSFTPUseCase
            )

            const host = request.query.host as string
            const port = Number(request.query.port)
            const username = request.query.username as string
            const password = request.query.password as string
            const path = request.query.path as string

            const resultEnviaSFTP = await enviaSFTPUseCase.execute(request.file.path, request.file.originalname, host, port, username, password, path)

            return response.status(201).json(resultEnviaSFTP)
        } catch (error) {
            return response.status(500).json(`Erro: ${error.message}`)
        }
    }
}

export { EnviaSFTPController }