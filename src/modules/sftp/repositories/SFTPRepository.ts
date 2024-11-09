import clientSFTP from 'ssh2-sftp-client';
import * as fs from 'fs';
import ISFTPRepository from '../repositories/interfaces/ISFTPRepository';

class SFTPRepository implements ISFTPRepository {
    buscaListaArquivosRetornoSFTP = async (host: string, port: number, username: string, password: string, path: string, fileExtension?: string): Promise<string[]> => {
        const sftp = new clientSFTP();

        await sftp.connect({
            host,
            port,
            username,
            password
        }).catch((error) => {
            sftp.end();
            throw new Error('Não foi possível conectar ao host. SystemError: ' + error.message);
        });

        const listaArquivos = (await sftp.list(path)).filter((file) => (fileExtension ? file.name.endsWith(`.${fileExtension}`) : true)).map(file => file.name);

        return listaArquivos
    };

    buscaArquivoRetornoSFTP = async (host: string, port: number, username: string, password: string, path: string, filename: string): Promise<any> => {
        const sftp = new clientSFTP();

        await sftp.connect({
            host,
            port,
            username,
            password
        }).catch((error) => {
            sftp.end();
            throw new Error('Não foi possível conectar ao host. SystemError: ' + error.message);
        });

        const conteudo = await sftp.get(`${path}/${filename}`).then((buffer: Buffer) => {
            return buffer
        });

        return conteudo;
    }

    deletaArquivoRetornoSFTP = async (host: string, port: number, username: string, password: string, path: string, filename: string): Promise<any> => {
        const sftp = new clientSFTP();

        await sftp.connect({
            host,
            port,
            username,
            password
        }).catch((error) => {
            sftp.end();
            throw new Error('Não foi possível conectar ao host. SystemError: ' + error.message);
        });

        const result = await sftp.delete(`${path}/${filename}`)

        return result;
    }

    enviaArquivoSFTP = async (fileLocal: string, originalFileName: string, host: string, port: number, username: string, password: string, path: string): Promise<string> => {
        const sftp = new clientSFTP();

        await sftp.connect({
            host,
            port,
            username,
            password
        }).catch((error) => {
            sftp.end();
            throw new Error('Não foi possível conectar ao host. SystemError: ' + error.message);
        });

        await sftp.put(fileLocal, `${path}/${originalFileName}`).catch((error) => {
            sftp.end();
            throw new Error('Não foi possível enviar o arquivo para o host. SystemError: ' + error.message);
        }).then(() => {
            sftp.end();

            //Exclui o arquivo após upload para o sftp
            if (fs.existsSync(fileLocal)) {
                fs.unlink(fileLocal, (err: NodeJS.ErrnoException | null) => {
                    if (err) {
                        throw new Error('Não foi possível deletar o arquivo no host');
                    }
                });
            }
        });

        return originalFileName
    }
}

export { SFTPRepository }