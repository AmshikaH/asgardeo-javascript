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

import {Organization} from '../models/organization';
import AsgardeoAPIError from '../errors/AsgardeoAPIError';

/**
 * Interface for organization creation payload.
 */
export interface CreateOrganizationPayload {
  /**
   * Organization description.
   */
  description: string;
  /**
   * Organization handle/slug.
   */
  orgHandle?: string;
  /**
   * Organization name.
   */
  name: string;
  /**
   * Parent organization ID.
   */
  parentId: string;
  /**
   * Organization type.
   */
  type: 'TENANT';
}

/**
 * Configuration for the createOrganization request
 */
export interface CreateOrganizationConfig extends Omit<RequestInit, 'method' | 'body'> {
  /**
   * The base URL for the API endpoint.
   */
  baseUrl: string;
  /**
   * Organization creation payload
   */
  payload: CreateOrganizationPayload;
  /**
   * Optional custom fetcher function.
   * If not provided, native fetch will be used
   */
  fetcher?: (url: string, config: RequestInit) => Promise<Response>;
}

/**
 * Creates a new organization.
 *
 * @param config - Configuration object containing baseUrl, payload and optional request config.
 * @returns A promise that resolves with the created organization information.
 * @example
 * ```typescript
 * // Using default fetch
 * try {
 *   const organization = await createOrganization({
 *     baseUrl: "https://api.asgardeo.io/t/<ORGANIZATION>",
 *     payload: {
 *       description: "Share your screens",
 *       name: "Team Viewer",
 *       orgHandle: "team-viewer",
 *       parentId: "f4825104-4948-40d9-ab65-a960eee3e3d5",
 *       type: "TENANT"
 *     }
 *   });
 *   console.log(organization);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to create organization:', error.message);
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using custom fetcher (e.g., axios-based httpClient)
 * try {
 *   const organization = await createOrganization({
 *     baseUrl: "https://api.asgardeo.io/t/<ORGANIZATION>",
 *     payload: {
 *       description: "Share your screens",
 *       name: "Team Viewer",
 *       orgHandle: "team-viewer",
 *       parentId: "f4825104-4948-40d9-ab65-a960eee3e3d5",
 *       type: "TENANT"
 *     },
 *     fetcher: async (url, config) => {
 *       const response = await httpClient({
 *         url,
 *         method: config.method,
 *         headers: config.headers,
 *         data: config.body,
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
 *   console.log(organization);
 * } catch (error) {
 *   if (error instanceof AsgardeoAPIError) {
 *     console.error('Failed to create organization:', error.message);
 *   }
 * }
 * ```
 */
const createOrganization = async ({
  baseUrl,
  payload,
  fetcher,
  ...requestConfig
}: CreateOrganizationConfig): Promise<Organization> => {
  try {
    new URL(baseUrl);
  } catch (error) {
    throw new AsgardeoAPIError(
      `Invalid base URL provided. ${error?.toString()}`,
      'createOrganization-ValidationError-001',
      'javascript',
      400,
      'The provided `baseUrl` does not adhere to the URL schema.',
    );
  }

  if (!payload) {
    throw new AsgardeoAPIError(
      'Organization payload is required',
      'createOrganization-ValidationError-002',
      'javascript',
      400,
      'Invalid Request',
    );
  }

  // Always set type to TENANT for now
  const organizationPayload = {
    ...payload,
    type: 'TENANT' as const,
  };

  const fetchFn = fetcher || fetch;
  const resolvedUrl = `${baseUrl}/api/server/v1/organizations`;

  const requestInit: RequestInit = {
    ...requestConfig,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...requestConfig.headers,
    },
    body: JSON.stringify(organizationPayload),
  };

  try {
    const response: Response = await fetchFn(resolvedUrl, requestInit);

    if (!response?.ok) {
      const errorText = await response.text();

      throw new AsgardeoAPIError(
        `Failed to create organization: ${errorText}`,
        'createOrganization-ResponseError-001',
        'javascript',
        response.status,
        response.statusText,
      );
    }

    return (await response.json()) as Organization;
  } catch (error) {
    console.log('[JS][createOrganization] Error creating organization:', error);
    if (error instanceof AsgardeoAPIError) {
      throw error;
    }

    throw new AsgardeoAPIError(
      `Network or parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'createOrganization-NetworkError-001',
      'javascript',
      0,
      'Network Error',
    );
  }
};

export default createOrganization;
