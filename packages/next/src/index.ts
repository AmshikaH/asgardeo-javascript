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

export {default as asgardeoMiddleware} from './server/asgardeoMiddleware';

export {default as AsgardeoProvider} from './client/providers/AsgardeoProvider';
export * from './client/providers/AsgardeoProvider';

export {default as SignInButton} from './client/components/SignInButton';
export type {SignInButtonProps} from './client/components/SignInButton';

export {default as AsgardeoContext} from './client/contexts/AsgardeoContext';
export type {AsgardeoContextProps} from './client/contexts/AsgardeoContext';

export {default as AsgardeoNextClient} from './AsgardeoNextClient';
