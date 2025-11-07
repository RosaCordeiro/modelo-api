import { Request, Response } from 'express';
import { LoggerProvider } from '../providers/logger/create-logger.provider';

export const logger = new LoggerProvider({
    pretty: process.env.NODE_ENV !== 'production',
    logDir: './logs',
    maxSize: '5M',
    rotateInterval: '1d',
    maxFiles: 10,
});

export const loggerLevelHandler = async (req: Request, res: Response) => {
    const { logLevel } = req.body

    const levelAlterado = logger.setLevel(logLevel);

    if (levelAlterado) {
        return res.status(200).json(`Log level alterado com sucesso para: ${logLevel}`)
    } else {
        return res.status(400).json(`Log level não alterado.`)
    }
};

export const getLoggerLevel = async (req: Request, res: Response) => {
    const activeLevels = logger.getActiveLevels();

    if (activeLevels) {
        return res.status(200).json(`Levels de logs ativos: ${activeLevels}`)
    } else {
        return res.status(400).json(`Erro ao localizar levels de logs.`)
    }
};