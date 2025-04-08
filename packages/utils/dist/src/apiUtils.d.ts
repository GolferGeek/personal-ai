/**
 * Helper to store and retrieve user ID
 * @returns The current user ID or creates a new one
 */
export declare const getUserId: () => string;
/**
 * Helper function to handle API responses
 * @param response - The Response object from fetch
 * @returns JSON parsed response
 * @throws Error if the response is not OK
 */
export declare const handleResponse: <T>(response: Response) => Promise<T>;
/**
 * Get forwarded headers for API requests
 * @param headers - Original request headers
 * @returns Headers to forward to the backend
 */
export declare const getForwardedHeaders: (headers: Headers) => Record<string, string>;
/**
 * Create URL with query parameters
 * @param baseUrl - Base URL
 * @param params - Query parameters
 * @returns URL with query parameters
 */
export declare const createUrlWithParams: (baseUrl: string, params?: Record<string, string | number | boolean>) => string;
//# sourceMappingURL=apiUtils.d.ts.map