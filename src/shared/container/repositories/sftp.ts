import ISFTPRepository from "@/modules/sftp/repositories/interfaces/ISFTPRepository";
import { SFTPRepository } from "@/modules/sftp/repositories/SFTPRepository";
import { container } from "tsyringe";

container.registerSingleton<ISFTPRepository>(
    "SFTPRepository",
    SFTPRepository
);