import { Conversation } from "@personal-ai/models";
/**
 * Format a timestamp into a human-readable relative time
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted relative time string
 */
export declare function formatRelativeTime(timestamp: number | string | Date): string;
/**
 * Format a timestamp to a standard date/time format
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date/time string
 */
export declare function formatTimestamp(timestamp: number | string | Date | undefined): string;
/**
 * Format a timestamp as a full date and time
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date/time string
 */
export declare function formatFullDateTime(timestamp: number | string | Date): string;
/**
 * Truncate a string to a certain length and add ellipsis if needed
 * @param str - The string to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
export declare function truncateString(str: string, maxLength: number): string;
/**
 * Find the most relevant timestamp for a conversation
 * @param conversation - The conversation to get timestamp from
 * @returns timestamp in milliseconds
 */
export declare function getConversationTimestamp(conversation: Conversation): number;
/**
 * Generate a title for a conversation
 * @param conversation - The conversation to generate title for
 * @returns A title string
 */
export declare function getConversationTitle(conversation: Conversation): string;
//# sourceMappingURL=formatters.d.ts.map