import NotificationCenter from "./NotificationCenter.js";
import { EventTypes, EventPriority } from "./EventTypes.js";

/**
 * SystemNotificationCenter - Manages system-related notifications
 * Specialized Concrete Subject for system events
 */
class SystemNotificationCenter extends NotificationCenter {
    constructor() {
        super("SystemNotificationCenter");
        this.systemStatus = {
            status: "operational",
            uptime: 0,
            lastError: null,
            maintenanceMode: false
        };
    }

    /**
     * Report a system error
     * @param {string} message - Error message
     * @param {Object} errorDetails - Error details
     */
    reportError(message, errorDetails = {}) {
        this.systemStatus.lastError = {
            message,
            details: errorDetails,
            timestamp: new Date()
        };

        this.sendNotification(
            EventTypes.SYSTEM_ERROR,
            {
                message,
                ...errorDetails,
                stack: errorDetails.stack
            },
            EventPriority.CRITICAL
        );
    }

    /**
     * Report a system warning
     * @param {string} message - Warning message
     * @param {Object} details - Warning details
     */
    reportWarning(message, details = {}) {
        this.sendNotification(
            EventTypes.SYSTEM_WARNING,
            {
                message,
                ...details
            },
            EventPriority.HIGH
        );
    }

    /**
     * Announce system maintenance
     * @param {Date} startTime - Maintenance start time
     * @param {Date} endTime - Maintenance end time
     * @param {string} reason - Maintenance reason
     */
    announceMaintenance(startTime, endTime, reason = "") {
        this.systemStatus.maintenanceMode = true;

        this.sendNotification(
            EventTypes.SYSTEM_MAINTENANCE,
            {
                startTime,
                endTime,
                reason,
                duration: endTime - startTime
            },
            EventPriority.HIGH
        );
    }

    /**
     * Complete system maintenance
     */
    completeMaintenance() {
        this.systemStatus.maintenanceMode = false;

        this.sendNotification(
            EventTypes.SYSTEM_UPDATE,
            {
                message: "System maintenance completed",
                status: "operational"
            },
            EventPriority.MEDIUM
        );
    }

    /**
     * Announce system update
     * @param {string} version - New version
     * @param {Array} features - New features
     */
    announceUpdate(version, features = []) {
        this.sendNotification(
            EventTypes.SYSTEM_UPDATE,
            {
                version,
                features,
                message: `System updated to version ${version}`
            },
            EventPriority.MEDIUM
        );
    }

    /**
     * Report security breach
     * @param {string} type - Type of breach
     * @param {Object} details - Breach details
     */
    reportSecurityBreach(type, details = {}) {
        this.sendNotification(
            EventTypes.SECURITY_BREACH,
            {
                type,
                ...details,
                severity: "critical"
            },
            EventPriority.CRITICAL
        );
    }

    /**
     * Report suspicious activity
     * @param {string} userId - User ID involved
     * @param {string} activity - Description of activity
     * @param {Object} details - Additional details
     */
    reportSuspiciousActivity(userId, activity, details = {}) {
        this.sendNotification(
            EventTypes.SUSPICIOUS_ACTIVITY,
            {
                userId,
                activity,
                ...details
            },
            EventPriority.HIGH
        );
    }

    /**
     * Get system status
     * @returns {Object} System status
     */
    getSystemStatus() {
        return {
            ...this.systemStatus,
            uptime: Date.now() - (this.systemStatus.startTime || Date.now())
        };
    }

    /**
     * Set system status
     * @param {string} status - The status (operational, degraded, down)
     */
    setSystemStatus(status) {
        this.systemStatus.status = status;
    }
}

export default SystemNotificationCenter;

