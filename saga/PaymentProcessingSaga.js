import Saga from "./Saga.js";
import OrderService from "./OrderService.js";
import InventoryService from "./InventoryService.js";
import PaymentService from "./PaymentService.js";
import ShippingService from "./ShippingService.js";
import NotificationService from "./NotificationService.js";

/**
 * PaymentProcessingSaga - Orchestrates the payment processing workflow
 * This saga coordinates multiple services to process an order payment
 */
class PaymentProcessingSaga extends Saga {
    constructor() {
        super("PaymentProcessingSaga");
        
        // Initialize services
        this.orderService = new OrderService();
        this.inventoryService = new InventoryService();
        this.paymentService = new PaymentService();
        this.shippingService = new ShippingService();
        this.notificationService = new NotificationService();

        // Build the saga steps
        this.buildSteps();
    }

    /**
     * Build the saga steps with their compensations
     */
    buildSteps() {
        // Step 1: Create Order
        this.addStep(
            "CreateOrder",
            async (context) => {
                const order = await this.orderService.createOrder({
                    customerId: context.get("customerId"),
                    items: context.get("items"),
                    totalAmount: context.get("totalAmount")
                });
                context.set("orderId", order.orderId);
                context.set("order", order);
                return order;
            },
            async (context) => {
                const orderId = context.get("orderId");
                if (orderId) {
                    await this.orderService.cancelOrder(orderId);
                }
            }
        );

        // Step 2: Reserve Inventory
        this.addStep(
            "ReserveInventory",
            async (context) => {
                const orderId = context.get("orderId");
                const items = context.get("items");
                const reservation = await this.inventoryService.reserveInventory(orderId, items);
                context.set("reservationId", reservation.reservationId);
                context.set("reservation", reservation);
                return reservation;
            },
            async (context) => {
                const reservationId = context.get("reservationId");
                if (reservationId) {
                    await this.inventoryService.releaseInventory(reservationId);
                }
            }
        );

        // Step 3: Process Payment
        this.addStep(
            "ProcessPayment",
            async (context) => {
                const orderId = context.get("orderId");
                const totalAmount = context.get("totalAmount");
                const paymentMethod = context.get("paymentMethod");
                const payment = await this.paymentService.processPayment(orderId, totalAmount, paymentMethod);
                context.set("paymentId", payment.paymentId);
                context.set("payment", payment);
                return payment;
            },
            async (context) => {
                const paymentId = context.get("paymentId");
                if (paymentId) {
                    await this.paymentService.refundPayment(paymentId);
                }
            }
        );

        // Step 4: Create Shipment
        this.addStep(
            "CreateShipment",
            async (context) => {
                const orderId = context.get("orderId");
                const shippingAddress = context.get("shippingAddress");
                const items = context.get("items");
                const shipment = await this.shippingService.createShipment(orderId, shippingAddress, items);
                context.set("shipmentId", shipment.shipmentId);
                context.set("shipment", shipment);
                return shipment;
            },
            async (context) => {
                const shipmentId = context.get("shipmentId");
                if (shipmentId) {
                    await this.shippingService.cancelShipment(shipmentId);
                }
            }
        );

        // Step 5: Confirm Order
        this.addStep(
            "ConfirmOrder",
            async (context) => {
                const orderId = context.get("orderId");
                const order = await this.orderService.confirmOrder(orderId);
                context.set("order", order);
                return order;
            },
            // No compensation needed - order cancellation is handled in Step 1
            null
        );

        // Step 6: Send Notifications
        this.addStep(
            "SendNotifications",
            async (context) => {
                const customerId = context.get("customerId");
                const orderId = context.get("orderId");
                const paymentId = context.get("paymentId");
                const totalAmount = context.get("totalAmount");
                const order = context.get("order");

                // Send order confirmation
                await this.notificationService.sendOrderConfirmation(customerId, orderId, order);
                
                // Send payment confirmation
                await this.notificationService.sendPaymentConfirmation(customerId, paymentId, totalAmount);

                return { status: "NOTIFICATIONS_SENT" };
            },
            async (context) => {
                const customerId = context.get("customerId");
                const orderId = context.get("orderId");
                
                // Send cancellation notification
                await this.notificationService.sendOrderCancellation(
                    customerId,
                    orderId,
                    "Order processing failed"
                );

                // Send refund notification if payment was processed
                const paymentId = context.get("paymentId");
                if (paymentId) {
                    const totalAmount = context.get("totalAmount");
                    await this.notificationService.sendRefundNotification(
                        customerId,
                        paymentId,
                        totalAmount
                    );
                }
            }
        );
    }

    /**
     * Get service instances (for testing/inspection)
     */
    getServices() {
        return {
            orderService: this.orderService,
            inventoryService: this.inventoryService,
            paymentService: this.paymentService,
            shippingService: this.shippingService,
            notificationService: this.notificationService
        };
    }
}

export default PaymentProcessingSaga;

