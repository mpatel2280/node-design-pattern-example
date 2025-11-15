import Subject from "./Subject.js";
import { EventTypes, EventPriority, createEvent } from "./EventTypes.js";

/**
 * NotificationCenter - Central hub for managing and dispatching notifications
 * Concrete Subject implementation
 */
class NotificationCenter extends Subject {
    constructor(name = "NotificationCenter") {
        super(name);
        this.eventHistory = [];
        this.maxHistorySize = 100;
    }

    /**
     * Send a notification to all observers
     * @param {string} eventType - The type of event
     * @param {Object} data - The event data
     * @param {string} priority - The event priority
     */
    sendNotification(eventType, data = {}, priority = EventPriority.MEDIUM) {
        const event = createEvent(eventType, data, priority);
        
        // Add to history
        this.addToHistory(event);
        
        // Notify all observers
        this.notify(eventType, { ...data, priority, eventId: event.id });
        
        return event;
    }

    /**
     * Add an event to the history
     * @param {NotificationEvent} event - The event to add
     */
    addToHistory(event) {
        this.eventHistory.push(event);
        
        // Keep history size under control
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }
    }

    /**
     * Get event history
     * @param {number} limit - Maximum number of events to return
     * @returns {Array} Array of events
     */
    getHistory(limit = 10) {
        return this.eventHistory.slice(-limit);
    }

    /**
     * Get events by type
     * @param {string} eventType - The event type to filter by
     * @returns {Array} Filtered events
     */
    getEventsByType(eventType) {
        return this.eventHistory.filter(event => event.type === eventType);
    }

    /**
     * Get events by priority
     * @param {string} priority - The priority to filter by
     * @returns {Array} Filtered events
     */
    getEventsByPriority(priority) {
        return this.eventHistory.filter(event => event.priority === priority);
    }

    /**
     * Clear event history
     */
    clearHistory() {
        this.eventHistory = [];
        console.log(`[${this.name}] Event history cleared`);
    }

    /**
     * Get statistics about notifications
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const stats = {
            totalEvents: this.eventHistory.length,
            totalObservers: this.getObserverCount(),
            eventsByType: {},
            eventsByPriority: {}
        };

        // Count events by type
        this.eventHistory.forEach(event => {
            stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
            stats.eventsByPriority[event.priority] = (stats.eventsByPriority[event.priority] || 0) + 1;
        });

        return stats;
    }
}

export default NotificationCenter;

