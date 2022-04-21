export const cpuConfig = {
  /** total availibility zones */
  MAX_AZS: 2,

  /** total availibility zones */
  MAX_CPUS: 2,

  /** total availibility zones */
  TARGET_CPU_UTILIZATION_PERCENT: 70,

  /** total availibility zones */
  COOLDOWN_PERIOD_SECONDS: 60,

  /**
     * The number of cpu units used by the task
     * 256 (.25 vCPU) - Available memory values: 512 (0.5 GB), 1024 (1 GB), 2048 (2 GB)
     * 512 (.5 vCPU) - Available memory values: 1024 (1 GB), 2048 (2 GB), 3072 (3 GB), 4096 (4 GB)
     * 1024 (1 vCPU) - Available memory values: 2048 (2 GB), 3072 (3 GB), 4096 (4 GB), 5120 (5 GB), 6144 (6 GB), 7168 (7 GB), 8192 (8 GB)
     * 2048 (2 vCPU) - Available memory values: Between 4096 (4 GB) and 16384 (16 GB) in increments of 1024 (1 GB)
     * 4096 (4 vCPU) - Available memory values: Between 8192 (8 GB) and 30720 (30 GB) in increments of 1024 (1 GB)
     */
  MAX_CPU_UNITS: 512,
  /**
     * The amount (in MiB) of memory used by the task.
     * 512 (0.5 GB), 1024 (1 GB), 2048 (2 GB)
     * 1024 (1 GB), 2048 (2 GB), 3072 (3 GB), 4096 (4 GB)
     * 2048 (2 GB), 3072 (3 GB), 4096 (4 GB), 5120 (5 GB), 6144 (6 GB), 7168 (7 GB), 8192 (8 GB)
     * Between 4096 (4 GB) and 16384 (16 GB) in increments of 1024 (1 GB)
     * Between 8192 (8 GB) and 30720 (30 GB) in increments of 1024 (1 GB)
     */
  MAX_CPU_RAM: 2048,
};
