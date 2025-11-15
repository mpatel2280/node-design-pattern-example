const fs = require("fs");
const path = require("path");

class Logger {
    constructor() {
        this.logFile = path.join(__dirname, "app.log");
    }

    log(message) {
        const formatted = `[${new Date().toISOString()}] ${message}`;
        console.log(formatted);

        fs.appendFileSync(this.logFile, formatted + "\n");
    }

    error(message) {
        const formatted = `[${new Date().toISOString()}] ERROR: ${message}`;
        console.error(formatted);

        fs.appendFileSync(this.logFile, formatted + "\n");
    }
}

// Export a single instance
module.exports = new Logger();
