/**
 * SagaContext - Holds the state and data for a saga execution
 * This context is passed through all saga steps and compensations
 */
class SagaContext {
    constructor(initialData = {}) {
        this.data = { ...initialData };
        this.executedSteps = [];
        this.status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED, FAILED, COMPENSATING, COMPENSATED
        this.error = null;
        this.startTime = null;
        this.endTime = null;
        this.sagaId = this.generateSagaId();
    }

    /**
     * Generate a unique saga ID
     * @returns {string} Unique saga ID
     */
    generateSagaId() {
        return `saga_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Set data in the context
     * @param {string} key - The key
     * @param {*} value - The value
     */
    set(key, value) {
        this.data[key] = value;
    }

    /**
     * Get data from the context
     * @param {string} key - The key
     * @returns {*} The value
     */
    get(key) {
        return this.data[key];
    }

    /**
     * Check if a key exists in the context
     * @param {string} key - The key
     * @returns {boolean} True if key exists
     */
    has(key) {
        return key in this.data;
    }

    /**
     * Get all context data
     * @returns {Object} All context data
     */
    getAll() {
        return { ...this.data };
    }

    /**
     * Mark a step as executed
     * @param {string} stepName - The step name
     * @param {Object} result - The step result
     */
    markStepExecuted(stepName, result = {}) {
        this.executedSteps.push({
            stepName,
            result,
            timestamp: new Date()
        });
    }

    /**
     * Get executed steps
     * @returns {Array} Array of executed steps
     */
    getExecutedSteps() {
        return [...this.executedSteps];
    }

    /**
     * Set saga status
     * @param {string} status - The status
     */
    setStatus(status) {
        this.status = status;
    }

    /**
     * Get saga status
     * @returns {string} The status
     */
    getStatus() {
        return this.status;
    }

    /**
     * Set error
     * @param {Error} error - The error
     */
    setError(error) {
        this.error = error;
    }

    /**
     * Get error
     * @returns {Error} The error
     */
    getError() {
        return this.error;
    }

    /**
     * Mark saga as started
     */
    markStarted() {
        this.startTime = new Date();
        this.status = "IN_PROGRESS";
    }

    /**
     * Mark saga as completed
     */
    markCompleted() {
        this.endTime = new Date();
        this.status = "COMPLETED";
    }

    /**
     * Mark saga as failed
     * @param {Error} error - The error
     */
    markFailed(error) {
        this.endTime = new Date();
        this.status = "FAILED";
        this.error = error;
    }

    /**
     * Mark saga as compensating
     */
    markCompensating() {
        this.status = "COMPENSATING";
    }

    /**
     * Mark saga as compensated
     */
    markCompensated() {
        this.endTime = new Date();
        this.status = "COMPENSATED";
    }

    /**
     * Get saga duration in milliseconds
     * @returns {number} Duration in ms
     */
    getDuration() {
        if (!this.startTime) return 0;
        const end = this.endTime || new Date();
        return end - this.startTime;
    }

    /**
     * Get a summary of the saga execution
     * @returns {Object} Summary object
     */
    getSummary() {
        return {
            sagaId: this.sagaId,
            status: this.status,
            duration: this.getDuration(),
            executedSteps: this.executedSteps.length,
            error: this.error ? this.error.message : null,
            data: this.data
        };
    }
}

export default SagaContext;

