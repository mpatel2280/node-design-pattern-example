/**
 * ShippingService - Manages shipping and delivery
 */
class ShippingService {
    constructor() {
        this.shipments = new Map(); // Map<shipmentId, shipmentData>
    }

    /**
     * Create a shipment for an order
     * @param {string} orderId - The order ID
     * @param {Object} shippingAddress - Shipping address
     * @param {Array} items - Items to ship
     * @returns {Promise<Object>} Shipment result
     */
    async createShipment(orderId, shippingAddress, items) {
        console.log(`    🚚 Creating shipment for order ${orderId}`);

        await this.delay(300);

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
            throw new Error("Invalid shipping address");
        }

        // Create shipment
        const shipmentId = `SHIP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const trackingNumber = `TRACK_${Date.now()}`;
        
        const shipment = {
            shipmentId,
            orderId,
            trackingNumber,
            shippingAddress,
            items,
            status: "PENDING",
            createdAt: new Date(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        };

        this.shipments.set(shipmentId, shipment);

        console.log(`    ✓ Shipment created: ${shipmentId}`);
        console.log(`    ✓ Tracking number: ${trackingNumber}`);
        return shipment;
    }

    /**
     * Cancel a shipment (compensation action)
     * @param {string} shipmentId - The shipment ID to cancel
     * @returns {Promise<Object>} Cancellation result
     */
    async cancelShipment(shipmentId) {
        console.log(`    ❌ Cancelling shipment: ${shipmentId}`);

        await this.delay(200);

        const shipment = this.shipments.get(shipmentId);
        if (!shipment) {
            throw new Error(`Shipment not found: ${shipmentId}`);
        }

        if (shipment.status === "CANCELLED") {
            console.log(`    ⚠️  Shipment already cancelled: ${shipmentId}`);
            return { status: "ALREADY_CANCELLED" };
        }

        shipment.status = "CANCELLED";
        shipment.cancelledAt = new Date();

        console.log(`    ✓ Shipment cancelled: ${shipmentId}`);
        return { status: "CANCELLED", shipmentId };
    }

    /**
     * Get shipment by ID
     * @param {string} shipmentId - The shipment ID
     * @returns {Object} Shipment data
     */
    getShipment(shipmentId) {
        return this.shipments.get(shipmentId);
    }

    /**
     * Get shipment by order ID
     * @param {string} orderId - The order ID
     * @returns {Object} Shipment data
     */
    getShipmentByOrder(orderId) {
        return Array.from(this.shipments.values())
            .find(shipment => shipment.orderId === orderId);
    }

    /**
     * Get all shipments
     * @returns {Array} Array of shipments
     */
    getAllShipments() {
        return Array.from(this.shipments.values());
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
     * Clear all shipments (for testing)
     */
    clear() {
        this.shipments.clear();
    }
}

export default ShippingService;

