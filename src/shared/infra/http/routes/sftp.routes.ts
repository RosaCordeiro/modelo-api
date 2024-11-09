import { BuscaRetornoSFTPController } from "@/modules/sftp/useCases/BuscaRetornoSFTPController";
import { DeletaArquivoRetornoSFTPController } from "@/modules/sftp/useCases/DeletaArquivoRetornoSFTPController";
import { EnviaSFTPController } from "@/modules/sftp/useCases/EnviaSFTPController";
import ListaArquivosRetornoSFTPController from "@/modules/sftp/useCases/ListaArquivosRetornoSFTPController";
import { Router } from "express";
import multer from "multer"

const SFTPRouter = Router();

const upload = multer({ dest: 'uploads/' });

const enviaSFTPController =
    new EnviaSFTPController();
SFTPRouter.post(
    "/enviaSFTP",
    upload.single('file'),
    enviaSFTPController.handle
);

const buscaSFTPController =
    new BuscaRetornoSFTPController();
SFTPRouter.get(
    "/buscaRetorno",
    buscaSFTPController.handle
);

const listaArquivosRetornoSFTPController = new ListaArquivosRetornoSFTPController();
SFTPRouter.get(
    "/listaArquivosRetorno",
    listaArquivosRetornoSFTPController.handle
);

const deletaArquivoRetornoSFTPController = new DeletaArquivoRetornoSFTPController();
SFTPRouter.delete(
    "/deletaArquivoRetorno",
    deletaArquivoRetornoSFTPController.handle
);

export { SFTPRouter };