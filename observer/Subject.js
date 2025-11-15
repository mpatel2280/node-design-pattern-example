/**
 * Subject (Observable) - Base class for objects that can be observed
 * Maintains a list of observers and notifies them of state changes
 */
class Subject {
    constructor(name = "Subject") {
        this.name = name;
        this.observers = new Map(); // Map<observerId, observer>
        this.observerIdCounter = 0;
    }

    /**
     * Attach an observer to the subject
     * @param {Observer} observer - The observer to attach
     * @returns {number} The observer ID for later removal
     */
    attach(observer) {
        const observerId = ++this.observerIdCounter;
        this.observers.set(observerId, observer);
        console.log(`[${this.name}] Observer #${observerId} (${observer.name}) attached. Total observers: ${this.observers.size}`);
        return observerId;
    }

    /**
     * Detach an observer from the subject
     * @param {number} observerId - The ID of the observer to detach
     * @returns {boolean} True if observer was removed, false otherwise
     */
    detach(observerId) {
        const observer = this.observers.get(observerId);
        if (observer) {
            this.observers.delete(observerId);
            console.log(`[${this.name}] Observer #${observerId} (${observer.name}) detached. Total observers: ${this.observers.size}`);
            return true;
        }
        return false;
    }

    /**
     * Detach all observers
     */
    detachAll() {
        const count = this.observers.size;
        this.observers.clear();
        console.log(`[${this.name}] All ${count} observers detached`);
    }

    /**
     * Notify all observers of an event
     * @param {string} eventType - The type of event
     * @param {Object} data - The event data
     */
    notify(eventType, data) {
        console.log(`[${this.name}] Notifying ${this.observers.size} observers about event: ${eventType}`);
        
        for (const [observerId, observer] of this.observers) {
            try {
                observer.update(eventType, data, this);
            } catch (error) {
                console.error(`[${this.name}] Error notifying observer #${observerId}: ${error.message}`);
            }
        }
    }

    /**
     * Get the number of attached observers
     * @returns {number} The number of observers
     */
    getObserverCount() {
        return this.observers.size;
    }

    /**
     * Get all observer names
     * @returns {Array<string>} Array of observer names
     */
    getObserverNames() {
        return Array.from(this.observers.values()).map(obs => obs.name);
    }
}

export default Subject;

