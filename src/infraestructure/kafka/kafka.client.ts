import { Kafka } from 'kafkajs';
import { kafkaConfig } from './kafka.config';

const kafkaClient = new Kafka({
    clientId: kafkaConfig.clientId,
    brokers: kafkaConfig.brokers,
    logLevel: kafkaConfig.logLevel,
});

export { kafkaClient };