/**
 * API configuration for external services
 */

export const API_CONFIG = {
  // Base URLs for different APIs
  baseUrls: {
    // Add external API base URLs as needed
    // example: 'https://api.example.com/v1',
  },

  // API keys (should be in environment variables)
  keys: {
    // Add API keys as needed
    // example: import.meta.env.VITE_EXAMPLE_API_KEY,
  },

  // Default headers
  defaultHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  // Timeout in milliseconds
  timeout: 10000,
};

/**
 * Generic fetch wrapper with error handling
 */
export async function apiRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }

    throw error;
  }
}

/**
 * Build URL with query parameters
 */
export function buildUrl(baseUrl, path, params = {}) {
  const url = new URL(path, baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
}
