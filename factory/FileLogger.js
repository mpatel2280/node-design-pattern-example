import BaseLogger from "./BaseLogger.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * FileLogger - logs messages to a file
 * Concrete Product in the Factory pattern
 */
class FileLogger extends BaseLogger {
    constructor(filename = "app.log") {
        super("FileLogger");
        this.logFile = path.join(__dirname, filename);
        
        // Create the log file if it doesn't exist
        if (!fs.existsSync(this.logFile)) {
            fs.writeFileSync(this.logFile, `=== Log started at ${new Date().toISOString()} ===\n`);
        }
    }

    /**
     * Write a message to the log file
     * @param {string} formatted - The formatted message
     */
    writeToFile(formatted) {
        try {
            fs.appendFileSync(this.logFile, formatted + "\n");
        } catch (error) {
            console.error(`Failed to write to log file: ${error.message}`);
        }
    }

    log(message) {
        const formatted = this.formatMessage("INFO", message);
        this.writeToFile(formatted);
    }

    warn(message) {
        const formatted = this.formatMessage("WARN", message);
        this.writeToFile(formatted);
    }

    error(message) {
        const formatted = this.formatMessage("ERROR", message);
        this.writeToFile(formatted);
    }

    debug(message) {
        const formatted = this.formatMessage("DEBUG", message);
        this.writeToFile(formatted);
    }

    /**
     * Get the path to the log file
     * @returns {string} The log file path
     */
    getLogFilePath() {
        return this.logFile;
    }
}

export default FileLogger;

