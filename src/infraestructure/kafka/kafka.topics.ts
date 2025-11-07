import fs from "fs";
import yaml from "js-yaml";
import { kafkaClient } from "./kafka.client";
import { logger } from "@/shared/singletons/logger.singleton";

export type KafkaTopicConfigEntry = {
    name: string;
    retention_ms?: number;
};

export type KafkaTopicYamlConfig = {
    partitions: number;
    replication: number;
    topics: KafkaTopicConfigEntry[];
    retry_topics: KafkaTopicConfigEntry[];
    dlq_topics: KafkaTopicConfigEntry[];
};

export enum KafkaTopicType {
    NORMAL = "normal",
    RETRY = "retry",
    DLQ = "dlq",
}

export type KafkaTopicConfig = {
    topic: string;
    numPartitions: number;
    type?: KafkaTopicType;
    replicationFactor?: number;
    configEntries?: { name: string; value: string }[];
};

async function getTopicsFromYaml(configPath = "config/kafka-topics.yml"): Promise<KafkaTopicConfig[]> {
    const file = fs.readFileSync(configPath, "utf8");
    if (!file) {
        logger.info(`Arquivo de configuração de tópicos Kafka não encontrado em ${configPath}. Nenhum tópico será retornado.`);
        return [];
    }
    const config = yaml.load(file) as KafkaTopicYamlConfig;

    const topicsConfig: KafkaTopicConfig[] = [
        ...config.topics.map((t) => ({
            topic: t.name,
            numPartitions: config.partitions,
            replicationFactor: config.replication,
            type: KafkaTopicType.NORMAL,
        })),
        ...config.retry_topics.map((t) => ({
            topic: t.name,
            numPartitions: config.partitions,
            replicationFactor: config.replication,
            type: KafkaTopicType.RETRY,
            configEntries: [
                { name: "retention.ms", value: '604800000' },
                { name: "cleanup.policy", value: "delete" },
            ],
        })),
        ...config.dlq_topics.map((t) => ({
            topic: t.name,
            numPartitions: config.partitions,
            replicationFactor: config.replication,
            type: KafkaTopicType.DLQ,
            configEntries: [
                { name: "retention.ms", value: '604800000' },
                { name: "cleanup.policy", value: "delete" },
            ],
        })),
    ];

    return topicsConfig
}

async function createTopicsFromYaml(configPath = "config/kafka-topics.yml") {
    logger.debug(`Criando/verificando tópicos Kafka a partir do arquivo YML.`);

    const admin = kafkaClient.admin();
    await admin.connect();

    logger.debug(`Conectado ao Kafka como admin.`);

    const topicsConfig: KafkaTopicConfig[] = await getTopicsFromYaml(configPath);

    logger.debug(`Verificando existencia dos tópicos configurados no Kafka.`);

    const existingTopics = await admin.listTopics();

    const topicsToCreate = topicsConfig.filter(
        (t) => !existingTopics.includes(t.topic)
    );

    if (existingTopics.length > 0) {
        logger.debug(`Tópicos existentes no Kafka: ${existingTopics}`);
    }

    if (topicsToCreate.length > 0) {
        logger.info(`Tópicos a serem criados: ${topicsToCreate.map((t) => t.topic)}`);
    }

    if (topicsToCreate.length > 0) {
        logger.debug(`Criando tópicos: ${topicsToCreate.map((t) => t.topic).join(", ")})`)
        await admin.createTopics({ topics: topicsToCreate });
        logger.info(`Criado tópicos: ${topicsToCreate.map((t) => t.topic).join(", ")})`)
    } else {
        logger.debug(`Todos os tópicos já existem.`);
    }

    await admin.disconnect();
}

export { createTopicsFromYaml, getTopicsFromYaml };