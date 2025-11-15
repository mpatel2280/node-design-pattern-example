import logger from "./logger.js";

/**
 * Service A - Demonstrates logger usage
 * This service uses the singleton logger instance
 */
export default function serviceA() {
    logger.log("Service A started");

    // Simulate some work
    logger.debug("Service A: Processing data...");

    try {
        // Simulate successful operation
        const result = processData();
        logger.log(`Service A: Data processed successfully - ${result}`);
    } catch (error) {
        logger.error(`Service A: Failed to process data - ${error.message}`);
    }
}

/**
 * Simulate data processing
 * @returns {string} Result message
 */
function processData() {
    // Simulate some processing
    return "100 records processed";
}
