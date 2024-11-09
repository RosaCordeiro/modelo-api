import { inject, injectable } from "tsyringe";
import ISFTPRepository from "../repositories/interfaces/ISFTPRepository";

@injectable()
class DeletaArquivoRetornoSFTPUseCase {
    constructor(
        @inject("SFTPRepository")
        private SFTPRepository: ISFTPRepository
    ) { }

    async execute(host: string, port: number, username: string, password: string, path: string, filename: string) {
        return this.SFTPRepository.deletaArquivoRetornoSFTP(host, port, username, password, path, filename)
    }
}

export { DeletaArquivoRetornoSFTPUseCase }