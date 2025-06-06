/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import {AsgardeoUIException} from '@asgardeo/js';
import {useContext, useEffect} from 'react';
import AsgardeoContext from '../contexts/asgardeo-context';
import AuthContext from '../models/auth-context';
import {Hooks, UseOnProps} from '../models/use-on';

const useOn = (props: UseOnProps): void => {
  const {callback, event} = props;

  const contextValue: AuthContext = useContext(AsgardeoContext);

  useEffect(() => {
    switch (event) {
      case Hooks.SignIn:
        contextValue.setOnSignIn(callback);
        break;
      case Hooks.SignOut:
        contextValue.setOnSignOut(callback);
        break;
      default:
        throw new AsgardeoUIException('REACT-USE_ON-UO-IV-01', 'Invalid event type provided.');
    }
  }, [callback, contextValue, event]);
};

export default useOn;
