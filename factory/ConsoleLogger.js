import BaseLogger from "./BaseLogger.js";

/**
 * ConsoleLogger - logs messages to the console
 * Concrete Product in the Factory pattern
 */
class ConsoleLogger extends BaseLogger {
    constructor() {
        super("ConsoleLogger");
    }

    log(message) {
        const formatted = this.formatMessage("INFO", message);
        console.log("\x1b[36m%s\x1b[0m", formatted); // Cyan color
    }

    warn(message) {
        const formatted = this.formatMessage("WARN", message);
        console.warn("\x1b[33m%s\x1b[0m", formatted); // Yellow color
    }

    error(message) {
        const formatted = this.formatMessage("ERROR", message);
        console.error("\x1b[31m%s\x1b[0m", formatted); // Red color
    }

    debug(message) {
        const formatted = this.formatMessage("DEBUG", message);
        console.debug("\x1b[90m%s\x1b[0m", formatted); // Gray color
    }
}

export default ConsoleLogger;

