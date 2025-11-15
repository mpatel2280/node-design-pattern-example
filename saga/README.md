# Saga Design Pattern - Payment Processing System

This directory demonstrates the **Saga Design Pattern** implemented as a distributed transaction management system for payment processing involving multiple services.

## 📋 Pattern Overview

The Saga Pattern is a design pattern for managing distributed transactions across multiple microservices. Instead of using traditional ACID transactions, a saga breaks down a transaction into a series of local transactions, each with a compensating transaction that can undo its effects if something goes wrong later in the process.

### Key Concepts

- **Saga**: A sequence of local transactions
- **Compensating Transaction**: An operation that undoes the effect of a previous transaction
- **Forward Recovery**: Continue processing despite failures
- **Backward Recovery**: Undo completed steps when a failure occurs

## 🏗️ Structure

```
saga/
├── Saga.js                      # Base Saga class
├── SagaStep.js                  # Individual saga step with compensation
├── SagaContext.js               # Context holding saga state and data
├── SagaOrchestrator.js          # Orchestrator managing saga executions
├── PaymentProcessingSaga.js     # Concrete saga implementation
├── PaymentService.js            # Payment processing service
├── InventoryService.js          # Inventory management service
├── OrderService.js              # Order management service
├── ShippingService.js           # Shipping service
├── NotificationService.js       # Notification service
├── index.js                     # Demo/usage examples
└── README.md                    # This file
```

## 🎯 Components

### 1. **Core Saga Components**

#### Saga
- Base class for implementing sagas
- Manages a sequence of steps
- Executes steps in order
- Triggers compensation on failure

#### SagaStep
- Represents a single step with action and compensation
- Tracks execution state
- Handles errors gracefully

#### SagaContext
- Holds saga state and data
- Tracks executed steps
- Manages saga lifecycle (PENDING → IN_PROGRESS → COMPLETED/FAILED/COMPENSATED)

#### SagaOrchestrator
- Manages multiple sagas
- Provides monitoring and statistics
- Records execution history

### 2. **Services**

#### PaymentService
- Processes payments
- Refunds payments (compensation)
- Simulates payment gateway interactions

#### InventoryService
- Reserves inventory
- Releases inventory (compensation)
- Manages stock levels

#### OrderService
- Creates orders
- Confirms orders
- Cancels orders (compensation)

#### ShippingService
- Creates shipments
- Cancels shipments (compensation)
- Generates tracking numbers

#### NotificationService
- Sends order confirmations
- Sends payment confirmations
- Sends cancellation/refund notifications (compensation)

### 3. **PaymentProcessingSaga**

A concrete saga implementation that orchestrates the payment processing workflow:

1. **CreateOrder** - Create an order record
2. **ReserveInventory** - Reserve items from inventory
3. **ProcessPayment** - Charge the customer
4. **CreateShipment** - Create shipping label and tracking
5. **ConfirmOrder** - Mark order as confirmed
6. **SendNotifications** - Notify customer of success

Each step has a corresponding compensation action that executes in reverse order if any step fails.

## 🚀 Usage

### Basic Usage

```javascript
import PaymentProcessingSaga from "./PaymentProcessingSaga.js";

const saga = new PaymentProcessingSaga();

const orderData = {
    customerId: "CUST_001",
    items: [
        { productId: "PROD_001", quantity: 1 }
    ],
    totalAmount: 1299.99,
    paymentMethod: {
        type: "credit_card",
        cardNumber: "4111111111111111"
    },
    shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001"
    }
};

const context = await saga.execute(orderData);

if (context.getStatus() === "COMPLETED") {
    console.log("Order processed successfully!");
    console.log("Order ID:", context.get("orderId"));
} else {
    console.log("Order failed:", context.getError().message);
}
```

### Using the Orchestrator

```javascript
import SagaOrchestrator from "./SagaOrchestrator.js";
import PaymentProcessingSaga from "./PaymentProcessingSaga.js";

const orchestrator = new SagaOrchestrator();
const saga = new PaymentProcessingSaga();

orchestrator.registerSaga("PaymentProcessing", saga);

const context = await orchestrator.executeSaga("PaymentProcessing", orderData);

// Get statistics
const stats = orchestrator.getStatistics();
console.log("Total executions:", stats.totalExecutions);
console.log("Success rate:", stats.byStatus.COMPLETED / stats.totalExecutions);
```

### Creating a Custom Saga

```javascript
import Saga from "./Saga.js";

class CustomSaga extends Saga {
    constructor() {
        super("CustomSaga");
        this.buildSteps();
    }

    buildSteps() {
        // Step 1: Do something
        this.addStep(
            "StepName",
            async (context) => {
                // Forward action
                const result = await doSomething();
                context.set("result", result);
                return result;
            },
            async (context) => {
                // Compensation action
                const result = context.get("result");
                await undoSomething(result);
            }
        );

        // Add more steps...
    }
}
```

## 🔄 Saga Execution Flow

### Successful Flow

