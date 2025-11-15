import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
export default new Logger();
