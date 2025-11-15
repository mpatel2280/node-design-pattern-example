import BaseLogger from "./BaseLogger.js";

/**
 * DatabaseLogger - simulates logging messages to a database
 * Concrete Product in the Factory pattern
 * 
 * Note: This is a mock implementation for demonstration purposes.
 * In a real application, this would connect to an actual database.
 */
class DatabaseLogger extends BaseLogger {
    constructor() {
        super("DatabaseLogger");
        this.logs = []; // In-memory storage simulating a database
        this.connectionString = "mongodb://localhost:27017/logs"; // Mock connection
    }

    /**
     * Simulate saving a log entry to the database
     * @param {string} level - The log level
     * @param {string} message - The message to log
     */
    saveToDatabase(level, message) {
        const logEntry = {
            id: this.logs.length + 1,
            timestamp: new Date(),
            level: level,
            logger: this.name,
            message: message,
            metadata: {
                hostname: "localhost",
                pid: process.pid
            }
        };
        
        this.logs.push(logEntry);
        
        // Simulate async database operation
        console.log(`[DB] Saved log entry #${logEntry.id} to database`);
    }

    log(message) {
        this.saveToDatabase("INFO", message);
    }

    warn(message) {
        this.saveToDatabase("WARN", message);
    }

    error(message) {
        this.saveToDatabase("ERROR", message);
    }

    debug(message) {
        this.saveToDatabase("DEBUG", message);
    }

    /**
     * Get all logs from the "database"
     * @returns {Array} Array of log entries
     */
    getAllLogs() {
        return this.logs;
    }

    /**
     * Get logs by level
     * @param {string} level - The log level to filter by
     * @returns {Array} Filtered log entries
     */
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }

    /**
     * Clear all logs from the "database"
     */
    clearLogs() {
        this.logs = [];
        console.log("[DB] All logs cleared");
    }
}

export default DatabaseLogger;

