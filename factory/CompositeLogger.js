import BaseLogger from "./BaseLogger.js";

/**
 * CompositeLogger - logs messages to multiple loggers simultaneously
 * Implements the Composite pattern along with Factory pattern
 */
class CompositeLogger extends BaseLogger {
    constructor(loggers = []) {
        super("CompositeLogger");
        this.loggers = loggers;
    }

    /**
     * Add a logger to the composite
     * @param {BaseLogger} logger - The logger to add
     */
    addLogger(logger) {
        if (logger instanceof BaseLogger) {
            this.loggers.push(logger);
        } else {
            throw new Error("Logger must be an instance of BaseLogger");
        }
    }

    /**
     * Remove a logger from the composite
     * @param {BaseLogger} logger - The logger to remove
     */
    removeLogger(logger) {
        const index = this.loggers.indexOf(logger);
        if (index > -1) {
            this.loggers.splice(index, 1);
        }
    }

    log(message) {
        this.loggers.forEach(logger => logger.log(message));
    }

    warn(message) {
        this.loggers.forEach(logger => logger.warn(message));
    }

    error(message) {
        this.loggers.forEach(logger => logger.error(message));
    }

    debug(message) {
        this.loggers.forEach(logger => logger.debug(message));
    }

    /**
     * Get the number of loggers in the composite
     * @returns {number} The number of loggers
     */
    getLoggerCount() {
        return this.loggers.length;
    }
}

export default CompositeLogger;

