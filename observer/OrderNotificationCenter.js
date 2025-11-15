import NotificationCenter from "./NotificationCenter.js";
import { EventTypes, EventPriority } from "./EventTypes.js";

/**
 * OrderNotificationCenter - Manages order-related notifications
 * Specialized Concrete Subject for order events
 */
class OrderNotificationCenter extends NotificationCenter {
    constructor() {
        super("OrderNotificationCenter");
        this.orders = new Map(); // Map<orderId, orderData>
    }

    /**
     * Create a new order and send notification
     * @param {string} orderId - The order ID
     * @param {Object} orderData - Order data
     */
    createOrder(orderId, orderData = {}) {
        this.orders.set(orderId, {
            ...orderData,
            status: "created",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        this.sendNotification(
            EventTypes.ORDER_CREATED,
            {
                orderId,
                userId: orderData.userId,
                items: orderData.items,
                total: orderData.total
            },
            EventPriority.MEDIUM
        );
    }

    /**
     * Confirm an order
     * @param {string} orderId - The order ID
     */
    confirmOrder(orderId) {
        const order = this.orders.get(orderId);
        if (order) {
            order.status = "confirmed";
            order.updatedAt = new Date();
        }

        this.sendNotification(
            EventTypes.ORDER_CONFIRMED,
            {
                orderId,
                userId: order?.userId
            },
            EventPriority.MEDIUM
        );
    }

    /**
     * Ship an order
     * @param {string} orderId - The order ID
     * @param {string} trackingNumber - The tracking number
     */
    shipOrder(orderId, trackingNumber) {
        const order = this.orders.get(orderId);
        if (order) {
            order.status = "shipped";
            order.trackingNumber = trackingNumber;
            order.shippedAt = new Date();
            order.updatedAt = new Date();
        }

        this.sendNotification(
            EventTypes.ORDER_SHIPPED,
            {
                orderId,
                userId: order?.userId,
                trackingNumber
            },
            EventPriority.HIGH
        );
    }

    /**
     * Deliver an order
     * @param {string} orderId - The order ID
     */
    deliverOrder(orderId) {
        const order = this.orders.get(orderId);
        if (order) {
            order.status = "delivered";
            order.deliveredAt = new Date();
            order.updatedAt = new Date();
        }

        this.sendNotification(
            EventTypes.ORDER_DELIVERED,
            {
                orderId,
                userId: order?.userId
            },
            EventPriority.HIGH
        );
    }

    /**
     * Cancel an order
     * @param {string} orderId - The order ID
     * @param {string} reason - Cancellation reason
     */
    cancelOrder(orderId, reason = "") {
        const order = this.orders.get(orderId);
        if (order) {
            order.status = "cancelled";
            order.cancelledAt = new Date();
            order.cancellationReason = reason;
            order.updatedAt = new Date();
        }

        this.sendNotification(
            EventTypes.ORDER_CANCELLED,
            {
                orderId,
                userId: order?.userId,
                reason
            },
            EventPriority.MEDIUM
        );
    }

    /**
     * Get order data
     * @param {string} orderId - The order ID
     * @returns {Object} Order data
     */
    getOrder(orderId) {
        return this.orders.get(orderId);
    }

    /**
     * Get orders by user
     * @param {string} userId - The user ID
     * @returns {Array} Array of orders
     */
    getOrdersByUser(userId) {
        return Array.from(this.orders.entries())
            .filter(([_, order]) => order.userId === userId)
            .map(([id, data]) => ({ orderId: id, ...data }));
    }

    /**
     * Get all orders
     * @returns {Array} Array of orders
     */
    getAllOrders() {
        return Array.from(this.orders.entries()).map(([id, data]) => ({
            orderId: id,
            ...data
        }));
    }
}

export default OrderNotificationCenter;

