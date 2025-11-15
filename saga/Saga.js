import SagaContext from "./SagaContext.js";
import SagaStep from "./SagaStep.js";

/**
 * Saga - Base class for implementing the Saga pattern
 * Manages a sequence of steps with compensating transactions
 */
class Saga {
    constructor(name) {
        this.name = name;
        this.steps = [];
    }

    /**
     * Add a step to the saga
     * @param {string} name - Step name
     * @param {Function} action - Action to execute
     * @param {Function} compensation - Compensation action
     * @returns {Saga} This saga (for chaining)
     */
    addStep(name, action, compensation = null) {
        const step = new SagaStep(name, action, compensation);
        this.steps.push(step);
        return this;
    }

    /**
     * Execute the saga
     * @param {Object} initialData - Initial data for the saga context
     * @returns {Promise<SagaContext>} The saga context
     */
    async execute(initialData = {}) {
        const context = new SagaContext(initialData);
        context.markStarted();

        console.log(`\n🚀 Starting Saga: ${this.name} (ID: ${context.sagaId})`);
        console.log("=".repeat(70));

        try {
            // Execute all steps in sequence
            for (const step of this.steps) {
                await step.execute(context);
            }

            // All steps completed successfully
            context.markCompleted();
            console.log(`\n✅ Saga completed successfully: ${this.name}`);
            console.log(`   Duration: ${context.getDuration()}ms`);
            console.log("=".repeat(70));

            return context;
        } catch (error) {
            // A step failed, start compensation
            console.error(`\n❌ Saga failed: ${this.name}`);
            console.error(`   Error: ${error.message}`);
            console.log("=".repeat(70));

            context.markFailed(error);
            await this.compensate(context);

            return context;
        }
    }

    /**
     * Compensate the saga by executing compensation actions in reverse order
     * @param {SagaContext} context - The saga context
     * @returns {Promise<void>}
     */
    async compensate(context) {
        context.markCompensating();

        console.log(`\n🔄 Starting compensation for: ${this.name}`);
        console.log("=".repeat(70));

        // Execute compensations in reverse order
        const executedSteps = this.steps.filter(step => step.isExecuted());
        
        for (let i = executedSteps.length - 1; i >= 0; i--) {
            const step = executedSteps[i];
            try {
                await step.compensate(context);
            } catch (error) {
                console.error(`⚠️  Compensation error for ${step.name}: ${error.message}`);
                // Continue with other compensations even if one fails
            }
        }

        context.markCompensated();
        console.log(`\n✅ Compensation completed for: ${this.name}`);
        console.log(`   Duration: ${context.getDuration()}ms`);
        console.log("=".repeat(70));
    }

    /**
     * Get all steps
     * @returns {Array<SagaStep>} Array of steps
     */
    getSteps() {
        return [...this.steps];
    }

    /**
     * Get step count
     * @returns {number} Number of steps
     */
    getStepCount() {
        return this.steps.length;
    }

    /**
     * Reset all steps
     */
    reset() {
        this.steps.forEach(step => step.reset());
    }
}

export default Saga;

