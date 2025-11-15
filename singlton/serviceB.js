import logger from "./logger.js";

/**
 * Service B - Demonstrates logger usage with warnings and errors
 * This service uses the SAME singleton logger instance as Service A
 */
export default function serviceB() {
    logger.log("Service B started");

    // Simulate some work with warnings
    logger.warn("Service B: Low memory warning");

    try {
        // Simulate an operation that might fail
        performOperation();
    } catch (error) {
        logger.error(`Service B: Operation failed - ${error.message}`);
    }

    logger.log("Service B completed");
}

/**
 * Simulate an operation that throws an error
 */
function performOperation() {
    // Simulate an error condition
    throw new Error("Database connection timeout");
}
