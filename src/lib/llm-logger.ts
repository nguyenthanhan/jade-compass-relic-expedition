interface LLMLogEntry {
  timestamp: string;
  provider: string;
  method: string;
  requestId: string;
  prompt?: string;
  systemPrompt?: string;
  response?: string;
  responseTime?: number;
  error?: string;
  metadata?: Record<string, any>;
}

interface LoggerConfig {
  enabled: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  maxEntries: number;
  includePrompts: boolean;
  includeResponses: boolean;
  includeTimings: boolean;
}

class LLMLogger {
  private logs: LLMLogEntry[] = [];
  private config: LoggerConfig = {
    enabled: true,
    logLevel: "debug",
    maxEntries: 100,
    includePrompts: true,
    includeResponses: true,
    includeTimings: true,
  };

  constructor(config?: Partial<LoggerConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Enable logging in development by default
    if (typeof window !== "undefined") {
      this.config.enabled = process.env.NODE_ENV === "development";
    }
  }

  updateConfig(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config };
  }

  generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  logRequest(
    provider: string,
    method: string,
    requestId: string,
    prompt?: string,
    systemPrompt?: string,
    metadata?: Record<string, any>
  ) {
    if (!this.config.enabled) return;

    const entry: LLMLogEntry = {
      timestamp: new Date().toISOString(),
      provider,
      method,
      requestId,
      metadata,
    };

    if (this.config.includePrompts) {
      if (prompt) entry.prompt = prompt;
      if (systemPrompt) entry.systemPrompt = systemPrompt;
    }

    this.addLog(entry);

    // Console logging
    console.group(`🤖 [LLM Request] ${provider} - ${method}`);
    console.log(`Request ID: ${requestId}`);
    console.log(`Time: ${entry.timestamp}`);

    if (this.config.includePrompts && systemPrompt) {
      // console.log(`System Prompt:`, systemPrompt.substring(0, 200) + "...");
      console.log(`System Prompt:`, systemPrompt);
    }

    if (this.config.includePrompts && prompt) {
      // console.log(`Prompt:`, prompt.substring(0, 200) + "...");
      console.log(`Prompt:`, prompt);
    }

    if (metadata) {
      console.log(`Metadata:`, metadata);
    }
    console.groupEnd();
  }

  logResponse(
    requestId: string,
    response?: string,
    responseTime?: number,
    error?: string,
    metadata?: Record<string, any>
  ) {
    if (!this.config.enabled) return;

    const existingEntry = this.logs.find((log) => log.requestId === requestId);
    if (existingEntry) {
      if (this.config.includeResponses && response) {
        existingEntry.response = response;
      }

      if (this.config.includeTimings && responseTime) {
        existingEntry.responseTime = responseTime;
      }

      if (error) {
        existingEntry.error = error;
      }

      if (metadata) {
        existingEntry.metadata = { ...existingEntry.metadata, ...metadata };
      }
    }

    // Console logging
    console.group(
      `🤖 [LLM Response] ${existingEntry?.provider} - ${existingEntry?.method}`
    );
    console.log(`Request ID: ${requestId}`);

    if (error) {
      console.error(`Error:`, error);
    } else {
      if (this.config.includeTimings && responseTime) {
        console.log(`⏱️ Response time: ${responseTime}ms`);
      }

      if (this.config.includeResponses && response) {
        console.log(`Response:`, response);
      }
    }

    if (metadata) {
      console.log(`Metadata:`, metadata);
    }
    console.groupEnd();
  }

  private addLog(entry: LLMLogEntry) {
    this.logs.push(entry);

    // Remove old entries if we exceed max
    if (this.logs.length > this.config.maxEntries) {
      this.logs = this.logs.slice(-this.config.maxEntries);
    }
  }

  getLogs(
    filter?: Partial<Pick<LLMLogEntry, "provider" | "method">>
  ): LLMLogEntry[] {
    let filteredLogs = [...this.logs];

    if (filter?.provider) {
      filteredLogs = filteredLogs.filter(
        (log) => log.provider === filter.provider
      );
    }

    if (filter?.method) {
      filteredLogs = filteredLogs.filter((log) => log.method === filter.method);
    }

    return filteredLogs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getStats() {
    const totalRequests = this.logs.length;
    const errorCount = this.logs.filter((log) => log.error).length;
    const successCount = totalRequests - errorCount;

    const responseTimeStats = this.logs
      .filter((log) => log.responseTime)
      .map((log) => log.responseTime!)
      .sort((a, b) => a - b);

    const avgResponseTime =
      responseTimeStats.length > 0
        ? responseTimeStats.reduce((sum, time) => sum + time, 0) /
          responseTimeStats.length
        : 0;

    const providerStats = this.logs.reduce((acc, log) => {
      acc[log.provider] = (acc[log.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRequests,
      successCount,
      errorCount,
      successRate:
        totalRequests > 0
          ? ((successCount / totalRequests) * 100).toFixed(2) + "%"
          : "0%",
      avgResponseTime: Math.round(avgResponseTime),
      minResponseTime: responseTimeStats[0] || 0,
      maxResponseTime: responseTimeStats[responseTimeStats.length - 1] || 0,
      providerStats,
      recentLogs: this.getLogs().slice(0, 5),
    };
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs() {
    this.logs = [];
    console.log("🗑️ LLM logs cleared");
  }
}

// Create a singleton instance
export const llmLogger = new LLMLogger();

// Global access for debugging in browser
if (typeof window !== "undefined") {
  (window as any).llmLogger = llmLogger;
  (window as any).getLLMLogs = () => llmLogger.getLogs();
  (window as any).getLLMStats = () => llmLogger.getStats();
  (window as any).clearLLMLogs = () => llmLogger.clearLogs();
  (window as any).exportLLMLogs = () => {
    const logs = llmLogger.exportLogs();
    const blob = new Blob([logs], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jade-compass-llm-logs-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  console.log("🤖 LLM Logger initialized! Available commands:");
  console.log("- getLLMLogs() - View all logs");
  console.log("- getLLMStats() - View statistics");
  console.log("- clearLLMLogs() - Clear logs");
  console.log("- exportLLMLogs() - Download logs as JSON");
}

// Export types
export type { LLMLogEntry, LoggerConfig };
