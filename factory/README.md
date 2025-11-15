# Factory Design Pattern - Logging Utility

This directory demonstrates the **Factory Design Pattern** implemented as a logging utility that can be used consistently across an application.

## 📋 Pattern Overview

The Factory Pattern is a creational design pattern that provides an interface for creating objects without specifying their exact classes. It encapsulates object creation logic and makes the code more flexible and maintainable.

## 🏗️ Structure

```
factory/
├── BaseLogger.js          # Abstract base class (Product interface)
├── ConsoleLogger.js       # Concrete implementation - logs to console
├── FileLogger.js          # Concrete implementation - logs to file
├── DatabaseLogger.js      # Concrete implementation - logs to database
├── CompositeLogger.js     # Composite implementation - logs to multiple destinations
├── LoggerFactory.js       # Factory class - creates logger instances
├── index.js              # Demo/usage examples
└── README.md             # This file
```

## 🎯 Components

### 1. **BaseLogger** (Product Interface)
- Abstract base class that defines the interface for all loggers
- Methods: `log()`, `warn()`, `error()`, `debug()`
- Provides common functionality like message formatting

### 2. **Concrete Loggers** (Concrete Products)
- **ConsoleLogger**: Logs messages to the console with color coding
- **FileLogger**: Logs messages to a file
- **DatabaseLogger**: Logs messages to a database (simulated)
- **CompositeLogger**: Logs to multiple destinations simultaneously

### 3. **LoggerFactory** (Factory)
- Creates logger instances based on type
- Provides convenience methods for common scenarios
- Supports environment-based logger creation

## 🚀 Usage

### Basic Usage

```javascript
import LoggerFactory from "./LoggerFactory.js";

// Create a console logger
const logger = LoggerFactory.createLogger("console");
logger.log("Hello, World!");
logger.error("Something went wrong!");

// Create a file logger
const fileLogger = LoggerFactory.createLogger("file", { 
    filename: "app.log" 
});
fileLogger.log("This goes to a file");

// Create a database logger
const dbLogger = LoggerFactory.createLogger("database");
dbLogger.log("This goes to the database");
```

### Composite Logger

```javascript
// Log to multiple destinations at once
const compositeLogger = LoggerFactory.createCompositeLogger(
    ["console", "file", "database"],
    { filename: "app.log" }
);

compositeLogger.log("This message goes everywhere!");
```

### Environment-Based Logger

```javascript
// Automatically create appropriate logger for environment
const logger = LoggerFactory.createLoggerForEnvironment("production");
// In production: logs to file + database
// In development: logs to console + file
// In test: logs to file only

logger.log("Environment-specific logging");
```

### Real-World Application Example

```javascript
class Application {
    constructor(environment) {
        this.logger = LoggerFactory.createLoggerForEnvironment(environment);
    }

    start() {
        this.logger.log("Application started");
    }

    handleError(error) {
        this.logger.error(`Error: ${error}`);
    }
}

const app = new Application("production");
app.start();
```

## 🎨 Benefits

1. **Encapsulation**: Object creation logic is centralized in the factory
2. **Flexibility**: Easy to add new logger types without changing client code
3. **Consistency**: All loggers follow the same interface
4. **Maintainability**: Changes to logger creation logic are isolated
5. **Testability**: Easy to mock or substitute loggers for testing

## 🔧 Running the Demo

```bash
node factory/index.js
```

This will demonstrate:
- Creating individual loggers
- Using composite loggers
- Environment-based logger creation
- Real-world application scenario

## 📝 Available Logger Types

- `console` - Logs to console with color coding
- `file` - Logs to a file
- `database` - Logs to a database (simulated)
- `composite` - Logs to multiple destinations

## 🌟 Key Concepts Demonstrated

1. **Factory Pattern**: `LoggerFactory` creates logger instances
2. **Inheritance**: All loggers extend `BaseLogger`
3. **Polymorphism**: All loggers implement the same interface
4. **Composite Pattern**: `CompositeLogger` combines multiple loggers
5. **Strategy Pattern**: Different logging strategies (console, file, database)

## 🔄 Extending the Pattern

To add a new logger type:

1. Create a new class extending `BaseLogger`
2. Implement all required methods (`log`, `warn`, `error`, `debug`)
3. Add the new type to `LoggerFactory.LoggerTypes`
4. Add a case in `LoggerFactory.createLogger()`

Example:

```javascript
// EmailLogger.js
import BaseLogger from "./BaseLogger.js";

class EmailLogger extends BaseLogger {
    constructor() {
        super("EmailLogger");
    }

    log(message) {
        // Send email logic
    }
    // ... implement other methods
}

export default EmailLogger;
```

Then update the factory to include it.

