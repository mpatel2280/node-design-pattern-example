# Observer Design Pattern - Notification Utility

This directory demonstrates the **Observer Design Pattern** implemented as a notification utility that can be used consistently across an application.

## 📋 Pattern Overview

The Observer Pattern is a behavioral design pattern that defines a one-to-many dependency between objects. When one object (the Subject) changes state, all its dependents (Observers) are notified and updated automatically. This pattern is perfect for implementing distributed event handling systems.

## 🏗️ Structure

```
observer/
├── Subject.js                      # Base Subject class (Observable)
├── Observer.js                     # Base Observer interface
├── EventTypes.js                   # Event type definitions and data structures
├── NotificationCenter.js           # Generic notification center (Concrete Subject)
├── UserNotificationCenter.js       # User-specific notifications
├── OrderNotificationCenter.js      # Order-specific notifications
├── SystemNotificationCenter.js     # System-specific notifications
├── EmailObserver.js                # Email notification observer
├── SMSObserver.js                  # SMS notification observer
├── PushNotificationObserver.js     # Push notification observer
├── LogObserver.js                  # File logging observer
├── index.js                        # Demo/usage examples
└── README.md                       # This file
```

## 🎯 Components

### 1. **Subject** (Observable)
- Base class for objects that can be observed
- Manages a list of observers
- Methods: `attach()`, `detach()`, `notify()`
- Tracks observer count and provides statistics

### 2. **Observer** (Interface)
- Base class defining the observer interface
- Must implement `update(eventType, data, subject)` method
- Can be enabled/disabled dynamically
- Tracks notification count

### 3. **Concrete Subjects**
- **NotificationCenter**: Generic notification hub
- **UserNotificationCenter**: User-related events (registration, login, profile updates)
- **OrderNotificationCenter**: Order-related events (created, shipped, delivered)
- **SystemNotificationCenter**: System events (errors, warnings, maintenance)

### 4. **Concrete Observers**
- **EmailObserver**: Sends email notifications
- **SMSObserver**: Sends SMS notifications (priority-filtered)
- **PushNotificationObserver**: Sends push notifications to mobile/web
- **LogObserver**: Logs all notifications to a file

### 5. **Event System**
- **EventTypes**: Predefined event type constants
- **EventPriority**: Priority levels (LOW, MEDIUM, HIGH, CRITICAL)
- **NotificationEvent**: Event data structure with metadata

## 🚀 Usage

### Basic Usage

```javascript
import UserNotificationCenter from "./UserNotificationCenter.js";
import EmailObserver from "./EmailObserver.js";
import SMSObserver from "./SMSObserver.js";

// Create a notification center
const notificationCenter = new UserNotificationCenter();

// Create observers
const emailObserver = new EmailObserver("user@example.com");
const smsObserver = new SMSObserver("+1234567890");

// Attach observers
notificationCenter.attach(emailObserver);
notificationCenter.attach(smsObserver);

// Trigger an event - all observers will be notified
notificationCenter.registerUser("user123", {
    username: "john_doe",
    email: "john@example.com"
});
```

### Multiple Notification Centers

```javascript
import OrderNotificationCenter from "./OrderNotificationCenter.js";
import PushNotificationObserver from "./PushNotificationObserver.js";

const orderCenter = new OrderNotificationCenter();
const pushObserver = new PushNotificationObserver("device-token");

orderCenter.attach(pushObserver);

// Create and track an order
orderCenter.createOrder("ORD-001", {
    userId: "user123",
    items: ["Product A"],
    total: 99.99
});

orderCenter.shipOrder("ORD-001", "TRACK-123");
orderCenter.deliverOrder("ORD-001");
```

### Dynamic Observer Management

```javascript
// Disable an observer temporarily
emailObserver.disable();

// Trigger event - email observer won't receive it
notificationCenter.userLogin("user123");

// Re-enable the observer
emailObserver.enable();

// Detach an observer completely
const observerId = notificationCenter.attach(smsObserver);
notificationCenter.detach(observerId);
```

