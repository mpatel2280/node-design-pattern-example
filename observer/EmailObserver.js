import Observer from "./Observer.js";
import { EventPriority } from "./EventTypes.js";

/**
 * EmailObserver - Sends email notifications when events occur
 * Concrete Observer implementation
 */
class EmailObserver extends Observer {
    constructor(emailAddress, config = {}) {
        super("EmailObserver");
        this.emailAddress = emailAddress;
        this.config = {
            smtpServer: config.smtpServer || "smtp.example.com",
            port: config.port || 587,
            from: config.from || "notifications@example.com",
            ...config
        };
        this.sentEmails = [];
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

        this.notificationCount++;
        
        // Simulate sending an email
        const email = this.composeEmail(eventType, data);
        this.sendEmail(email);
    }

    /**
     * Compose an email based on the event
     * @param {string} eventType - The event type
     * @param {Object} data - The event data
     * @returns {Object} Email object
     */
    composeEmail(eventType, data) {
        const email = {
            to: this.emailAddress,
            from: this.config.from,
            subject: this.getSubject(eventType, data),
            body: this.getBody(eventType, data),
            timestamp: new Date(),
            priority: data.priority || EventPriority.MEDIUM
        };

        return email;
    }

    /**
     * Get email subject based on event type
     * @param {string} eventType - The event type
     * @param {Object} data - The event data
     * @returns {string} Email subject
     */
    getSubject(eventType, data) {
        const subjects = {
            "user.registered": "Welcome! Your account has been created",
            "user.login": "New login detected",
            "order.created": `Order Confirmation - ${data.orderId || "N/A"}`,
            "order.shipped": `Your order has been shipped - ${data.orderId || "N/A"}`,
            "payment.received": "Payment received successfully",
            "payment.failed": "Payment failed - Action required",
            "system.error": "System Error Alert",
            "security.breach": "URGENT: Security Alert"
        };

        return subjects[eventType] || `Notification: ${eventType}`;
    }

    /**
     * Get email body based on event type
     * @param {string} eventType - The event type
     * @param {Object} data - The event data
     * @returns {string} Email body
     */
    getBody(eventType, data) {
        return `
Event: ${eventType}
Time: ${new Date().toISOString()}
Details: ${JSON.stringify(data, null, 2)}

This is an automated notification from the system.
        `.trim();
    }

    /**
     * Simulate sending an email
     * @param {Object} email - The email to send
     */
    sendEmail(email) {
        // Simulate email sending
        console.log(`📧 [${this.name}] Sending email to ${email.to}`);
        console.log(`   Subject: ${email.subject}`);
        console.log(`   Priority: ${email.priority}`);
        
        this.sentEmails.push(email);
    }

    /**
     * Get all sent emails
     * @returns {Array} Array of sent emails
     */
    getSentEmails() {
        return this.sentEmails;
    }

    /**
     * Clear sent emails history
     */
    clearHistory() {
        this.sentEmails = [];
    }
}

export default EmailObserver;

