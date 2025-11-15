import NotificationCenter from "./NotificationCenter.js";
import { EventTypes, EventPriority } from "./EventTypes.js";

/**
 * UserNotificationCenter - Manages user-related notifications
 * Specialized Concrete Subject for user events
 */
class UserNotificationCenter extends NotificationCenter {
    constructor() {
        super("UserNotificationCenter");
        this.users = new Map(); // Map<userId, userData>
    }

    /**
     * Register a new user and send notification
     * @param {string} userId - The user ID
     * @param {Object} userData - User data
     */
    registerUser(userId, userData = {}) {
        this.users.set(userId, {
            ...userData,
            registeredAt: new Date(),
            lastLogin: null
        });

        this.sendNotification(
            EventTypes.USER_REGISTERED,
            {
                userId,
                username: userData.username,
                email: userData.email
            },
            EventPriority.MEDIUM
        );
    }

    /**
     * User login event
     * @param {string} userId - The user ID
     * @param {Object} loginData - Login data (location, device, etc.)
     */
    userLogin(userId, loginData = {}) {
        const user = this.users.get(userId);
        if (user) {
            user.lastLogin = new Date();
        }

        this.sendNotification(
            EventTypes.USER_LOGIN,
            {
                userId,
                location: loginData.location,
                device: loginData.device,
                ipAddress: loginData.ipAddress
            },
            EventPriority.LOW
        );
    }

    /**
     * User logout event
     * @param {string} userId - The user ID
     */
    userLogout(userId) {
        this.sendNotification(
            EventTypes.USER_LOGOUT,
            { userId },
            EventPriority.LOW
        );
    }

    /**
     * User profile updated event
     * @param {string} userId - The user ID
     * @param {Object} changes - The changes made
     */
    profileUpdated(userId, changes = {}) {
        this.sendNotification(
            EventTypes.USER_PROFILE_UPDATED,
            {
                userId,
                changes
            },
            EventPriority.LOW
        );
    }

    /**
     * Password changed event
     * @param {string} userId - The user ID
     */
    passwordChanged(userId) {
        this.sendNotification(
            EventTypes.USER_PASSWORD_CHANGED,
            { userId },
            EventPriority.HIGH
        );
    }

    /**
     * Password reset request event
     * @param {string} userId - The user ID
     * @param {string} resetCode - The reset code
     */
    passwordResetRequest(userId, resetCode) {
        this.sendNotification(
            EventTypes.PASSWORD_RESET_REQUEST,
            {
                userId,
                code: resetCode
            },
            EventPriority.HIGH
        );
    }

    /**
     * User deleted event
     * @param {string} userId - The user ID
     */
    deleteUser(userId) {
        this.users.delete(userId);

        this.sendNotification(
            EventTypes.USER_DELETED,
            { userId },
            EventPriority.MEDIUM
        );
    }

    /**
     * Get user data
     * @param {string} userId - The user ID
     * @returns {Object} User data
     */
    getUser(userId) {
        return this.users.get(userId);
    }

    /**
     * Get all users
     * @returns {Array} Array of users
     */
    getAllUsers() {
        return Array.from(this.users.entries()).map(([id, data]) => ({
            userId: id,
            ...data
        }));
    }
}

export default UserNotificationCenter;

