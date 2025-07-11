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

import {ReadonlyRequestCookies} from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import {cookies} from 'next/headers';
import SessionManager, {SessionTokenPayload} from '../../utils/SessionManager';

/**
 * Get the session payload from JWT session cookie.
 * This includes user ID, session ID, scopes, and organization ID.
 *
 * @returns The session payload if valid JWT session exists, undefined otherwise
 */
const getSessionPayload = async (): Promise<SessionTokenPayload | undefined> => {
  const cookieStore: ReadonlyRequestCookies = await cookies();

  const sessionToken = cookieStore.get(SessionManager.getSessionCookieName())?.value;
  if (!sessionToken) {
    return undefined;
  }

  try {
    return await SessionManager.verifySessionToken(sessionToken);
  } catch {
    return undefined;
  }
};

export default getSessionPayload;