### Priority-Based Notifications

```javascript
import { EventPriority } from "./EventTypes.js";

// SMS observer only sends for HIGH and CRITICAL priority
const smsObserver = new SMSObserver("+1234567890", {
    priorityFilter: [EventPriority.HIGH, EventPriority.CRITICAL]
});

// This will send SMS (HIGH priority)
notificationCenter.passwordChanged("user123");

// This won't send SMS (LOW priority)
notificationCenter.userLogin("user123");
```

### Real-World Application Example

```javascript
class Application {
    constructor() {
        this.userCenter = new UserNotificationCenter();
        this.orderCenter = new OrderNotificationCenter();
        
        // Setup notification channels
        this.setupNotifications();
    }

    setupNotifications() {
        const email = new EmailObserver("admin@example.com");
        const sms = new SMSObserver("+1234567890");
        const log = new LogObserver("app.log");

        // Attach to all centers
        [this.userCenter, this.orderCenter].forEach(center => {
            center.attach(email);
            center.attach(sms);
            center.attach(log);
        });
    }

    processOrder(userId, orderData) {
        this.orderCenter.createOrder(orderData.id, orderData);
        // All observers are automatically notified
    }
}
```

## 🎨 Benefits

1. **Loose Coupling**: Subjects and observers are loosely coupled
2. **Dynamic Relationships**: Observers can be added/removed at runtime
3. **Broadcast Communication**: One event notifies multiple observers
4. **Open/Closed Principle**: Easy to add new observers without modifying subjects
5. **Separation of Concerns**: Notification logic is separated from business logic

## 🔧 Running the Demo

```bash
node observer/index.js
```

This will demonstrate:
- User notification system
- Order notification system  
- System notification system
- Dynamic observer management
- Observer statistics
- Real-world e-commerce scenario

## 📊 Features

### Event Types
- User events: registration, login, logout, profile updates, password changes
- Order events: created, confirmed, shipped, delivered, cancelled
- Payment events: received, failed, refunded
- System events: errors, warnings, maintenance, updates
- Security events: breaches, suspicious activity

### Observer Features
- Enable/disable observers dynamically
- Track notification counts
- Priority-based filtering (SMS)
- History tracking (Email, SMS, Push)
- File logging with timestamps

### Subject Features
- Event history tracking
- Statistics (events by type, priority)
- Observer management (attach, detach, count)
- Multiple notification centers for different domains

## 🔄 Extending the Pattern

To add a new observer type:

```javascript
import Observer from "./Observer.js";

class SlackObserver extends Observer {
    constructor(webhookUrl) {
        super("SlackObserver");
        this.webhookUrl = webhookUrl;
    }

    update(eventType, data, subject) {
        if (!this.enabled) return;
        
        this.notificationCount++;
        // Send to Slack
        this.sendToSlack(eventType, data);
    }

    sendToSlack(eventType, data) {
        // Implementation
    }
}
```

To add a new notification center:

```javascript
import NotificationCenter from "./NotificationCenter.js";
import { EventTypes, EventPriority } from "./EventTypes.js";

class PaymentNotificationCenter extends NotificationCenter {
    constructor() {
        super("PaymentNotificationCenter");
    }

    processPayment(paymentId, amount) {
        this.sendNotification(
            EventTypes.PAYMENT_RECEIVED,
            { paymentId, amount },
            EventPriority.HIGH
        );
    }
}
```

## 🌟 Key Concepts Demonstrated

1. **Observer Pattern**: Subject-Observer relationship
2. **Event-Driven Architecture**: Decoupled event handling
3. **Publish-Subscribe**: One-to-many communication
4. **Strategy Pattern**: Different notification strategies
5. **Single Responsibility**: Each observer handles one channel
6. **Open/Closed Principle**: Extensible without modification

