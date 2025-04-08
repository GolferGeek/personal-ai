/**
 * Check if a string is empty or only whitespace
 * @param value - String to check
 * @returns Boolean indicating if the string is empty
 */
export function isEmpty(value) {
    return value === undefined || value === null || value.trim() === '';
}
/**
 * Validate that a message has required fields
 * @param message - Message to validate
 * @returns Boolean indicating if the message is valid
 */
export function isValidMessage(message) {
    return (!!message &&
        !!message.role &&
        (message.role === 'user' || message.role === 'assistant' || message.role === 'system') &&
        !isEmpty(message.content));
}
/**
 * Check if a value is a valid number
 * @param value - Value to check
 * @returns Boolean indicating if the value is a valid number
 */
export function isValidNumber(value) {
    if (typeof value === 'number')
        return !isNaN(value);
    if (typeof value === 'string')
        return !isNaN(Number(value));
    return false;
}
/**
 * Check if a string is a valid URL
 * @param url - URL string to validate
 * @returns Boolean indicating if the URL is valid
 */
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch (e) {
        return false;
    }
}
//# sourceMappingURL=validators.js.map