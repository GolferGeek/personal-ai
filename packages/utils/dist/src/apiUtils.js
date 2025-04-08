/**
 * Helper to store and retrieve user ID
 * @returns The current user ID or creates a new one
 */
export const getUserId = () => {
    // Check localStorage for existing user ID
    if (typeof window === 'undefined') {
        return '';
    }
    let userId = localStorage.getItem('userId');
    // If no userId in storage, create one when we're in the browser
    if (!userId) {
        userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('userId', userId);
    }
    return userId;
};
/**
 * Helper function to handle API responses
 * @param response - The Response object from fetch
 * @returns JSON parsed response
 * @throws Error if the response is not OK
 */
export const handleResponse = async (response) => {
    if (!response.ok) {
        try {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        catch (e) {
            throw new Error(`API error: ${response.status}`);
        }
    }
    return response.json();
};
/**
 * Get forwarded headers for API requests
 * @param headers - Original request headers
 * @returns Headers to forward to the backend
 */
export const getForwardedHeaders = (headers) => {
    const forwardedHeaders = {};
    // Forward authentication related headers
    if (headers.has('authorization')) {
        forwardedHeaders.authorization = headers.get('authorization');
    }
    // Forward cookies
    if (headers.has('cookie')) {
        forwardedHeaders.cookie = headers.get('cookie');
    }
    // Forward user ID
    if (headers.has('x-user-id')) {
        forwardedHeaders['x-user-id'] = headers.get('x-user-id');
    }
    // Forward content type
    if (headers.has('content-type')) {
        forwardedHeaders['content-type'] = headers.get('content-type');
    }
    return forwardedHeaders;
};
/**
 * Create URL with query parameters
 * @param baseUrl - Base URL
 * @param params - Query parameters
 * @returns URL with query parameters
 */
export const createUrlWithParams = (baseUrl, params) => {
    if (!params)
        return baseUrl;
    const url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
        }
    });
    return url.toString();
};
//# sourceMappingURL=apiUtils.js.map