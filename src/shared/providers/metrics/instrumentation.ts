import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MeterProvider, MeterProviderOptions } from '@opentelemetry/sdk-metrics';
import { metrics } from '@opentelemetry/api';
import os from 'os';
import v8 from "v8";
import fs from 'fs';
import { Request, Response } from 'express';
import { PerformanceObserver, monitorEventLoopDelay } from 'perf_hooks';


function getEnvorimentVariables() {
    const apiName = process.env.APINAME;
    const environment = process.env.AMBIENTE;

    if (!apiName || !environment) {
        throw new Error("Variáveis de ambiente APINAME and AMBIENTE precisam ser definidas para métricas.");
    }

    return { apiName, environment };
}

const prometheusExporter = new PrometheusExporter(
    { preventServerStart: true }
);

const op: MeterProviderOptions = {
    readers: [prometheusExporter],
};

const meterProvider = new MeterProvider({
    readers: [prometheusExporter]
});

metrics.setGlobalMeterProvider(meterProvider);

const meter = metrics.getMeter(getEnvorimentVariables().apiName);

/* Métricas de memória */
/*** Memória Total ***/
const memoryTotal = meter.createObservableGauge('custom_telemetry_host_memory_total_bytes', { description: 'RAM total disponivel' });
memoryTotal.addCallback(result => { result.observe(os.totalmem(), { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment }); });

/*** Memória heap utilizada ***/
const memoryHeapUsed = meter.createObservableGauge('custom_telemetry_process_memory_heap_used_bytes', { description: 'Heap JS em uso' });
memoryHeapUsed.addCallback(result => { result.observe(process.memoryUsage().heapUsed, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment }) });

/*** Memória heap alocada ***/
const memoryHeapTotal = meter.createObservableGauge('custom_telemetry_process_memory_heap_total_bytes', { description: 'Heap JS alocada' });
memoryHeapTotal.addCallback(result => { result.observe(process.memoryUsage().heapTotal, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment }) });

/*** Memória heap alocada ***/
const memoryHeapTotalGauge = meter.createObservableGauge('custom_telemetry_process_memory_heap_total_bytes_gauge', { description: 'Heap JS alocada (Gauge)' });
memoryHeapTotalGauge.addCallback(result => { result.observe((process.memoryUsage().heapTotal / os.totalmem()) * 100, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment }) });

/*** Memória heap limíte ***/
const memoryHeapLimit = meter.createObservableGauge('custom_telemetry_process_memory_heap_limit_bytes', { description: 'Limite maximo da heap' });
memoryHeapLimit.addCallback(result => { result.observe(v8.getHeapStatistics().heap_size_limit, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment }) });

/*** RAM usada ***/
const memoryRAMUsed = meter.createObservableGauge('custom_telemetry_process_memory_rss_bytes', { description: 'RAM real usada pelo Node' });
memoryRAMUsed.addCallback(result => { result.observe(process.memoryUsage().rss, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment }) });

/* CPU */
/*** Tempo CPU usuário ***/
const cpuUserGauge = meter.createObservableGauge('custom_telemetry_process_cpu_user_seconds_total', { description: 'Tempo de CPU em modo usuario gasto pelo processo Node.js' });
cpuUserGauge.addCallback(result => {
    const usage = process.cpuUsage();
    result.observe(usage.user / 1e6, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment });
});

/*** Tempo CPU sistema ***/
const cpuSystemGauge = meter.createObservableGauge('custom_telemetry_process_cpu_system_seconds_total', { description: 'Tempo de CPU em modo sistema gasto pelo processo Node.js' });
cpuSystemGauge.addCallback(result => {
    const usage = process.cpuUsage();
    result.observe(usage.system / 1e6, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment });
});

/*** Tempo CPU processo ***/
const cpuPercentGauge = meter.createObservableGauge('custom_telemetry_process_cpu_percent', { description: 'Percentual de uso de CPU do processo Node.js' });

let lastCpuUsage = process.cpuUsage();
let lastTime = process.hrtime.bigint();

cpuPercentGauge.addCallback(result => {
    const usage = process.cpuUsage();
    const now = process.hrtime.bigint();

    const diffUser = usage.user - lastCpuUsage.user;
    const diffSystem = usage.system - lastCpuUsage.system;
    const elapsedMs = Number(now - lastTime) / 1e6;
    const cpuPercent = (diffUser + diffSystem) / 1000 / elapsedMs * 100 / os.cpus().length;

    result.observe(cpuPercent, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment });

    lastCpuUsage = usage;
    lastTime = now;
});

/*** Tempo CPU host ***/
let lastHostTimes = os.cpus().map(cpu => cpu.times);

const hostCpuUsageGauge = meter.createObservableGauge('custom_telemetry_host_cpu_usage_percent', { description: 'Percentual medio de uso de CPU no host/container' });
hostCpuUsageGauge.addCallback(result => {
    const cpus = os.cpus();
    let idleDiff = 0, totalDiff = 0;

    cpus.forEach((cpu, i) => {
        const old = lastHostTimes[i];
        const idle = cpu.times.idle - old.idle;
        const total = Object.values(cpu.times).reduce((a, b) => a + b, 0) -
            Object.values(old).reduce((a, b) => a + b, 0);
        idleDiff += idle;
        totalDiff += total;
    });

    const usagePercent = 100 * (1 - idleDiff / totalDiff);
    result.observe(usagePercent, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment });

    lastHostTimes = cpus.map(cpu => cpu.times);
});

/* CPU */
/*** Up Time ***/
const upTime = meter.createObservableGauge('custom_telemetry_process_uptime_seconds', { description: 'Tempo total que o processo esta em execucao.' });
upTime.addCallback(result => { result.observe(process.uptime(), { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment }) });

/*** EventLoop ***/
const h = monitorEventLoopDelay({ resolution: 10 });
h.enable();

const lagGauge = meter.createObservableGauge('custom_telemetry_event_loop_lag_seconds', {
    description: 'Atraso medio do event loop em segundos',
});

lagGauge.addCallback((result) => {
    const lagSec = h.mean / 1e9; // mean está em nanosegundos
    result.observe(lagSec, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment });
});

/*** Arquivos (FS) ***/
const fdsGauge = meter.createObservableGauge('custom_telemetry_process_open_fds', { description: 'Numero de descritores de arquivo abertos' });
fdsGauge.addCallback((result) => {
    const fdCount = fs.readdirSync('/proc/self/fd').length;
    result.observe(fdCount, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment });
});

/*** Processos ativos ***/
const handlesGauge = meter.createObservableGauge('custom_telemetry_process_active_handles', { description: 'Numero de handles ativos (timers, sockets, etc.)' });
handlesGauge.addCallback((result) => {
    const activeHandles = (process as any)._getActiveHandles().length;
    result.observe(activeHandles, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment });
});

/*** Tempo Garbage Collection ***/
const gcGauge = meter.createObservableGauge('custom_telemetry_process_gc_duration_seconds', { description: 'Tempo gasto em garbage collection (segundos)' });

let gcTotalNs = 0;

const obs = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (entry.entryType === 'gc') {
            gcTotalNs += entry.duration * 1e6; // entry.duration em ms → ns
        }
    });
});

obs.observe({ entryTypes: ['gc'], buffered: true });

gcGauge.addCallback((result) => {
    result.observe(gcTotalNs / 1e9, { service_name: getEnvorimentVariables().apiName, environment: getEnvorimentVariables().environment }); // converte ns → s
});

export const metricsHandler = async (req: Request, res: Response) => {
    return prometheusExporter.getMetricsRequestHandler(req, res);
};
