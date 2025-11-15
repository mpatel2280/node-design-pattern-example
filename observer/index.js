import UserNotificationCenter from "./UserNotificationCenter.js";
import OrderNotificationCenter from "./OrderNotificationCenter.js";
import SystemNotificationCenter from "./SystemNotificationCenter.js";
import EmailObserver from "./EmailObserver.js";
import SMSObserver from "./SMSObserver.js";
import PushNotificationObserver from "./PushNotificationObserver.js";
import LogObserver from "./LogObserver.js";
import { EventPriority } from "./EventTypes.js";

console.log("=".repeat(70));
console.log("Observer Design Pattern - Notification Utility Demo");
console.log("=".repeat(70));
console.log();

// Example 1: User Notifications
console.log("1. User Notification System:");
console.log("-".repeat(70));

const userNotificationCenter = new UserNotificationCenter();

// Create observers
const emailObserver = new EmailObserver("user@example.com");
const smsObserver = new SMSObserver("+1234567890");
const pushObserver = new PushNotificationObserver("device-token-123", { platform: "iOS" });
const logObserver = new LogObserver("notifications.log");

// Attach observers to the user notification center
userNotificationCenter.attach(emailObserver);
userNotificationCenter.attach(smsObserver);
userNotificationCenter.attach(pushObserver);
userNotificationCenter.attach(logObserver);

console.log();

// Trigger user events
console.log("Registering a new user...");
userNotificationCenter.registerUser("user123", {
    username: "john_doe",
    email: "john@example.com"
});

console.log();
console.log("User logging in...");
userNotificationCenter.userLogin("user123", {
    location: "New York, USA",
    device: "iPhone 14",
    ipAddress: "192.168.1.1"
});

console.log();
console.log("Password changed (high priority)...");
userNotificationCenter.passwordChanged("user123");

console.log();
console.log();

// Example 2: Order Notifications
console.log("2. Order Notification System:");
console.log("-".repeat(70));

const orderNotificationCenter = new OrderNotificationCenter();

// Attach the same observers to order notifications
orderNotificationCenter.attach(emailObserver);
orderNotificationCenter.attach(smsObserver);
orderNotificationCenter.attach(pushObserver);
orderNotificationCenter.attach(logObserver);

console.log();

// Trigger order events
console.log("Creating a new order...");
orderNotificationCenter.createOrder("ORD-001", {
    userId: "user123",
    items: ["Product A", "Product B"],
    total: 99.99
});

console.log();
console.log("Shipping the order...");
orderNotificationCenter.shipOrder("ORD-001", "TRACK-123456");

console.log();
console.log("Order delivered...");
orderNotificationCenter.deliverOrder("ORD-001");

console.log();
console.log();

// Example 3: System Notifications
console.log("3. System Notification System:");
console.log("-".repeat(70));

const systemNotificationCenter = new SystemNotificationCenter();

// Attach observers
systemNotificationCenter.attach(emailObserver);
systemNotificationCenter.attach(smsObserver);
systemNotificationCenter.attach(pushObserver);
systemNotificationCenter.attach(logObserver);

console.log();

// Trigger system events
console.log("Reporting a system warning...");
systemNotificationCenter.reportWarning("High memory usage detected", {
    memoryUsage: "85%",
    threshold: "80%"
});

console.log();
console.log("Reporting a critical system error...");
systemNotificationCenter.reportError("Database connection failed", {
    database: "primary",
    error: "Connection timeout"
});

console.log();
console.log();

// Example 4: Dynamic Observer Management
console.log("4. Dynamic Observer Management:");
console.log("-".repeat(70));

console.log("Disabling email observer...");
emailObserver.disable();

console.log();
console.log("Triggering event with email observer disabled...");
userNotificationCenter.profileUpdated("user123", {
    field: "phone",
    oldValue: "+1111111111",
    newValue: "+1234567890"
});

console.log();
console.log("Re-enabling email observer...");
emailObserver.enable();

console.log();
console.log();

// Example 5: Observer Statistics
console.log("5. Observer Statistics:");
console.log("-".repeat(70));

console.log(`Email Observer: ${emailObserver.getNotificationCount()} notifications received`);
console.log(`SMS Observer: ${smsObserver.getNotificationCount()} notifications sent`);
console.log(`Push Observer: ${pushObserver.getNotificationCount()} notifications sent`);
console.log(`Log Observer: ${logObserver.getNotificationCount()} entries logged`);

console.log();

// Show notification center statistics
const userStats = userNotificationCenter.getStatistics();
console.log("User Notification Center Statistics:");
console.log(`  Total Events: ${userStats.totalEvents}`);
console.log(`  Total Observers: ${userStats.totalObservers}`);
console.log(`  Events by Type:`, userStats.eventsByType);

console.log();
console.log();

// Example 6: Detaching Observers
console.log("6. Detaching Observers:");
console.log("-".repeat(70));

console.log(`Current observers on UserNotificationCenter: ${userNotificationCenter.getObserverCount()}`);
console.log(`Observer names: ${userNotificationCenter.getObserverNames().join(", ")}`);

console.log();
console.log("Detaching SMS observer...");
const smsObserverId = 2; // Assuming SMS was the 2nd observer attached
userNotificationCenter.detach(smsObserverId);

console.log();
console.log("Triggering event after detaching SMS observer...");
userNotificationCenter.userLogout("user123");

console.log();
console.log();

// Example 7: Real-World Application Scenario
console.log("7. Real-World Application Scenario - E-commerce Flow:");
console.log("-".repeat(70));

class EcommerceApplication {
    constructor() {
        this.userCenter = new UserNotificationCenter();
        this.orderCenter = new OrderNotificationCenter();
        this.systemCenter = new SystemNotificationCenter();

        // Setup notification channels
        this.setupNotifications();
    }

    setupNotifications() {
        // Create observers for a specific user
        const email = new EmailObserver("customer@example.com");
        const sms = new SMSObserver("+1987654321");
        const push = new PushNotificationObserver("customer-device-token");
        const log = new LogObserver("ecommerce.log");

        // Attach to all centers
        [this.userCenter, this.orderCenter, this.systemCenter].forEach(center => {
            center.attach(email);
            center.attach(sms);
            center.attach(push);
            center.attach(log);
        });
    }

    processCustomerJourney(userId, userEmail) {
        console.log(`\nProcessing customer journey for user: ${userId}`);
        console.log("-".repeat(70));

        // Step 1: User registers
        console.log("\n[Step 1] User Registration");
        this.userCenter.registerUser(userId, {
            username: "jane_smith",
            email: userEmail
        });

        // Step 2: User places an order
        console.log("\n[Step 2] Order Placement");
        this.orderCenter.createOrder("ORD-002", {
            userId: userId,
            items: ["Laptop", "Mouse", "Keyboard"],
            total: 1299.99
        });

        // Step 3: Order is confirmed
        console.log("\n[Step 3] Order Confirmation");
        this.orderCenter.confirmOrder("ORD-002");

        // Step 4: Order is shipped
        console.log("\n[Step 4] Order Shipment");
        this.orderCenter.shipOrder("ORD-002", "TRACK-789012");

        // Step 5: Order is delivered
        console.log("\n[Step 5] Order Delivery");
        this.orderCenter.deliverOrder("ORD-002");

        console.log("\n✅ Customer journey completed successfully!");
    }
}

const app = new EcommerceApplication();
app.processCustomerJourney("user456", "jane@example.com");

console.log();
console.log();
console.log("=".repeat(70));
console.log("Demo completed! Check the log files in the observer directory.");
console.log("=".repeat(70));

