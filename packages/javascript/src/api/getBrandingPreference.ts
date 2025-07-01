/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {BrandingPreference} from '../models/branding-preference';
import AsgardeoAPIError from '../errors/AsgardeoAPIError';

/**
 * Configuration for the getBrandingPreference request
 */
export interface GetBrandingPreferenceConfig extends Omit<RequestInit, 'method'> {
  /**
   * The base URL for the API endpoint.
   */
  baseUrl: string;
  /**
   * Locale for the branding preference
   */
  locale?: string;
  /**
   * Name of the branding preference
   */
  name?: string;
  /**
   * Type of the branding preference
   */
  type?: string;
  /**
   * Optional custom fetcher function.
   * If not provided, native fetch will be used
   */
  fetcher?: (url: string, config: RequestInit) => Promise<Response>;
}

/**
 * Retrieves branding preference configuration.
 *
 * @param config - Configuration object containing baseUrl, optional query parameters, and request config.
 * @returns A promise that resolves with the branding preference information.
 * @example
 * ```typescript
 * // Using default fetch
 * try {
 *   const response = await getBrandingPreference({
 *     baseUrl: "https://api.asgardeo.io/t/<ORGANIZATION>",
 *     locale: "en-US",
 *     name: "my-branding",
 *     type: "org"
 *   });
 *   console.log(response.theme);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to get branding preference:', error.message);
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using custom fetcher (e.g., axios-based httpClient)
 * try {
 *   const response = await getBrandingPreference({
 *     baseUrl: "https://api.asgardeo.io/t/<ORGANIZATION>",
 *     locale: "en-US",
 *     name: "my-branding",
 *     type: "org",
 *     fetcher: async (url, config) => {
 *       const response = await httpClient({
 *         url,
 *         method: config.method,
 *         headers: config.headers,
 *         ...config
 *       });
 *       // Convert axios-like response to fetch-like Response
 *       return {
 *         ok: response.status >= 200 && response.status < 300,
 *         status: response.status,
 *         statusText: response.statusText,
 *         json: () => Promise.resolve(response.data),
 *         text: () => Promise.resolve(typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
 *       } as Response;
 *     }
 *   });
 *   console.log(response.theme);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to get branding preference:', error.message);
 *   }
 * }
 * ```
 */
const getBrandingPreference = async ({
  baseUrl,
  locale,
  name,
  type,
  fetcher,
  ...requestConfig
}: GetBrandingPreferenceConfig): Promise<BrandingPreference> => {
  try {
    new URL(baseUrl);
  } catch (error) {
    throw new AsgardeoAPIError(
      `Invalid base URL provided. ${error?.toString()}`,
      'getBrandingPreference-ValidationError-001',
      'javascript',
      400,
      'The provided `baseUrl` does not adhere to the URL schema.',
    );
  }

  const queryParams: URLSearchParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries({
        locale: locale || '',
        name: name || '',
        type: type || '',
      }).filter(([, value]: [string, string]) => Boolean(value)),
    ),
  );

  const fetchFn = fetcher || fetch;
  const resolvedUrl = `${baseUrl}/api/server/v1/branding-preference${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;

  const requestInit: RequestInit = {
    ...requestConfig,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...requestConfig.headers,
    },
  };

  try {
    const response: Response = await fetchFn(resolvedUrl, requestInit);

    if (!response?.ok) {
      const errorText = await response.text();

      throw new AsgardeoAPIError(
        `Failed to get branding preference: ${errorText}`,
        'getBrandingPreference-ResponseError-001',
        'javascript',
        response.status,
        response.statusText,
      );
    }

    const data = (await response.json()) as BrandingPreference;
    return data;
  } catch (error) {
    if (error instanceof AsgardeoAPIError) {
      throw error;
    }

    throw new AsgardeoAPIError(
      `Network or parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'getBrandingPreference-NetworkError-001',
      'javascript',
      0,
      'Network Error',
    );
  }
};

export default getBrandingPreference;
