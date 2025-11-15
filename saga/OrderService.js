/**
 * OrderService - Manages order creation and lifecycle
 */
class OrderService {
    constructor() {
        this.orders = new Map(); // Map<orderId, orderData>
    }

    /**
     * Create an order
     * @param {Object} orderData - Order data
     * @returns {Promise<Object>} Created order
     */
    async createOrder(orderData) {
        console.log(`    📝 Creating order for customer ${orderData.customerId}`);

        // Simulate network delay
        await this.delay(200);

        // Validate order data
        if (!orderData.customerId) {
            throw new Error("Customer ID is required");
        }

        if (!orderData.items || orderData.items.length === 0) {
            throw new Error("Order must contain at least one item");
        }

        // Create order
        const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const order = {
            orderId,
            customerId: orderData.customerId,
            items: orderData.items,
            totalAmount: orderData.totalAmount,
            status: "CREATED",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.orders.set(orderId, order);

        console.log(`    ✓ Order created: ${orderId}`);
        return order;
    }

    /**
     * Confirm an order
     * @param {string} orderId - The order ID
     * @returns {Promise<Object>} Updated order
     */
    async confirmOrder(orderId) {
        console.log(`    ✅ Confirming order: ${orderId}`);

        await this.delay(200);

        const order = this.orders.get(orderId);
        if (!order) {
            throw new Error(`Order not found: ${orderId}`);
        }

        order.status = "CONFIRMED";
        order.confirmedAt = new Date();
        order.updatedAt = new Date();

        console.log(`    ✓ Order confirmed: ${orderId}`);
        return order;
    }

    /**
     * Cancel an order (compensation action)
     * @param {string} orderId - The order ID to cancel
     * @returns {Promise<Object>} Cancelled order
     */
    async cancelOrder(orderId) {
        console.log(`    ❌ Cancelling order: ${orderId}`);

        await this.delay(200);

        const order = this.orders.get(orderId);
        if (!order) {
            throw new Error(`Order not found: ${orderId}`);
        }

        if (order.status === "CANCELLED") {
            console.log(`    ⚠️  Order already cancelled: ${orderId}`);
            return order;
        }

        order.status = "CANCELLED";
        order.cancelledAt = new Date();
        order.updatedAt = new Date();

        console.log(`    ✓ Order cancelled: ${orderId}`);
        return order;
    }

    /**
     * Get order by ID
     * @param {string} orderId - The order ID
     * @returns {Object} Order data
     */
    getOrder(orderId) {
        return this.orders.get(orderId);
    }

    /**
     * Get all orders
     * @returns {Array} Array of orders
     */
    getAllOrders() {
        return Array.from(this.orders.values());
    }

    /**
     * Get orders by customer
     * @param {string} customerId - The customer ID
     * @returns {Array} Array of orders
     */
    getOrdersByCustomer(customerId) {
        return Array.from(this.orders.values())
            .filter(order => order.customerId === customerId);
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
     * Clear all orders (for testing)
     */
    clear() {
        this.orders.clear();
    }
}

export default OrderService;

