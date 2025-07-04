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

import {AllOrganizationsApiResponse, AsgardeoAPIError, Organization} from '@asgardeo/node';
import AsgardeoNextClient from '../../AsgardeoNextClient';

/**
 * Server action to get organizations.
 */
const getAllOrganizations = async (options?: any, sessionId?: string | undefined): Promise<AllOrganizationsApiResponse> => {
  try {
    const client = AsgardeoNextClient.getInstance();
    return client.getAllOrganizations(options, sessionId);
  } catch (error) {
    throw new AsgardeoAPIError(
      `Failed to get all the organizations for the user: ${error instanceof Error ? error.message : String(error)}`,
      'getAllOrganizations-ServerActionError-001',
      'nextjs',
      error instanceof AsgardeoAPIError ? error.statusCode : undefined,
    );
  }
};

export default getAllOrganizations;
