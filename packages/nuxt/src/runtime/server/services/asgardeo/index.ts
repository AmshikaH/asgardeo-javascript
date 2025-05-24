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

import {AsgardeoNodeClient, type AuthClientConfig} from '@asgardeo/auth-node';

let authClientInstance: AsgardeoNodeClient<any> | null = null;

/**
 * Returns a singleton AsgardeoNodeClient instance.
 * Must be called with configuration on first call.
 */
export function getAsgardeoSdkInstance(config: AuthClientConfig): AsgardeoNodeClient<any> {
  if (authClientInstance) {
    return authClientInstance;
  }

  if (!config) {
    throw new Error(
      '[Asgardeo] No configuration provided. You must call getAsgardeoSdkInstance(config) with a valid AuthClientConfig on the first use.',
    );
  }

  try {
    authClientInstance = new AsgardeoNodeClient(config);
  } catch (error) {
    throw new Error('[Asgardeo] SDK initialization failed. Check provided configuration and SDK compatibility.');
  }

  return authClientInstance;
}
