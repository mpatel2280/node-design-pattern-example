/**
 * Event Types - Defines all notification event types in the system
 */
export const EventTypes = {
    // User-related events
    USER_REGISTERED: "user.registered",
    USER_LOGIN: "user.login",
    USER_LOGOUT: "user.logout",
    USER_PROFILE_UPDATED: "user.profile.updated",
    USER_PASSWORD_CHANGED: "user.password.changed",
    USER_DELETED: "user.deleted",

    // Order-related events
    ORDER_CREATED: "order.created",
    ORDER_CONFIRMED: "order.confirmed",
    ORDER_SHIPPED: "order.shipped",
    ORDER_DELIVERED: "order.delivered",
    ORDER_CANCELLED: "order.cancelled",

    // Payment-related events
    PAYMENT_RECEIVED: "payment.received",
    PAYMENT_FAILED: "payment.failed",
    PAYMENT_REFUNDED: "payment.refunded",

    // System-related events
    SYSTEM_ERROR: "system.error",
    SYSTEM_WARNING: "system.warning",
    SYSTEM_MAINTENANCE: "system.maintenance",
    SYSTEM_UPDATE: "system.update",

    // Security-related events
    SECURITY_BREACH: "security.breach",
    SUSPICIOUS_ACTIVITY: "security.suspicious",
    PASSWORD_RESET_REQUEST: "security.password.reset",

    // Custom events
    CUSTOM: "custom.event"
};

/**
 * Event Priority Levels
 */
export const EventPriority = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    CRITICAL: "critical"
};

/**
 * NotificationEvent - Data structure for notification events
 */
export class NotificationEvent {
    constructor(type, data = {}, priority = EventPriority.MEDIUM) {
        this.type = type;
        this.data = data;
        this.priority = priority;
        this.timestamp = new Date();
        this.id = this.generateId();
    }

    /**
     * Generate a unique event ID
     * @returns {string} Unique event ID
     */
    generateId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get event details as a formatted string
     * @returns {string} Formatted event details
     */
    toString() {
        return `[${this.priority.toUpperCase()}] ${this.type} at ${this.timestamp.toISOString()}`;
    }

    /**
     * Get event data as JSON
     * @returns {Object} Event data
     */
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            data: this.data,
            priority: this.priority,
            timestamp: this.timestamp
        };
    }
}

/**
 * Helper function to create a notification event
 * @param {string} type - Event type
 * @param {Object} data - Event data
 * @param {string} priority - Event priority
 * @returns {NotificationEvent} The created event
 */
export function createEvent(type, data = {}, priority = EventPriority.MEDIUM) {
    return new NotificationEvent(type, data, priority);
}

export default {
    EventTypes,
    EventPriority,
    NotificationEvent,
    createEvent
};

