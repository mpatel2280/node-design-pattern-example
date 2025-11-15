/**
 * Observer - Base class for objects that observe subjects
 * Defines the interface that all concrete observers must implement
 */
class Observer {
    constructor(name = "Observer") {
        this.name = name;
        this.enabled = true;
        this.notificationCount = 0;
    }

    /**
     * Update method called by the subject when an event occurs
     * @param {string} eventType - The type of event
     * @param {Object} data - The event data
     * @param {Subject} subject - The subject that triggered the event
     */
    update(eventType, data, subject) {
        throw new Error("Method 'update()' must be implemented by concrete observers");
    }

    /**
     * Enable this observer to receive notifications
     */
    enable() {
        this.enabled = true;
        console.log(`[${this.name}] Observer enabled`);
    }

    /**
     * Disable this observer from receiving notifications
     */
    disable() {
        this.enabled = false;
        console.log(`[${this.name}] Observer disabled`);
    }

    /**
     * Check if this observer is enabled
     * @returns {boolean} True if enabled, false otherwise
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * Get the number of notifications received
     * @returns {number} The notification count
     */
    getNotificationCount() {
        return this.notificationCount;
    }

    /**
     * Reset the notification count
     */
    resetNotificationCount() {
        this.notificationCount = 0;
    }
}

export default Observer;

