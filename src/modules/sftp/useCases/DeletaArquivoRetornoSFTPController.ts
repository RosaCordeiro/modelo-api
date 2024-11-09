import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeletaArquivoRetornoSFTPUseCase } from "./DeletaArquivoRetornoSFTPUseCase";

class DeletaArquivoRetornoSFTPController {
    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const deletaArquivoRetornoSFTPUseCase = container.resolve(
                DeletaArquivoRetornoSFTPUseCase
            )

            const host = request.query.host as string
            const port = Number(request.query.port)
            const username = request.query.username as string
            const password = request.query.password as string
            const path = request.query.path as string
            const filename = request.query.filename as string

            const arquivos = await deletaArquivoRetornoSFTPUseCase.execute(host, port, username, password, path, filename)

            return response.status(201).send
                (
                    arquivos
                )
        } catch (error) {
            return response.status(500).json(`Erro: ${error.message}`)
        }
    }
}

export { DeletaArquivoRetornoSFTPController }