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

import {css} from '@emotion/css';
import {useMemo} from 'react';
import {Theme} from '@asgardeo/browser';

export type LogoSize = 'small' | 'medium' | 'large';

/**
 * Creates styles for the Logo component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param size - The size of the logo
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string, size: LogoSize) => {
  return useMemo(() => {
    const baseLogo = css`
      width: auto;
      object-fit: contain;
      display: block;
    `;

    const smallLogo = css`
      height: 32px;
      max-width: 120px;
    `;

    const mediumLogo = css`
      height: 48px;
      max-width: 180px;
    `;

    const largeLogo = css`
      height: 64px;
      max-width: 240px;
    `;

    const sizeStyles = {
      small: smallLogo,
      medium: mediumLogo,
      large: largeLogo,
    };

    return {
      logo: baseLogo,
      size: sizeStyles[size],
      small: smallLogo,
      medium: mediumLogo,
      large: largeLogo,
    };
  }, [theme, colorScheme, size]);
};

export default useStyles;
