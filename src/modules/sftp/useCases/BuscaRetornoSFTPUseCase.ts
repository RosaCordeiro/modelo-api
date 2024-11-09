import { inject, injectable } from "tsyringe";
import ISFTPRepository from "../repositories/interfaces/ISFTPRepository";

@injectable()
class BuscaRetornoSFTPUseCase {
    constructor(
        @inject("SFTPRepository")
        private SFTPRepository: ISFTPRepository
    ) { }

    async execute(host: string, port: number, username: string, password: string, path: string, filename: string) {
        return this.SFTPRepository.buscaArquivoRetornoSFTP(host, port, username, password, path, filename)
    }

}

export { BuscaRetornoSFTPUseCase }