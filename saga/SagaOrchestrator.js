/**
 * SagaOrchestrator - Manages and coordinates saga executions
 * Provides monitoring, logging, and management capabilities
 */
class SagaOrchestrator {
    constructor() {
        this.sagas = new Map(); // Map<sagaName, Saga>
        this.executionHistory = [];
        this.maxHistorySize = 100;
    }

    /**
     * Register a saga with the orchestrator
     * @param {string} name - Saga name
     * @param {Saga} saga - Saga instance
     */
    registerSaga(name, saga) {
        this.sagas.set(name, saga);
        console.log(`✓ Saga registered: ${name}`);
    }

    /**
     * Execute a saga by name
     * @param {string} sagaName - The saga name
     * @param {Object} initialData - Initial data for the saga
     * @returns {Promise<SagaContext>} The saga context
     */
    async executeSaga(sagaName, initialData = {}) {
        const saga = this.sagas.get(sagaName);
        
        if (!saga) {
            throw new Error(`Saga not found: ${sagaName}`);
        }

        console.log(`\n${"=".repeat(70)}`);
        console.log(`🎭 Orchestrator: Executing saga "${sagaName}"`);
        console.log(`${"=".repeat(70)}`);

        const startTime = Date.now();
        
        try {
            // Execute the saga
            const context = await saga.execute(initialData);
            
            // Record execution
            this.recordExecution(sagaName, context, Date.now() - startTime);
            
            return context;
        } catch (error) {
            console.error(`\n❌ Orchestrator: Saga execution failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Record saga execution in history
     * @param {string} sagaName - The saga name
     * @param {SagaContext} context - The saga context
     * @param {number} duration - Execution duration
     */
    recordExecution(sagaName, context, duration) {
        const record = {
            sagaName,
            sagaId: context.sagaId,
            status: context.getStatus(),
            duration,
            executedSteps: context.getExecutedSteps().length,
            error: context.getError() ? context.getError().message : null,
            timestamp: new Date()
        };

        this.executionHistory.push(record);

        // Keep history size under control
        if (this.executionHistory.length > this.maxHistorySize) {
            this.executionHistory.shift();
        }
    }

    /**
     * Get execution history
     * @param {number} limit - Maximum number of records to return
     * @returns {Array} Array of execution records
     */
    getExecutionHistory(limit = 10) {
        return this.executionHistory.slice(-limit);
    }

    /**
     * Get execution statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const stats = {
            totalExecutions: this.executionHistory.length,
            registeredSagas: this.sagas.size,
            byStatus: {},
            bySaga: {},
            averageDuration: 0
        };

        let totalDuration = 0;

        this.executionHistory.forEach(record => {
            // Count by status
            stats.byStatus[record.status] = (stats.byStatus[record.status] || 0) + 1;
            
            // Count by saga
            stats.bySaga[record.sagaName] = (stats.bySaga[record.sagaName] || 0) + 1;
            
            // Sum duration
            totalDuration += record.duration;
        });

        if (this.executionHistory.length > 0) {
            stats.averageDuration = Math.round(totalDuration / this.executionHistory.length);
        }

        return stats;
    }

    /**
     * Get registered sagas
     * @returns {Array} Array of saga names
     */
    getRegisteredSagas() {
        return Array.from(this.sagas.keys());
    }

    /**
     * Get a saga by name
     * @param {string} sagaName - The saga name
     * @returns {Saga} The saga instance
     */
    getSaga(sagaName) {
        return this.sagas.get(sagaName);
    }

    /**
     * Clear execution history
     */
    clearHistory() {
        this.executionHistory = [];
        console.log("✓ Execution history cleared");
    }

    /**
     * Print statistics
     */
    printStatistics() {
        const stats = this.getStatistics();
        
        console.log("\n📊 Saga Orchestrator Statistics:");
        console.log("=".repeat(70));
        console.log(`Total Executions: ${stats.totalExecutions}`);
        console.log(`Registered Sagas: ${stats.registeredSagas}`);
        console.log(`Average Duration: ${stats.averageDuration}ms`);
        console.log("\nBy Status:");
        Object.entries(stats.byStatus).forEach(([status, count]) => {
            console.log(`  ${status}: ${count}`);
        });
        console.log("\nBy Saga:");
        Object.entries(stats.bySaga).forEach(([saga, count]) => {
            console.log(`  ${saga}: ${count}`);
        });
        console.log("=".repeat(70));
    }
}

export default SagaOrchestrator;

