import logger from "./logger.js";
import serviceA from "./serviceA.js";
import serviceB from "./serviceB.js";

console.log("=".repeat(70));
console.log("Singleton Design Pattern - Logger Demo");
console.log("=".repeat(70));
console.log();

// Set log level to DEBUG to see debug messages
logger.setLogLevel("DEBUG");

console.log("Example 1: Running Service A");
console.log("-".repeat(70));
serviceA();

console.log();
console.log("Example 2: Running Service B");
console.log("-".repeat(70));
serviceB();

console.log();
console.log("Example 3: Direct Logger Usage");
console.log("-".repeat(70));
logger.log("Application is running smoothly");
logger.warn("This is a warning message");
logger.debug("Debug information: variable x = 42");
logger.error("This is an error message");

console.log();
console.log("Example 4: Logger Statistics");
console.log("-".repeat(70));
const stats = logger.getStatistics();
console.log("Logger Statistics:");
console.log(`  Total Logs: ${stats.totalLogs}`);
console.log(`  Errors: ${stats.errors}`);
console.log(`  Warnings: ${stats.warnings}`);
console.log(`  Debug Messages: ${stats.debugs}`);
console.log(`  Log File: ${stats.logFile}`);

console.log();
console.log("=".repeat(70));
console.log("✅ Demo completed! Both services used the SAME logger instance.");
console.log(`📄 Check the log file at: ${logger.getLogFilePath()}`);
console.log("=".repeat(70));
