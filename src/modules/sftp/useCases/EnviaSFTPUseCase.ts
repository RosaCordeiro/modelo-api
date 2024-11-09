import { inject, injectable } from "tsyringe";
import ISFTPRepository from "../repositories/interfaces/ISFTPRepository";

@injectable()
class EnviaSFTPUseCase {
    constructor(
        @inject("SFTPRepository")
        private SFTPRepository: ISFTPRepository
    ) { }

    async execute(fileLocal: string, originalFileName: string, host: string, port: number, username: string, password: string, path: string) {
        return this.SFTPRepository.enviaArquivoSFTP(fileLocal, originalFileName, host, port, username, password, path)
    }

}

export { EnviaSFTPUseCase }