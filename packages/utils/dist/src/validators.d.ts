import { Message } from '@personal-ai/models';
/**
 * Check if a string is empty or only whitespace
 * @param value - String to check
 * @returns Boolean indicating if the string is empty
 */
export declare function isEmpty(value?: string): boolean;
/**
 * Validate that a message has required fields
 * @param message - Message to validate
 * @returns Boolean indicating if the message is valid
 */
export declare function isValidMessage(message: Partial<Message>): boolean;
/**
 * Check if a value is a valid number
 * @param value - Value to check
 * @returns Boolean indicating if the value is a valid number
 */
export declare function isValidNumber(value: unknown): boolean;
/**
 * Check if a string is a valid URL
 * @param url - URL string to validate
 * @returns Boolean indicating if the URL is valid
 */
export declare function isValidUrl(url: string): boolean;
//# sourceMappingURL=validators.d.ts.map