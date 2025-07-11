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

import {cookies} from 'next/headers';
import AsgardeoNextClient from '../../AsgardeoNextClient';
import SessionManager from '../../utils/SessionManager';
import getSessionId from './getSessionId';
import logger from '../../utils/logger';

/**
 * Server action for signing out a user.
 * Clears both JWT and legacy session cookies.
 *
 * @returns Promise that resolves with success status and optional after sign-out URL
 */
const signOutAction = async (): Promise<{success: boolean; data?: {afterSignOutUrl?: string}; error?: unknown}> => {
  logger.debug('[signOutAction] Initiating sign out process from the server action.');

  const clearSessionCookies = async () => {
    const cookieStore = await cookies();

    cookieStore.delete(SessionManager.getSessionCookieName());
    cookieStore.delete(SessionManager.getTempSessionCookieName());
  };

  try {
    const client = AsgardeoNextClient.getInstance();
    const sessionId = await getSessionId();

    let afterSignOutUrl: string = '/';

    if (sessionId) {
      logger.debug('[signOutAction] Session ID found, invoking the `signOut` to obtain the `afterSignOutUrl`.');

      afterSignOutUrl = await client.signOut({}, sessionId);
    }

    await clearSessionCookies();

    return {success: true, data: {afterSignOutUrl}};
  } catch (error) {
    logger.error('[signOutAction] Error during sign out from the server action:', error);

    logger.debug('[signOutAction] Clearing session cookies due to error as a fallback.');

    await clearSessionCookies();

    return {
      success: false,
      error: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
    };
  }
};

export default signOutAction;
