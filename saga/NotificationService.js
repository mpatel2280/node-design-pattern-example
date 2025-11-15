/**
 * NotificationService - Sends notifications to customers
 */
class NotificationService {
    constructor() {
        this.notifications = [];
    }

    /**
     * Send order confirmation notification
     * @param {string} customerId - The customer ID
     * @param {string} orderId - The order ID
     * @param {Object} orderDetails - Order details
     * @returns {Promise<Object>} Notification result
     */
    async sendOrderConfirmation(customerId, orderId, orderDetails) {
        console.log(`    📧 Sending order confirmation to customer ${customerId}`);

        await this.delay(200);

        const notification = {
            notificationId: `NOTIF_${Date.now()}`,
            type: "ORDER_CONFIRMATION",
            customerId,
            orderId,
            message: `Your order ${orderId} has been confirmed!`,
            details: orderDetails,
            sentAt: new Date(),
            status: "SENT"
        };

        this.notifications.push(notification);

        console.log(`    ✓ Order confirmation sent: ${notification.notificationId}`);
        return notification;
    }

    /**
     * Send payment confirmation notification
     * @param {string} customerId - The customer ID
     * @param {string} paymentId - The payment ID
     * @param {number} amount - Payment amount
     * @returns {Promise<Object>} Notification result
     */
    async sendPaymentConfirmation(customerId, paymentId, amount) {
        console.log(`    📧 Sending payment confirmation to customer ${customerId}`);

        await this.delay(200);

        const notification = {
            notificationId: `NOTIF_${Date.now()}`,
            type: "PAYMENT_CONFIRMATION",
            customerId,
            paymentId,
            message: `Payment of $${amount} has been processed successfully!`,
            sentAt: new Date(),
            status: "SENT"
        };

        this.notifications.push(notification);

        console.log(`    ✓ Payment confirmation sent: ${notification.notificationId}`);
        return notification;
    }

    /**
     * Send order cancellation notification
     * @param {string} customerId - The customer ID
     * @param {string} orderId - The order ID
     * @param {string} reason - Cancellation reason
     * @returns {Promise<Object>} Notification result
     */
    async sendOrderCancellation(customerId, orderId, reason) {
        console.log(`    📧 Sending order cancellation to customer ${customerId}`);

        await this.delay(200);

        const notification = {
            notificationId: `NOTIF_${Date.now()}`,
            type: "ORDER_CANCELLATION",
            customerId,
            orderId,
            message: `Your order ${orderId} has been cancelled. Reason: ${reason}`,
            sentAt: new Date(),
            status: "SENT"
        };

        this.notifications.push(notification);

        console.log(`    ✓ Order cancellation sent: ${notification.notificationId}`);
        return notification;
    }

    /**
     * Send refund notification
     * @param {string} customerId - The customer ID
     * @param {string} refundId - The refund ID
     * @param {number} amount - Refund amount
     * @returns {Promise<Object>} Notification result
     */
    async sendRefundNotification(customerId, refundId, amount) {
        console.log(`    📧 Sending refund notification to customer ${customerId}`);

        await this.delay(200);

        const notification = {
            notificationId: `NOTIF_${Date.now()}`,
            type: "REFUND_NOTIFICATION",
            customerId,
            refundId,
            message: `A refund of $${amount} has been processed to your account.`,
            sentAt: new Date(),
            status: "SENT"
        };

        this.notifications.push(notification);

        console.log(`    ✓ Refund notification sent: ${notification.notificationId}`);
        return notification;
    }

    /**
     * Get all notifications
     * @returns {Array} Array of notifications
     */
    getAllNotifications() {
        return [...this.notifications];
    }

    /**
     * Get notifications by customer
     * @param {string} customerId - The customer ID
     * @returns {Array} Array of notifications
     */
    getNotificationsByCustomer(customerId) {
        return this.notifications.filter(n => n.customerId === customerId);
    }

    /**
     * Simulate delay
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Clear all notifications (for testing)
     */
    clear() {
        this.notifications = [];
    }
}

export default NotificationService;

