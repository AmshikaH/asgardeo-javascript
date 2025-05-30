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

import {describe, it, expect, vi, beforeEach} from 'vitest';
import getUserInfo from '../getUserInfo';
import DefaultOIDCEndpoints from '../../configs/DefaultOIDCEndpoints';
import AsgardeoAPIError from '../../errors/AsgardeoAPIError';

describe('getUserInfo', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch user info successfully', async () => {
    const mockUserInfo = {
      id: 'test-id',
      name: 'Test User',
      email: 'test@example.com',
      roles: ['user'],
      groups: ['group1'],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUserInfo),
    });

    const url: string = 'https://api.asgardeo.io/t/<ORGANIZATION>/oauth2/userinfo';
    const result = await getUserInfo({url});

    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    console.log('getUserInfo result:', result);

    expect(result).toEqual({
      id: 'test-id',
      name: 'Test User',
      email: 'test@example.com',
      roles: ['user'],
      groups: ['group1'],
    });
  });

  it('should handle missing optional fields', async () => {
    const mockUserInfo = {
      id: 'test-id',
      name: 'Test User',
      email: 'test@example.com',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUserInfo),
    });

    const url: string = 'https://api.asgardeo.io/t/<ORGANIZATION>/oauth2/userinfo';
    const result = await getUserInfo({url});

    expect(result).toEqual({
      id: 'test-id',
      name: 'Test User',
      email: 'test@example.com',
    });
  });

  it('should throw AsgardeoAPIError on fetch failure', async () => {
    const errorText = 'Failed to fetch';

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve(errorText),
      status: 400,
      statusText: 'Bad Request',
    });

    const url: string = 'https://api.asgardeo.io/t/<ORGANIZATION>/oauth2/userinfo';

    await expect(getUserInfo({url})).rejects.toThrow(AsgardeoAPIError);
    await expect(getUserInfo({url})).rejects.toThrow(`Failed to fetch user info: ${errorText}`);

    const error = await getUserInfo({url}).catch(e => e);
    expect(error.code).toBe('getUserInfo-ResponseError-001');
    expect(error.name).toBe('AsgardeoAPIError');
  });
});
