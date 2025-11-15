import Observer from "./Observer.js";

/**
 * PushNotificationObserver - Sends push notifications to mobile/web apps
 * Concrete Observer implementation
 */
class PushNotificationObserver extends Observer {
    constructor(deviceToken, config = {}) {
        super("PushNotificationObserver");
        this.deviceToken = deviceToken;
        this.config = {
            platform: config.platform || "iOS", // iOS, Android, Web
            appId: config.appId || "com.example.app",
            ...config
        };
        this.sentNotifications = [];
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
        
        // Compose and send push notification
        const notification = this.composeNotification(eventType, data);
        this.sendPushNotification(notification);
    }

    /**
     * Compose a push notification based on the event
     * @param {string} eventType - The event type
     * @param {Object} data - The event data
     * @returns {Object} Push notification object
     */
    composeNotification(eventType, data) {
        return {
            deviceToken: this.deviceToken,
            title: this.getTitle(eventType, data),
            body: this.getBody(eventType, data),
            badge: this.getBadgeCount(eventType),
            sound: this.getSound(eventType, data),
            data: {
                eventType: eventType,
                ...data
            },
            timestamp: new Date(),
            platform: this.config.platform
        };
    }

    /**
     * Get notification title based on event type
     * @param {string} eventType - The event type
     * @param {Object} data - The event data
     * @returns {string} Notification title
     */
    getTitle(eventType, data) {
        const titles = {
            "user.registered": "Welcome!",
            "user.login": "New Login",
            "order.created": "Order Confirmed",
            "order.shipped": "Order Shipped",
            "order.delivered": "Order Delivered",
            "payment.received": "Payment Successful",
            "payment.failed": "Payment Failed",
            "system.error": "System Alert",
            "security.breach": "Security Alert"
        };

        return titles[eventType] || "Notification";
    }

    /**
     * Get notification body based on event type
     * @param {string} eventType - The event type
     * @param {Object} data - The event data
     * @returns {string} Notification body
     */
    getBody(eventType, data) {
        const bodies = {
            "user.registered": "Your account has been successfully created!",
            "user.login": `New login from ${data.location || "unknown location"}`,
            "order.created": `Order #${data.orderId || "N/A"} has been confirmed`,
            "order.shipped": `Your order is on its way!`,
            "order.delivered": `Your order has been delivered`,
            "payment.received": `Payment of $${data.amount || "0"} received`,
            "payment.failed": "Your payment could not be processed",
            "system.error": data.message || "A system error occurred",
            "security.breach": "Suspicious activity detected on your account"
        };

        return bodies[eventType] || `Event: ${eventType}`;
    }

    /**
     * Get badge count for the notification
     * @param {string} eventType - The event type
     * @returns {number} Badge count
     */
    getBadgeCount(eventType) {
        // Increment badge for important notifications
        const importantEvents = ["order.created", "payment.failed", "security.breach"];
        return importantEvents.includes(eventType) ? 1 : 0;
    }

    /**
     * Get sound for the notification
     * @param {string} eventType - The event type
     * @param {Object} data - The event data
     * @returns {string} Sound name
     */
    getSound(eventType, data) {
        const criticalEvents = ["security.breach", "payment.failed", "system.error"];
        return criticalEvents.includes(eventType) ? "alert.wav" : "default.wav";
    }

    /**
     * Simulate sending a push notification
     * @param {Object} notification - The notification to send
     */
    sendPushNotification(notification) {
        // Simulate push notification sending
        console.log(`🔔 [${this.name}] Sending push notification to ${this.config.platform} device`);
        console.log(`   Title: ${notification.title}`);
        console.log(`   Body: ${notification.body}`);
        console.log(`   Sound: ${notification.sound}`);
        
        this.sentNotifications.push(notification);
    }

    /**
     * Get all sent notifications
     * @returns {Array} Array of sent notifications
     */
    getSentNotifications() {
        return this.sentNotifications;
    }

    /**
     * Clear sent notifications history
     */
    clearHistory() {
        this.sentNotifications = [];
    }
}

export default PushNotificationObserver;

