import "reflect-metadata"
import "dotenv/config";
import "@/shared/container";
import { logger } from "@/shared/singletons/logger.singleton";
import { app } from "@/shared/singletons/app.singleton";

const port = process.env.PORT

app.listen(port, () => {
    logger.info(`Ouvindo na porta: ${port}`);
})
