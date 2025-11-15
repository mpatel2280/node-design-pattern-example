# Singleton Design Pattern - Logger Utility

This directory demonstrates the **Singleton Design Pattern** implemented as a logging utility that ensures only one instance exists throughout the application.

## 📋 Pattern Overview

The Singleton Pattern is a creational design pattern that ensures a class has only one instance and provides a global point of access to that instance. This is useful for resources that should be shared across the entire application, such as:

- Logging systems
- Configuration managers
- Database connections
- Cache managers
- Thread pools

## 🏗️ Structure

```
singlton/
├── logger.js       # Singleton Logger implementation
├── serviceA.js     # Service using the logger
├── serviceB.js     # Another service using the same logger instance
├── index.js        # Demo showing both services share the same logger
├── app.log         # Log file created by the logger
└── README.md       # This file
```

## 🎯 Implementation

### Logger Singleton (ES6 Module Pattern)

The logger is implemented using the ES6 module pattern, which naturally provides singleton behavior in Node.js:

```javascript
class Logger {
    constructor() {
        this.logFile = path.join(__dirname, "app.log");
    }

    log(message) {
        const formatted = `[${new Date().toISOString()}] ${message}`;
        console.log(formatted);
        fs.appendFileSync(this.logFile, formatted + "\n");
    }

    error(message) {
        const formatted = `[${new Date().toISOString()}] ERROR: ${message}`;
        console.error(formatted);
        fs.appendFileSync(this.logFile, formatted + "\n");
    }
}

// Export a single instance
export default new Logger();
```

### Key Points

1. **Module-Level Singleton**: Node.js caches module exports, so every import gets the same instance
2. **No Constructor Logic Needed**: Unlike traditional singleton patterns, no need for instance checking in constructor
3. **Clean and Simple**: ES6 modules provide singleton behavior naturally

## 🚀 Usage

### Basic Usage

```javascript
import logger from "./logger.js";

// Use the logger
logger.log("Application started");
logger.error("Something went wrong");
```

### Multiple Services Sharing the Logger

```javascript
// serviceA.js
import logger from "./logger.js";

export default function serviceA() {
    logger.log("Service A started");
}

// serviceB.js
import logger from "./logger.js";

export default function serviceB() {
    logger.log("Service B started");
}

// Both services use the SAME logger instance
```

## 🔧 Running the Demo

```bash
node singlton/index.js
```

This will:
1. Start Service A (logs to console and file)
2. Start Service B (logs to console and file using the same logger instance)
3. Create/append to `app.log` file

## ✨ Features

### Current Implementation
- ✅ Single logger instance across the application
- ✅ Logs to both console and file
- ✅ ISO timestamp formatting
- ✅ Separate methods for regular logs and errors
- ✅ ES6 module syntax
- ✅ Automatic file creation

### Benefits
- **Memory Efficiency**: Only one instance exists
- **Consistent State**: All parts of the application share the same logger state
- **Global Access**: Easy to access from anywhere in the application
- **Thread-Safe**: Node.js single-threaded nature ensures thread safety

## 🎨 Singleton Pattern Variations

### 1. ES6 Module Pattern (Current Implementation)
```javascript
class Logger { /* ... */ }
export default new Logger();
```
**Pros**: Simple, clean, leverages Node.js module caching
**Cons**: Cannot pass constructor parameters at import time

### 2. Classic Singleton with Static Instance
```javascript
class Logger {
    static instance = null;
    
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
}
```
**Pros**: Lazy initialization, can control instance creation
**Cons**: More boilerplate code

### 3. Singleton with Constructor Check
```javascript
class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }
        Logger.instance = this;
        // initialization code
    }
}
```
**Pros**: Works with `new` keyword
**Cons**: Linter warnings, less clear intent

## 📊 When to Use Singleton

### ✅ Good Use Cases
- **Logging**: Single log manager for the entire application
- **Configuration**: Single source of truth for app settings
- **Database Connection Pool**: Share connections across the app
- **Cache**: Single cache instance
- **Event Bus**: Central event dispatcher

### ❌ When NOT to Use
- **Testing**: Singletons can make unit testing difficult
- **Parallel Processing**: May cause bottlenecks
- **Dependency Injection**: DI frameworks provide better alternatives
- **Stateless Services**: No need for singleton if there's no shared state

## 🧪 Testing Considerations

Singletons can make testing challenging because:
1. State persists between tests
2. Hard to mock or replace
3. Creates hidden dependencies

### Solutions:
```javascript
// Add a reset method for testing
class Logger {
    reset() {
        // Clear any state
        this.logFile = path.join(__dirname, "app.log");
    }
}

// Or export the class and instance separately
export class Logger { /* ... */ }
export default new Logger();

// In tests, create new instances
import { Logger } from "./logger.js";
const testLogger = new Logger();
```

## 🆚 Singleton vs Other Patterns

| Pattern | Purpose | Instance Count | Use Case |
|---------|---------|----------------|----------|
| **Singleton** | Ensure one instance | 1 | Shared resources |
| **Factory** | Create objects | Many | Object creation logic |
| **Prototype** | Clone objects | Many | Object copying |
| **Multiton** | Named instances | Multiple (keyed) | Multiple named singletons |

## 🎓 Best Practices

1. **Use ES6 Modules**: Leverage Node.js module caching for simplicity
2. **Keep It Simple**: Don't over-engineer the singleton
3. **Document Clearly**: Make it obvious that it's a singleton
4. **Consider Alternatives**: Sometimes dependency injection is better
5. **Thread Safety**: In multi-threaded environments, ensure proper locking
6. **Lazy vs Eager**: Choose based on initialization cost

## ⚠️ Common Pitfalls

1. **Global State**: Singletons introduce global state, which can be problematic
2. **Hidden Dependencies**: Makes dependencies less explicit
3. **Testing Difficulty**: Hard to isolate in unit tests
4. **Tight Coupling**: Can lead to tight coupling between components

## 🔗 Related Patterns

- **Factory Pattern**: Often used together to control instance creation
- **Dependency Injection**: Modern alternative to singleton
- **Multiton Pattern**: Multiple named singleton instances
- **Object Pool**: Similar concept but manages multiple reusable instances

