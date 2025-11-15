import Observer from "./Observer.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * LogObserver - Logs all notifications to a file
 * Concrete Observer implementation
 */
class LogObserver extends Observer {
    constructor(logFileName = "notifications.log") {
        super("LogObserver");
        this.logFile = path.join(__dirname, logFileName);
        this.initializeLogFile();
    }

    /**
     * Initialize the log file
     */
    initializeLogFile() {
        if (!fs.existsSync(this.logFile)) {
            const header = `=== Notification Log Started at ${new Date().toISOString()} ===\n`;
            fs.writeFileSync(this.logFile, header);
        }
    }

    /**
     * Update method - called when an event occurs
     * @param {string} eventType - The type of event
     * @param {Object} data - The event data
     * @param {Subject} subject - The subject that triggered the event
     */
    update(eventType, data, subject) {
        if (!this.enabled) {
            return;
        }

        this.notificationCount++;
        
        // Log the notification
        this.logNotification(eventType, data, subject);
    }

    /**
     * Log a notification to the file
     * @param {string} eventType - The event type
     * @param {Object} data - The event data
     * @param {Subject} subject - The subject
     */
    logNotification(eventType, data, subject) {
        const timestamp = new Date().toISOString();
        const logEntry = this.formatLogEntry(timestamp, eventType, data, subject);
        
        try {
            fs.appendFileSync(this.logFile, logEntry + "\n");
            console.log(`📝 [${this.name}] Logged notification: ${eventType}`);
        } catch (error) {
            console.error(`[${this.name}] Failed to write to log file: ${error.message}`);
        }
    }

    /**
     * Format a log entry
     * @param {string} timestamp - The timestamp
     * @param {string} eventType - The event type
     * @param {Object} data - The event data
     * @param {Subject} subject - The subject
     * @returns {string} Formatted log entry
     */
    formatLogEntry(timestamp, eventType, data, subject) {
        const priority = data.priority || "MEDIUM";
        const subjectName = subject ? subject.name : "Unknown";
        
        return [
            `[${timestamp}]`,
            `[${priority.toUpperCase()}]`,
            `[${subjectName}]`,
            `Event: ${eventType}`,
            `Data: ${JSON.stringify(data)}`
        ].join(" ");
    }

    /**
     * Get the log file path
     * @returns {string} The log file path
     */
    getLogFilePath() {
        return this.logFile;
    }

    /**
     * Read the log file contents
     * @returns {string} The log file contents
     */
    readLog() {
        try {
            return fs.readFileSync(this.logFile, "utf-8");
        } catch (error) {
            console.error(`[${this.name}] Failed to read log file: ${error.message}`);
            return "";
        }
    }

    /**
     * Clear the log file
     */
    clearLog() {
        try {
            const header = `=== Notification Log Cleared at ${new Date().toISOString()} ===\n`;
            fs.writeFileSync(this.logFile, header);
            console.log(`[${this.name}] Log file cleared`);
        } catch (error) {
            console.error(`[${this.name}] Failed to clear log file: ${error.message}`);
        }
    }
}

export default LogObserver;

