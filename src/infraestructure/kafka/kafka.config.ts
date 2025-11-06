import { logLevel } from "kafkajs";

export const kafkaConfig = {
    clientId: process.env.KAFKA_CLIENT_ID || process.env.APINAME,
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    logLevel: process.env.KAFKA_LOG_LEVEL ? parseInt(process.env.KAFKA_LOG_LEVEL) : logLevel.NOTHING,
};