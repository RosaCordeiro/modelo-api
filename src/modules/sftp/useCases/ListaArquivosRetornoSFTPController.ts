import { Request, Response } from "express";
import { container } from "tsyringe"
import ListaArquivosRetornoSFTPUseCase from "./ListaArquivosRetornoSFTPUseCase"

class ListaArquivosRetornoSFTPController {

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const listaArquivosRetornoSFTPUseCase = container.resolve(
                ListaArquivosRetornoSFTPUseCase
            )

            const host = request.query.host as string
            const port = Number(request.query.port)
            const username = request.query.username as string
            const password = request.query.password as string
            const path = request.query.path as string
            const fileExtension = request.query.fileExtension as string

            const arquivos = await listaArquivosRetornoSFTPUseCase.execute(host, port, username, password, path, fileExtension)

            return response.status(201).send(arquivos)
        } catch (error) {
            return response.status(500).json(`Erro: ${error.message}`)
        }
    }
}

export default ListaArquivosRetornoSFTPController