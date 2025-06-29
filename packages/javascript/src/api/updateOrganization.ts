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

import AsgardeoAPIError from '../errors/AsgardeoAPIError';
import isEmpty from '../utils/isEmpty';
import {OrganizationDetails} from './getOrganization';

/**
 * Configuration for the updateOrganization request
 */
export interface UpdateOrganizationConfig extends Omit<RequestInit, 'method' | 'body'> {
  /**
   * The base URL for the API endpoint.
   */
  baseUrl: string;
  /**
   * The ID of the organization to update
   */
  organizationId: string;
  /**
   * Array of patch operations to apply
   */
  operations: Array<{
    operation: 'REPLACE' | 'ADD' | 'REMOVE';
    path: string;
    value?: any;
  }>;
  /**
   * Optional custom fetcher function.
   * If not provided, native fetch will be used
   */
  fetcher?: (url: string, config: RequestInit) => Promise<Response>;
}

/**
 * Updates the organization information using the Organizations Management API.
 *
 * @param config - Configuration object with baseUrl, organizationId, operations and optional request config.
 * @returns A promise that resolves with the updated organization information.
 * @example
 * ```typescript
 * // Using the helper function to create operations automatically
 * const operations = createPatchOperations({
 *   name: "Updated Organization Name",      // Will use REPLACE
 *   description: "",                        // Will use REMOVE (empty string)
 *   customField: "Some value"              // Will use REPLACE
 * });
 *
 * await updateOrganization({
 *   baseUrl: "https://api.asgardeo.io/t/<ORG>",
 *   organizationId: "0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1",
 *   operations
 * });
 *
 * // Or manually specify operations
 * await updateOrganization({
 *   baseUrl: "https://api.asgardeo.io/t/<ORG>",
 *   organizationId: "0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1",
 *   operations: [
 *     { operation: "REPLACE", path: "/name", value: "Updated Organization Name" },
 *     { operation: "REMOVE", path: "/description" }
 *   ]
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Using custom fetcher (e.g., axios-based httpClient)
 * await updateOrganization({
 *   baseUrl: "https://api.asgardeo.io/t/<ORG>",
 *   organizationId: "0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1",
 *   operations: [
 *     { operation: "REPLACE", path: "/name", value: "Updated Organization Name" }
 *   ],
 *   fetcher: async (url, config) => {
 *     const response = await httpClient({
 *       url,
 *       method: config.method,
 *       headers: config.headers,
 *       data: config.body,
 *       ...config
 *     });
 *     // Convert axios-like response to fetch-like Response
 *     return {
 *       ok: response.status >= 200 && response.status < 300,
 *       status: response.status,
 *       statusText: response.statusText,
 *       json: () => Promise.resolve(response.data),
 *       text: () => Promise.resolve(typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
 *     } as Response;
 *   }
 * });
 * ```
 */
const updateOrganization = async ({
  baseUrl,
  organizationId,
  operations,
  fetcher,
  ...requestConfig
}: UpdateOrganizationConfig): Promise<OrganizationDetails> => {
  try {
    new URL(baseUrl);
  } catch (error) {
    throw new AsgardeoAPIError(
      `Invalid base URL provided. ${error?.toString()}`,
      'updateOrganization-ValidationError-001',
      'javascript',
      400,
      'The provided `baseUrl` does not adhere to the URL schema.',
    );
  }

  if (!organizationId) {
    throw new AsgardeoAPIError(
      'Organization ID is required',
      'updateOrganization-ValidationError-002',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  if (!operations || !Array.isArray(operations) || operations.length === 0) {
    throw new AsgardeoAPIError(
      'Operations array is required and cannot be empty',
      'updateOrganization-ValidationError-003',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  const fetchFn = fetcher || fetch;
  const resolvedUrl = `${baseUrl}/api/server/v1/organizations/${organizationId}`;

  const requestInit: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...requestConfig.headers,
    },
    body: JSON.stringify(operations),
    ...requestConfig,
  };

  try {
    const response: Response = await fetchFn(resolvedUrl, requestInit);

    if (!response?.ok) {
      const errorText = await response.text();

      throw new AsgardeoAPIError(
        `Failed to update organization: ${errorText}`,
        'updateOrganization-ResponseError-001',
        'javascript',
        response.status,
        response.statusText,
      );
    }

    return (await response.json()) as OrganizationDetails;
  } catch (error) {
    if (error instanceof AsgardeoAPIError) {
      throw error;
    }

    throw new AsgardeoAPIError(
      `Network or parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'updateOrganization-NetworkError-001',
      'javascript',
      0,
      'Network Error',
    );
  }
};

/**
 * Helper function to convert field updates to patch operations format.
 * Uses REMOVE operation when the value is empty, otherwise uses REPLACE.
 *
 * @param payload - Object containing field updates
 * @returns Array of patch operations
 */
export const createPatchOperations = (
  payload: Record<string, any>,
): Array<{
  operation: 'REPLACE' | 'REMOVE';
  path: string;
  value?: any;
}> => {
  return Object.entries(payload).map(([key, value]) => {
    if (isEmpty(value)) {
      return {
        operation: 'REMOVE' as const,
        path: `/${key}`,
      };
    }

    return {
      operation: 'REPLACE' as const,
      path: `/${key}`,
      value,
    };
  });
};

export default updateOrganization;
