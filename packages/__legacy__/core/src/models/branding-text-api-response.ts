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

import {BrandingPreferenceTypes} from './branding-api-response';
import {ScreenType} from './screen-type';

/**
 * Interface for the props of the `getBrandingPreferenceText` function.
 */
export interface GetBrandingPreferenceTextProps {
  /**
   * Locale to filter the retrieval of customizations.
   */
  locale: string;
  /**
   * Tenant/Application name to filter the retrieval of customizations.
   */
  name: string;
  /**
   * Screen to filter the retrieval of customizations.
   */
  screen: ScreenType;
  /**
   * Type to filter the retrieval of customizations.
   */
  type: BrandingPreferenceTypes;
}

/**
 * Branding preference text response interface.
 */
export interface BrandingPreferenceTextAPIResponse extends GetBrandingPreferenceTextProps {
  /**
   * Branding text preference.
   */
  preference: BrandingTextPreference;
}

/**
 * Branding text preference interface.
 */
export interface BrandingTextPreference {
  text: {
    [keys: string]: string;
  };
}
