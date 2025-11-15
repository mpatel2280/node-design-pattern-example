import Observer from "./Observer.js";
import { EventPriority } from "./EventTypes.js";

/**
 * SMSObserver - Sends SMS notifications when events occur
 * Concrete Observer implementation
 */
class SMSObserver extends Observer {
    constructor(phoneNumber, config = {}) {
        super("SMSObserver");
        this.phoneNumber = phoneNumber;
        this.config = {
            provider: config.provider || "Twilio",
            maxLength: config.maxLength || 160,
            ...config
        };
        this.sentMessages = [];
        this.priorityFilter = config.priorityFilter || [EventPriority.HIGH, EventPriority.CRITICAL];
    }

    /**
     * Update method - called when an event occurs
     * @param {string} eventType - The type of event
     * @param {Object} data - The event data
     * @param {Subject} subject - The subject that triggered the event
     */
    update(eventType, data, subject) {
        if (!this.enabled) {
            return;
        }

        // Only send SMS for high priority events
        const priority = data.priority || EventPriority.MEDIUM;
        if (!this.priorityFilter.includes(priority)) {
            console.log(`📱 [${this.name}] Skipping SMS for ${priority} priority event: ${eventType}`);
            return;
        }

        this.notificationCount++;
        
        // Compose and send SMS
        const message = this.composeMessage(eventType, data);
        this.sendSMS(message);
    }

    /**
     * Compose an SMS message based on the event
     * @param {string} eventType - The event type
     * @param {Object} data - The event data
     * @returns {Object} SMS message object
     */
    composeMessage(eventType, data) {
        const text = this.getMessageText(eventType, data);
        const truncated = text.length > this.config.maxLength 
            ? text.substring(0, this.config.maxLength - 3) + "..."
            : text;

        return {
            to: this.phoneNumber,
            text: truncated,
            timestamp: new Date(),
            priority: data.priority || EventPriority.MEDIUM,
            eventType: eventType
        };
    }

    /**
     * Get SMS message text based on event type
     * @param {string} eventType - The event type
     * @param {Object} data - The event data
     * @returns {string} SMS message text
     */
    getMessageText(eventType, data) {
        const messages = {
            "user.registered": `Welcome! Your account ${data.username || ""} has been created.`,
            "order.shipped": `Your order ${data.orderId || ""} has been shipped! Track: ${data.trackingNumber || "N/A"}`,
            "payment.failed": `ALERT: Payment failed for order ${data.orderId || ""}. Please update payment method.`,
            "system.error": `SYSTEM ERROR: ${data.message || "Critical system error detected"}`,
            "security.breach": `SECURITY ALERT: Suspicious activity detected on your account. Please verify immediately.`,
            "password.reset": `Your password reset code is: ${data.code || "N/A"}. Valid for 10 minutes.`
        };

        return messages[eventType] || `Notification: ${eventType}`;
    }

    /**
     * Simulate sending an SMS
     * @param {Object} message - The message to send
     */
    sendSMS(message) {
        // Simulate SMS sending
        console.log(`📱 [${this.name}] Sending SMS to ${message.to}`);
        console.log(`   Message: ${message.text}`);
        console.log(`   Provider: ${this.config.provider}`);
        
        this.sentMessages.push(message);
    }

    /**
     * Get all sent messages
     * @returns {Array} Array of sent messages
     */
    getSentMessages() {
        return this.sentMessages;
    }

    /**
     * Set priority filter for SMS notifications
     * @param {Array<string>} priorities - Array of priorities to send SMS for
     */
    setPriorityFilter(priorities) {
        this.priorityFilter = priorities;
    }

    /**
     * Clear sent messages history
     */
    clearHistory() {
        this.sentMessages = [];
    }
}

export default SMSObserver;

