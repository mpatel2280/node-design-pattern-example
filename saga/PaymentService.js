/**
 * PaymentService - Handles payment processing
 * Simulates interaction with a payment gateway
 */
class PaymentService {
    constructor() {
        this.payments = new Map(); // Map<paymentId, paymentData>
        this.failureRate = 0; // For testing failure scenarios
    }

    /**
     * Process a payment
     * @param {string} orderId - The order ID
     * @param {number} amount - The amount to charge
     * @param {Object} paymentMethod - Payment method details
     * @returns {Promise<Object>} Payment result
     */
    async processPayment(orderId, amount, paymentMethod) {
        console.log(`    💳 Processing payment for order ${orderId}: $${amount}`);

        // Simulate network delay
        await this.delay(500);

        // Simulate random failures for testing
        if (Math.random() < this.failureRate) {
            throw new Error("Payment gateway timeout");
        }

        // Validate payment method
        if (!paymentMethod || !paymentMethod.cardNumber) {
            throw new Error("Invalid payment method");
        }

        // Validate amount
        if (amount <= 0) {
            throw new Error("Invalid payment amount");
        }

        // Create payment record
        const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const payment = {
            paymentId,
            orderId,
            amount,
            paymentMethod: {
                type: paymentMethod.type || "credit_card",
                last4: paymentMethod.cardNumber.slice(-4)
            },
            status: "COMPLETED",
            timestamp: new Date(),
            transactionId: `TXN_${Date.now()}`
        };

        this.payments.set(paymentId, payment);

        console.log(`    ✓ Payment processed successfully: ${paymentId}`);
        return payment;
    }

    /**
     * Refund a payment (compensation action)
     * @param {string} paymentId - The payment ID to refund
     * @returns {Promise<Object>} Refund result
     */
    async refundPayment(paymentId) {
        console.log(`    💸 Refunding payment: ${paymentId}`);

        // Simulate network delay
        await this.delay(300);

        const payment = this.payments.get(paymentId);
        if (!payment) {
            throw new Error(`Payment not found: ${paymentId}`);
        }

        if (payment.status === "REFUNDED") {
            console.log(`    ⚠️  Payment already refunded: ${paymentId}`);
            return { status: "ALREADY_REFUNDED" };
        }

        // Update payment status
        payment.status = "REFUNDED";
        payment.refundedAt = new Date();
        payment.refundId = `REF_${Date.now()}`;

        console.log(`    ✓ Payment refunded successfully: ${paymentId}`);
        return {
            refundId: payment.refundId,
            amount: payment.amount,
            status: "REFUNDED"
        };
    }

    /**
     * Get payment by ID
     * @param {string} paymentId - The payment ID
     * @returns {Object} Payment data
     */
    getPayment(paymentId) {
        return this.payments.get(paymentId);
    }

    /**
     * Get all payments
     * @returns {Array} Array of payments
     */
    getAllPayments() {
        return Array.from(this.payments.values());
    }

    /**
     * Set failure rate for testing
     * @param {number} rate - Failure rate (0-1)
     */
    setFailureRate(rate) {
        this.failureRate = Math.max(0, Math.min(1, rate));
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
     * Clear all payments (for testing)
     */
    clear() {
        this.payments.clear();
    }
}

export default PaymentService;

