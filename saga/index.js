import PaymentProcessingSaga from "./PaymentProcessingSaga.js";
import SagaOrchestrator from "./SagaOrchestrator.js";

console.log("=".repeat(70));
console.log("Saga Design Pattern - Payment Processing System Demo");
console.log("=".repeat(70));
console.log();

// Create orchestrator
const orchestrator = new SagaOrchestrator();

// Create and register the payment processing saga
const paymentSaga = new PaymentProcessingSaga();
orchestrator.registerSaga("PaymentProcessing", paymentSaga);

console.log();

// Example 1: Successful Payment Processing
console.log("Example 1: Successful Payment Processing");
console.log("-".repeat(70));

const successfulOrder = {
    customerId: "CUST_001",
    items: [
        { productId: "PROD_001", quantity: 1 }, // Laptop
        { productId: "PROD_002", quantity: 2 }  // Mouse
    ],
    totalAmount: 1299.99,
    paymentMethod: {
        type: "credit_card",
        cardNumber: "4111111111111111",
        expiryDate: "12/25",
        cvv: "123"
    },
    shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
    }
};

async function runSuccessfulExample() {
    try {
        const context = await orchestrator.executeSaga("PaymentProcessing", successfulOrder);
        
        console.log("\n📋 Saga Result:");
        console.log("=".repeat(70));
        console.log(`Status: ${context.getStatus()}`);
        console.log(`Order ID: ${context.get("orderId")}`);
        console.log(`Payment ID: ${context.get("paymentId")}`);
        console.log(`Reservation ID: ${context.get("reservationId")}`);
        console.log(`Shipment ID: ${context.get("shipmentId")}`);
        console.log(`Duration: ${context.getDuration()}ms`);
        console.log("=".repeat(70));
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Example 2: Failed Payment (Insufficient Inventory)
console.log("\n\nExample 2: Failed Payment - Insufficient Inventory");
console.log("-".repeat(70));

const failedOrderInventory = {
    customerId: "CUST_002",
    items: [
        { productId: "PROD_004", quantity: 10 } // Monitor - only 5 in stock
    ],
    totalAmount: 2999.99,
    paymentMethod: {
        type: "credit_card",
        cardNumber: "4111111111111111",
        expiryDate: "12/25",
        cvv: "123"
    },
    shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        country: "USA"
    }
};

async function runFailedInventoryExample() {
    try {
        const context = await orchestrator.executeSaga("PaymentProcessing", failedOrderInventory);
        
        console.log("\n📋 Saga Result:");
        console.log("=".repeat(70));
        console.log(`Status: ${context.getStatus()}`);
        console.log(`Error: ${context.getError() ? context.getError().message : "None"}`);
        console.log(`Duration: ${context.getDuration()}ms`);
        console.log("=".repeat(70));
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Example 3: Failed Payment (Payment Gateway Error)
console.log("\n\nExample 3: Failed Payment - Payment Gateway Error");
console.log("-".repeat(70));

const failedOrderPayment = {
    customerId: "CUST_003",
    items: [
        { productId: "PROD_003", quantity: 1 } // Keyboard
    ],
    totalAmount: 99.99,
    paymentMethod: {
        type: "credit_card",
        cardNumber: "4111111111111111",
        expiryDate: "12/25",
        cvv: "123"
    },
    shippingAddress: {
        street: "789 Pine Rd",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA"
    }
};

async function runFailedPaymentExample() {
    // Set payment service to fail
    const services = paymentSaga.getServices();
    services.paymentService.setFailureRate(1.0); // 100% failure rate

    try {
        const context = await orchestrator.executeSaga("PaymentProcessing", failedOrderPayment);
        
        console.log("\n📋 Saga Result:");
        console.log("=".repeat(70));
        console.log(`Status: ${context.getStatus()}`);
        console.log(`Error: ${context.getError() ? context.getError().message : "None"}`);
        console.log(`Duration: ${context.getDuration()}ms`);
        console.log("=".repeat(70));
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        // Reset failure rate
        services.paymentService.setFailureRate(0);
    }
}

// Run all examples
async function runAllExamples() {
    await runSuccessfulExample();
    await runFailedInventoryExample();
    await runFailedPaymentExample();
    
    // Print orchestrator statistics
    console.log("\n");
    orchestrator.printStatistics();
    
    // Show inventory status
    console.log("\n📦 Final Inventory Status:");
    console.log("=".repeat(70));
    const services = paymentSaga.getServices();
    const inventory = services.inventoryService.getInventory();
    inventory.forEach(item => {
        console.log(`${item.name}: ${item.stock} units`);
    });
    console.log("=".repeat(70));
}

runAllExamples().catch(console.error);

