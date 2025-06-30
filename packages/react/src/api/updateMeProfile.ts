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

import {
  User,
  HttpInstance,
  AsgardeoSPAClient,
  HttpRequestConfig,
  updateMeProfile as baseUpdateMeProfile,
  UpdateMeProfileConfig as BaseUpdateMeProfileConfig,
} from '@asgardeo/browser';

const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Configuration for the updateMeProfile request (React-specific)
 */
export interface UpdateMeProfileConfig extends Omit<BaseUpdateMeProfileConfig, 'fetcher'> {
  /**
   * Optional custom fetcher function. If not provided, the Asgardeo SPA client's httpClient will be used
   * which is a wrapper around axios http.request
   */
  fetcher?: (url: string, config: RequestInit) => Promise<Response>;
}

/**
 * Updates the user profile information at the specified SCIM2 Me endpoint.
 * This function uses the Asgardeo SPA client's httpClient by default, but allows for custom fetchers.
 *
 * @param config - Configuration object with URL, payload and optional request config.
 * @returns A promise that resolves with the updated user profile information.
 * @example
 * ```typescript
 * // Using default Asgardeo SPA client httpClient
 * await updateMeProfile({
 *   url: "https://api.asgardeo.io/t/<ORG>/scim2/Me",
 *   payload: { "urn:scim:wso2:schema": { mobileNumbers: ["0777933830"] } }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Using custom fetcher
 * await updateMeProfile({
 *   url: "https://api.asgardeo.io/t/<ORG>/scim2/Me",
 *   payload: { "urn:scim:wso2:schema": { mobileNumbers: ["0777933830"] } },
 *   fetcher: customFetchFunction
 * });
 * ```
 */
const updateMeProfile = async ({fetcher, ...requestConfig}: UpdateMeProfileConfig): Promise<User> => {
  const defaultFetcher = async (url: string, config: RequestInit): Promise<Response> => {
    const response = await httpClient({
      url,
      method: config.method || 'PATCH',
      headers: config.headers as Record<string, string>,
      data: config.body ? JSON.parse(config.body as string) : undefined,
    } as HttpRequestConfig);

    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText || '',
      json: () => Promise.resolve(response.data),
      text: () => Promise.resolve(typeof response.data === 'string' ? response.data : JSON.stringify(response.data)),
    } as Response;
  };

  return baseUpdateMeProfile({
    ...requestConfig,
    fetcher: fetcher || defaultFetcher,
  });
};

export default updateMeProfile;
