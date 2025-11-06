import { logger } from "@/shared/singletons/logger.singleton";
import { createTopicsFromYaml } from "./kafka.create-topics";

export class MainServer {
    public async start(): Promise<void> {
        logger.info(`Iniciando aplicação.`);

        await createTopicsFromYaml();

        process.on('SIGINT', () => this.shutdown());
        process.on('SIGTERM', () => this.shutdown());

        logger.info(`Servidor Kafka iniciado.`);
    }

    private shutdown(): void {
        logger.warn(`Encerrando aplicação.`);

        process.exit(0);
    }
}

(async () => {
    const server = new MainServer();
    await server.start();
})();