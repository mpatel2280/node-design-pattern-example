/**
 * SagaStep - Represents a single step in a saga with its compensation logic
 * Each step has a forward action and a compensating action
 */
class SagaStep {
    constructor(name, action, compensation = null) {
        this.name = name;
        this.action = action; // Function to execute
        this.compensation = compensation; // Function to compensate if saga fails
        this.executed = false;
        this.compensated = false;
        this.result = null;
        this.error = null;
    }

    /**
     * Execute the step action
     * @param {SagaContext} context - The saga context
     * @returns {Promise<*>} The result of the action
     */
    async execute(context) {
        try {
            console.log(`  ▶ Executing step: ${this.name}`);
            
            // Execute the action
            this.result = await this.action(context);
            this.executed = true;
            
            // Mark step as executed in context
            context.markStepExecuted(this.name, this.result);
            
            console.log(`  ✓ Step completed: ${this.name}`);
            return this.result;
        } catch (error) {
            this.error = error;
            console.error(`  ✗ Step failed: ${this.name} - ${error.message}`);
            throw error;
        }
    }

    /**
     * Execute the compensation action
     * @param {SagaContext} context - The saga context
     * @returns {Promise<*>} The result of the compensation
     */
    async compensate(context) {
        if (!this.executed) {
            console.log(`  ⊘ Skipping compensation for ${this.name} (not executed)`);
            return;
        }

        if (!this.compensation) {
            console.log(`  ⊘ No compensation defined for ${this.name}`);
            return;
        }

        try {
            console.log(`  ◀ Compensating step: ${this.name}`);
            
            // Execute the compensation
            const result = await this.compensation(context);
            this.compensated = true;
            
            console.log(`  ✓ Compensation completed: ${this.name}`);
            return result;
        } catch (error) {
            console.error(`  ✗ Compensation failed: ${this.name} - ${error.message}`);
            throw error;
        }
    }

    /**
     * Check if step was executed
     * @returns {boolean} True if executed
     */
    isExecuted() {
        return this.executed;
    }

    /**
     * Check if step was compensated
     * @returns {boolean} True if compensated
     */
    isCompensated() {
        return this.compensated;
    }

    /**
     * Get step result
     * @returns {*} The result
     */
    getResult() {
        return this.result;
    }

    /**
     * Get step error
     * @returns {Error} The error
     */
    getError() {
        return this.error;
    }

    /**
     * Reset step state
     */
    reset() {
        this.executed = false;
        this.compensated = false;
        this.result = null;
        this.error = null;
    }
}

export default SagaStep;