```
1. CreateOrder ✓
2. ReserveInventory ✓
3. ProcessPayment ✓
4. CreateShipment ✓
5. ConfirmOrder ✓
6. SendNotifications ✓
→ Status: COMPLETED
```

### Failed Flow (with Compensation)

```
1. CreateOrder ✓
2. ReserveInventory ✓
3. ProcessPayment ✗ (FAILED)
→ Start Compensation
   ◀ Compensate: ReserveInventory (release inventory)
   ◀ Compensate: CreateOrder (cancel order)
→ Status: COMPENSATED
```

## 🎨 Benefits

1. **Distributed Transaction Management**: Handles transactions across multiple services
2. **Automatic Rollback**: Compensations execute automatically on failure
3. **Consistency**: Maintains eventual consistency across services
4. **Resilience**: Gracefully handles partial failures
5. **Auditability**: Complete history of all steps and compensations
6. **Loose Coupling**: Services remain independent

## 🔧 Running the Demo

```bash
node saga/index.js
```

This will demonstrate:
- Successful payment processing
- Failed transaction due to insufficient inventory
- Failed transaction due to payment gateway error
- Automatic compensation execution
- Orchestrator statistics

## 📊 Features

### Saga Context Features
- Unique saga ID generation
- State tracking (PENDING, IN_PROGRESS, COMPLETED, FAILED, COMPENSATING, COMPENSATED)
- Execution history
- Duration tracking
- Error handling

### Orchestrator Features
- Multiple saga registration
- Execution history
- Statistics (success rate, average duration, etc.)
- Monitoring capabilities

### Service Features
- Simulated network delays
- Configurable failure rates (for testing)
- Complete CRUD operations
- Idempotent compensations

## 🧪 Testing Scenarios

### Test 1: Successful Order
All steps complete successfully, order is processed.

### Test 2: Insufficient Inventory
Order fails at inventory reservation, order is cancelled.

### Test 3: Payment Failure
Payment fails, inventory is released and order is cancelled.

### Test 4: Shipping Failure
Shipment creation fails, payment is refunded, inventory is released, order is cancelled.

## 🌟 Key Concepts Demonstrated

1. **Saga Pattern**: Distributed transaction management
2. **Compensating Transactions**: Undo operations for rollback
3. **Orchestration**: Centralized saga coordination
4. **Event Sourcing**: Complete audit trail
5. **Eventual Consistency**: Consistency across distributed services
6. **Error Handling**: Graceful failure recovery
7. **Idempotency**: Safe retry of operations

## 🔍 Real-World Applications

- **E-commerce**: Order processing with payment, inventory, and shipping
- **Banking**: Money transfers across accounts
- **Travel Booking**: Flight + Hotel + Car rental reservations
- **Microservices**: Any multi-service transaction
- **Distributed Systems**: Cross-service workflows

## 📈 Monitoring

The orchestrator provides comprehensive monitoring:

```javascript
// Get execution history
const history = orchestrator.getExecutionHistory(10);

// Get statistics
const stats = orchestrator.getStatistics();
console.log("Total Executions:", stats.totalExecutions);
console.log("By Status:", stats.byStatus);
console.log("Average Duration:", stats.averageDuration);

// Print statistics
orchestrator.printStatistics();
```

## 🆚 Saga vs Two-Phase Commit (2PC)

| Aspect | Saga Pattern | Two-Phase Commit |
|--------|-------------|------------------|
| **Consistency** | Eventual consistency | Strong consistency |
| **Locking** | No distributed locks | Requires locks |
| **Performance** | High throughput | Lower throughput |
| **Complexity** | Requires compensations | Simpler logic |
| **Failure Handling** | Graceful degradation | All-or-nothing |
| **Scalability** | Highly scalable | Limited scalability |

## 🎓 Best Practices

1. **Idempotent Operations**: Ensure all actions and compensations are idempotent
2. **Compensation Logic**: Always implement compensation for critical steps
3. **Timeout Handling**: Set appropriate timeouts for each step
4. **Monitoring**: Track saga execution metrics
5. **Error Logging**: Log all failures and compensations
6. **Testing**: Test both success and failure scenarios
7. **Ordering**: Order steps to minimize compensation complexity

## ⚠️ Limitations

1. **Eventual Consistency**: Not suitable for scenarios requiring immediate consistency
2. **Compensation Complexity**: Complex compensations can be error-prone
3. **Partial Visibility**: Intermediate states are visible to users
4. **No Isolation**: Other transactions can see intermediate results

## 🔗 Related Patterns

- **Event Sourcing**: Store saga state as events
- **CQRS**: Separate read/write models for saga data
- **Choreography**: Alternative to orchestration (event-driven)
- **Circuit Breaker**: Prevent cascading failures
- **Retry Pattern**: Handle transient failures

## 📚 Further Reading

- [Microservices Patterns by Chris Richardson](https://microservices.io/patterns/data/saga.html)
- [Saga Pattern in Distributed Systems](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga)
- [Managing Data in Microservices](https://www.nginx.com/blog/microservices-at-netflix-architectural-best-practices/)

