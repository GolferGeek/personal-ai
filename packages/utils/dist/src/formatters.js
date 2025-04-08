/**
 * Format a timestamp into a human-readable relative time
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp) {
    // Convert to timestamp if needed
    let timeMs;
    try {
        if (typeof timestamp === "string") {
            timeMs = new Date(timestamp).getTime();
        }
        else if (timestamp instanceof Date) {
            timeMs = timestamp.getTime();
        }
        else {
            timeMs = timestamp;
        }
        // Handle invalid dates
        if (isNaN(timeMs)) {
            return "Recently";
        }
        const now = Date.now();
        const diff = now - timeMs;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return days === 1 ? "Yesterday" : `${days}d ago`;
        }
        else if (hours > 0) {
            return `${hours}h ago`;
        }
        else if (minutes > 0) {
            return `${minutes}m ago`;
        }
        else {
            return "Just now";
        }
    }
    catch {
        // Handle any unexpected errors in date formatting
        return "Recently";
    }
}
/**
 * Format a timestamp to a standard date/time format
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date/time string
 */
export function formatTimestamp(timestamp) {
    if (!timestamp)
        return "";
    try {
        // Convert to date if it's a number or string
        const date = typeof timestamp === "number" || typeof timestamp === "string"
            ? new Date(timestamp)
            : timestamp;
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return ""; // Return empty string for invalid dates
        }
        // Format the time
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    catch (error) {
        console.error("Error formatting timestamp:", error);
        return "";
    }
}
/**
 * Format a timestamp as a full date and time
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date/time string
 */
export function formatFullDateTime(timestamp) {
    if (!timestamp)
        return "";
    try {
        const date = typeof timestamp === "number" || typeof timestamp === "string"
            ? new Date(timestamp)
            : timestamp;
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    catch {
        return "";
    }
}
/**
 * Truncate a string to a certain length and add ellipsis if needed
 * @param str - The string to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
export function truncateString(str, maxLength) {
    if (!str || str.length <= maxLength)
        return str;
    return `${str.slice(0, maxLength)}...`;
}
/**
 * Find the most relevant timestamp for a conversation
 * @param conversation - The conversation to get timestamp from
 * @returns timestamp in milliseconds
 */
export function getConversationTimestamp(conversation) {
    try {
        // Try different properties in order of preference
        if (conversation?.lastUpdated) {
            if (typeof conversation.lastUpdated === "number") {
                return conversation.lastUpdated;
            }
            else if (typeof conversation.lastUpdated === "string") {
                return new Date(conversation.lastUpdated).getTime();
            }
        }
        // If we have messages, use the latest message timestamp
        if (conversation?.messages && conversation.messages.length > 0) {
            const timestamps = conversation.messages
                .filter((msg) => msg.timestamp)
                .map((msg) => (typeof msg.timestamp === "number" ? msg.timestamp : 0));
            if (timestamps.length > 0) {
                return Math.max(...timestamps);
            }
        }
        // Fall back to now
        return Date.now();
    }
    catch {
        // Handle any unexpected errors
        return Date.now();
    }
}
/**
 * Generate a title for a conversation
 * @param conversation - The conversation to generate title for
 * @returns A title string
 */
export function getConversationTitle(conversation) {
    try {
        // If we have a title, use it
        if (conversation?.title) {
            return conversation.title;
        }
        // Try to find first user message to use as title
        if (conversation?.messages && conversation.messages.length > 0) {
            const firstUserMessage = conversation.messages.find((m) => m.role === "user");
            if (firstUserMessage?.content) {
                const content = firstUserMessage.content.trim();
                // Truncate if too long
                return content.length > 30 ? `${content.substring(0, 30)}...` : content;
            }
        }
        // Default fallback
        return "New Conversation";
    }
    catch {
        // Handle any unexpected errors
        return "New Conversation";
    }
}
//# sourceMappingURL=formatters.js.map