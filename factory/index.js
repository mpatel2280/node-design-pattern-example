import LoggerFactory from "./LoggerFactory.js";

console.log("=".repeat(60));
console.log("Factory Design Pattern - Logging Utility Demo");
console.log("=".repeat(60));
console.log();

// Example 1: Create individual loggers
console.log("1. Creating individual loggers:");
console.log("-".repeat(60));

const consoleLogger = LoggerFactory.createLogger("console");
consoleLogger.log("This is a console log message");
consoleLogger.warn("This is a console warning");
consoleLogger.error("This is a console error");
consoleLogger.debug("This is a console debug message");
console.log();

const fileLogger = LoggerFactory.createLogger("file", { filename: "app.log" });
fileLogger.log("This message is written to app.log");
fileLogger.warn("This warning is written to app.log");
fileLogger.error("This error is written to app.log");
console.log("✓ Messages written to file logger");
console.log();

const dbLogger = LoggerFactory.createLogger("database");
dbLogger.log("This message is saved to database");
dbLogger.warn("This warning is saved to database");
dbLogger.error("This error is saved to database");
console.log(`✓ Total logs in database: ${dbLogger.getAllLogs().length}`);
console.log();

// Example 2: Create a composite logger
console.log("2. Creating a composite logger (logs to multiple destinations):");
console.log("-".repeat(60));

const compositeLogger = LoggerFactory.createCompositeLogger(
    ["console", "file", "database"],
    { filename: "composite.log" }
);

compositeLogger.log("This message goes to console, file, AND database!");
compositeLogger.warn("This warning goes everywhere!");
console.log();

// Example 3: Environment-based logger creation
console.log("3. Creating environment-specific loggers:");
console.log("-".repeat(60));

const devLogger = LoggerFactory.createLoggerForEnvironment("development");
console.log("Development logger created (console + file)");
devLogger.log("Development environment log");
console.log();

const prodLogger = LoggerFactory.createLoggerForEnvironment("production");
console.log("Production logger created (file + database)");
prodLogger.log("Production environment log");
console.log();

const testLogger = LoggerFactory.createLoggerForEnvironment("test");
console.log("Test logger created (file only)");
testLogger.log("Test environment log");
console.log();

// Example 4: Show available logger types
console.log("4. Available logger types:");
console.log("-".repeat(60));
const availableTypes = LoggerFactory.getAvailableTypes();
console.log(`Available types: ${availableTypes.join(", ")}`);
console.log();

// Example 5: Real-world usage scenario
console.log("5. Real-world usage scenario - Application lifecycle:");
console.log("-".repeat(60));

// Simulate an application using the factory pattern
class Application {
    constructor(environment) {
        // Use factory to create appropriate logger based on environment
        this.logger = LoggerFactory.createLoggerForEnvironment(environment);
        this.environment = environment;
    }

    start() {
        this.logger.log(`Application starting in ${this.environment} mode`);
    }

    processData(data) {
        this.logger.log(`Processing data: ${data}`);
    }

    handleError(error) {
        this.logger.error(`Application error: ${error}`);
    }

    shutdown() {
        this.logger.log(`Application shutting down`);
    }
}

const app = new Application("development");
app.start();
app.processData("user-data-123");
app.processData("order-456");
app.handleError("Connection timeout");
app.shutdown();

console.log();
console.log("=".repeat(60));
console.log("Demo completed! Check the log files in the factory directory.");
console.log("=".repeat(60));

