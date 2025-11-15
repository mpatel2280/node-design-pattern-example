/**
 * InventoryService - Manages product inventory
 * Handles stock reservation and release
 */
class InventoryService {
    constructor() {
        this.inventory = new Map(); // Map<productId, stock>
        this.reservations = new Map(); // Map<reservationId, reservation>
        
        // Initialize with some sample inventory
        this.initializeInventory();
    }

    /**
     * Initialize sample inventory
     */
    initializeInventory() {
        this.inventory.set("PROD_001", { productId: "PROD_001", name: "Laptop", stock: 10 });
        this.inventory.set("PROD_002", { productId: "PROD_002", name: "Mouse", stock: 50 });
        this.inventory.set("PROD_003", { productId: "PROD_003", name: "Keyboard", stock: 30 });
        this.inventory.set("PROD_004", { productId: "PROD_004", name: "Monitor", stock: 5 });
    }

    /**
     * Reserve inventory for an order
     * @param {string} orderId - The order ID
     * @param {Array} items - Array of items to reserve
     * @returns {Promise<Object>} Reservation result
     */
    async reserveInventory(orderId, items) {
        console.log(`    📦 Reserving inventory for order ${orderId}`);

        // Simulate network delay
        await this.delay(300);

        // Check if all items are available
        for (const item of items) {
            const product = this.inventory.get(item.productId);
            
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
            }
        }

        // Reserve the items
        const reservationId = `RES_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const reservation = {
            reservationId,
            orderId,
            items: [],
            status: "RESERVED",
            timestamp: new Date()
        };

        for (const item of items) {
            const product = this.inventory.get(item.productId);
            product.stock -= item.quantity;
            
            reservation.items.push({
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity
            });

            console.log(`    ✓ Reserved ${item.quantity}x ${product.name}`);
        }

        this.reservations.set(reservationId, reservation);

        console.log(`    ✓ Inventory reserved: ${reservationId}`);
        return reservation;
    }

    /**
     * Release reserved inventory (compensation action)
     * @param {string} reservationId - The reservation ID to release
     * @returns {Promise<Object>} Release result
     */
    async releaseInventory(reservationId) {
        console.log(`    📤 Releasing inventory reservation: ${reservationId}`);

        // Simulate network delay
        await this.delay(200);

        const reservation = this.reservations.get(reservationId);
        if (!reservation) {
            throw new Error(`Reservation not found: ${reservationId}`);
        }

        if (reservation.status === "RELEASED") {
            console.log(`    ⚠️  Reservation already released: ${reservationId}`);
            return { status: "ALREADY_RELEASED" };
        }

        // Release the items back to inventory
        for (const item of reservation.items) {
            const product = this.inventory.get(item.productId);
            if (product) {
                product.stock += item.quantity;
                console.log(`    ✓ Released ${item.quantity}x ${product.productName}`);
            }
        }

        reservation.status = "RELEASED";
        reservation.releasedAt = new Date();

        console.log(`    ✓ Inventory released: ${reservationId}`);
        return { status: "RELEASED", reservationId };
    }

    /**
     * Get current inventory
     * @returns {Array} Array of inventory items
     */
    getInventory() {
        return Array.from(this.inventory.values());
    }

    /**
     * Get product stock
     * @param {string} productId - The product ID
     * @returns {number} Stock level
     */
    getStock(productId) {
        const product = this.inventory.get(productId);
        return product ? product.stock : 0;
    }

    /**
     * Get reservation
     * @param {string} reservationId - The reservation ID
     * @returns {Object} Reservation data
     */
    getReservation(reservationId) {
        return this.reservations.get(reservationId);
    }

    /**
     * Simulate delay
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default InventoryService;

