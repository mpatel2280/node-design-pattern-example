import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Logger - Singleton class for application-wide logging
 * Provides consistent logging to both console and file
 *
 * This is a Singleton pattern implementation using ES6 modules.
 * Node.js caches module exports, ensuring only one instance exists.
 */
class Logger {
    constructor() {
        this.logFile = path.join(__dirname, "app.log");
        this.logLevel = "INFO"; // INFO, WARN, ERROR, DEBUG
        this.logCount = 0;
        this.errorCount = 0;
        this.warnCount = 0;
        this.debugCount = 0;

        // Initialize log file with header
        this.initializeLogFile();
    }

    /**
     * Initialize the log file with a header
     */
    initializeLogFile() {
        if (!fs.existsSync(this.logFile)) {
            const header = `=== Logger initialized at ${new Date().toISOString()} ===\n`;
            fs.writeFileSync(this.logFile, header);
        }
    }

    /**
     * Format a log message with timestamp and level
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @returns {string} Formatted message
     */
    formatMessage(level, message) {
        return `[${new Date().toISOString()}] [${level}] ${message}`;
    }

    /**
     * Write to log file
     * @param {string} message - Message to write
     */
    writeToFile(message) {
        try {
            fs.appendFileSync(this.logFile, message + "\n");
        } catch (error) {
            console.error("Failed to write to log file:", error.message);
        }
    }

    /**
     * Log an info message
     * @param {string} message - Message to log
     */
    log(message) {
        const formatted = this.formatMessage("INFO", message);
        console.log(formatted);
        this.writeToFile(formatted);
        this.logCount++;
    }

    /**
     * Log an error message
     * @param {string} message - Error message to log
     */
    error(message) {
        const formatted = this.formatMessage("ERROR", message);
        console.error(formatted);
        this.writeToFile(formatted);
        this.errorCount++;
    }

    /**
     * Log a warning message
     * @param {string} message - Warning message to log
     */
    warn(message) {
        const formatted = this.formatMessage("WARN", message);
        console.warn(formatted);
        this.writeToFile(formatted);
        this.warnCount++;
    }

    /**
     * Log a debug message
     * @param {string} message - Debug message to log
     */
    debug(message) {
        if (this.logLevel === "DEBUG") {
            const formatted = this.formatMessage("DEBUG", message);
            console.log(formatted);
            this.writeToFile(formatted);
            this.debugCount++;
        }
    }

    /**
     * Set the log level
     * @param {string} level - Log level (INFO, WARN, ERROR, DEBUG)
     */
    setLogLevel(level) {
        this.logLevel = level.toUpperCase();
        this.log(`Log level set to ${this.logLevel}`);
    }

    /**
     * Get logging statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        return {
            totalLogs: this.logCount,
            errors: this.errorCount,
            warnings: this.warnCount,
            debugs: this.debugCount,
            logFile: this.logFile
        };
    }

    /**
     * Clear the log file
     */
    clearLog() {
        const header = `=== Log cleared at ${new Date().toISOString()} ===\n`;
        fs.writeFileSync(this.logFile, header);
        this.log("Log file cleared");
    }

    /**
     * Get the log file path
     * @returns {string} Log file path
     */
    getLogFilePath() {
        return this.logFile;
    }

    /**
     * Read the log file contents
     * @returns {string} Log file contents
     */
    readLog() {
        try {
            return fs.readFileSync(this.logFile, "utf-8");
        } catch (error) {
            this.error(`Failed to read log file: ${error.message}`);
            return "";
        }
    }
}

// Export a single instance (Singleton pattern using ES6 modules)
// Node.js caches module exports, so every import gets the same instance
export default new Logger();
