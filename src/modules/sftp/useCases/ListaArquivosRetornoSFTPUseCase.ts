import { inject, injectable } from "tsyringe"
import ISFTPRepository from "../repositories/interfaces/ISFTPRepository"

@injectable()
class ListaArquivosRetornoSFTPUseCase {
    constructor(
        @inject("SFTPRepository")
        private SFTPRepository: ISFTPRepository
    ) { }

    async execute(host: string, port: number, username: string, password: string, path: string, fileExtension: string) {
        return this.SFTPRepository.buscaListaArquivosRetornoSFTP(host, port, username, password, path, fileExtension)
    }
}

export default ListaArquivosRetornoSFTPUseCase