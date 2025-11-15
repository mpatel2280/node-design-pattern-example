/**
 * Base Logger class - defines the interface for all loggers
 * This is the Product interface in the Factory pattern
 */
class BaseLogger {
    constructor(name = "BaseLogger") {
        this.name = name;
        this.createdAt = new Date();
    }

    /**
     * Log an info message
     * @param {string} message - The message to log
     */
    log(message) {
        throw new Error("Method 'log()' must be implemented");
    }

    /**
     * Log a warning message
     * @param {string} message - The warning message to log
     */
    warn(message) {
        throw new Error("Method 'warn()' must be implemented");
    }

    /**
     * Log an error message
     * @param {string} message - The error message to log
     */
    error(message) {
        throw new Error("Method 'error()' must be implemented");
    }

    /**
     * Log a debug message
     * @param {string} message - The debug message to log
     */
    debug(message) {
        throw new Error("Method 'debug()' must be implemented");
    }

    /**
     * Format a message with timestamp and level
     * @param {string} level - The log level
     * @param {string} message - The message to format
     * @returns {string} Formatted message
     */
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] [${this.name}] ${message}`;
    }
}

export default BaseLogger;

