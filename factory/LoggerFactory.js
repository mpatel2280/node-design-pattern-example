import ConsoleLogger from "./ConsoleLogger.js";
import FileLogger from "./FileLogger.js";
import DatabaseLogger from "./DatabaseLogger.js";
import CompositeLogger from "./CompositeLogger.js";

/**
 * LoggerFactory - Factory class for creating logger instances
 * This is the Factory in the Factory pattern
 */
class LoggerFactory {
    /**
     * Logger types enum
     */
    static LoggerTypes = {
        CONSOLE: "console",
        FILE: "file",
        DATABASE: "database",
        COMPOSITE: "composite"
    };

    /**
     * Create a logger instance based on the type
     * @param {string} type - The type of logger to create
     * @param {Object} options - Optional configuration for the logger
     * @returns {BaseLogger} The created logger instance
     */
    static createLogger(type, options = {}) {
        switch (type.toLowerCase()) {
            case LoggerFactory.LoggerTypes.CONSOLE:
                return new ConsoleLogger();

            case LoggerFactory.LoggerTypes.FILE:
                return new FileLogger(options.filename);

            case LoggerFactory.LoggerTypes.DATABASE:
                return new DatabaseLogger();

            case LoggerFactory.LoggerTypes.COMPOSITE:
                const loggers = options.loggers || [];
                return new CompositeLogger(loggers);

            default:
                throw new Error(`Unknown logger type: ${type}. Available types: ${Object.values(LoggerFactory.LoggerTypes).join(", ")}`);
        }
    }

    /**
     * Create a composite logger with multiple logger types
     * @param {Array<string>} types - Array of logger types to include
     * @param {Object} options - Optional configuration for loggers
     * @returns {CompositeLogger} A composite logger with all specified loggers
     */
    static createCompositeLogger(types, options = {}) {
        const loggers = types.map(type => this.createLogger(type, options));
        return new CompositeLogger(loggers);
    }

    /**
     * Create a logger based on environment
     * @param {string} env - The environment (development, production, test)
     * @returns {BaseLogger} The appropriate logger for the environment
     */
    static createLoggerForEnvironment(env = "development") {
        switch (env.toLowerCase()) {
            case "development":
                // In development, log to console and file
                return this.createCompositeLogger(
                    [LoggerFactory.LoggerTypes.CONSOLE, LoggerFactory.LoggerTypes.FILE],
                    { filename: "dev.log" }
                );

            case "production":
                // In production, log to file and database
                return this.createCompositeLogger(
                    [LoggerFactory.LoggerTypes.FILE, LoggerFactory.LoggerTypes.DATABASE],
                    { filename: "production.log" }
                );

            case "test":
                // In test, only log to file
                return this.createLogger(LoggerFactory.LoggerTypes.FILE, { filename: "test.log" });

            default:
                // Default to console logger
                return this.createLogger(LoggerFactory.LoggerTypes.CONSOLE);
        }
    }

    /**
     * Get available logger types
     * @returns {Array<string>} Array of available logger types
     */
    static getAvailableTypes() {
        return Object.values(LoggerFactory.LoggerTypes);
    }
}

export default LoggerFactory;

