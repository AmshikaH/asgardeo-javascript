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

'use server';

import {AsgardeoAPIError, Organization} from '@asgardeo/node';
import AsgardeoNextClient from '../../AsgardeoNextClient';

/**
 * Server action to get organizations.
 */
const getMyOrganizations = async (options?: any, sessionId?: string | undefined): Promise<Organization[]> => {
  try {
    const client = AsgardeoNextClient.getInstance();

    // Get session ID if not provided
    let resolvedSessionId = sessionId;
    if (!resolvedSessionId) {
      // Import getSessionId locally to avoid circular dependencies
      const {default: getSessionId} = await import('./getSessionId');
      resolvedSessionId = await getSessionId();
    }

    if (!resolvedSessionId) {
      throw new AsgardeoAPIError(
        'No session ID available for fetching organizations',
        'getMyOrganizations-SessionError-001',
        'nextjs',
        401,
      );
    }

    // Check if user is signed in by trying to get access token
    try {
      const accessToken = await client.getAccessToken(resolvedSessionId);

      if (!accessToken) {
        throw new AsgardeoAPIError(
          'No access token available - user is not signed in',
          'getMyOrganizations-NoAccessToken-001',
          'nextjs',
          401,
        );
      }
    } catch (error) {
      console.error('[getMyOrganizations] Failed to get access token:', error);
      throw new AsgardeoAPIError(
        'User is not signed in - access token retrieval failed',
        'getMyOrganizations-NotSignedIn-001',
        'nextjs',
        401,
      );
    }

    return await client.getMyOrganizations(options, resolvedSessionId);
  } catch (error) {
    throw new AsgardeoAPIError(
      `Failed to get the organizations for the user: ${error instanceof Error ? error.message : String(error)}`,
      'getMyOrganizations-ServerActionError-001',
      'nextjs',
      error instanceof AsgardeoAPIError ? error.statusCode : undefined,
    );
  }
};

export default getMyOrganizations;
