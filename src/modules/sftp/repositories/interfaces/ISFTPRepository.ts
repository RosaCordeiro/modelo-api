interface ISFTPRepository {
    enviaArquivoSFTP: (fileLocal: string, originalFileName: string, host: string, port: number, username: string, password: string, path: string) => Promise<string>;
    buscaArquivoRetornoSFTP: (host: string, port: number, username: string, password: string, path: string, filename: string) => Promise<any>
    deletaArquivoRetornoSFTP: (host: string, port: number, username: string, password: string, path: string, filename: string) => Promise<any>
    buscaListaArquivosRetornoSFTP: (host: string, port: number, username: string, password: string, path: string, fileExtension?: string) => Promise<Array<string>>
}

export default ISFTPRepository