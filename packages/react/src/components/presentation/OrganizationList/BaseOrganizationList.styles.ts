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

/**
 * Creates styles for the BaseOrganizationList component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string) => {
  return useMemo(() => {
    const root = css`
      padding: calc(${theme.vars.spacing.unit} * 4);
      min-width: 600px;
      margin: 0 auto;
      background: ${theme.vars.colors.background.surface};
      border-radius: ${theme.vars.borderRadius.large};
    `;

    const header = css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: calc(${theme.vars.spacing.unit} * 3);
      padding-bottom: calc(${theme.vars.spacing.unit} * 2);
      border-bottom: 1px solid ${theme.vars.colors.border};
    `;

    const headerInfo = css`
      flex: 1;
    `;

    const title = css`
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: ${theme.vars.colors.text.primary};
    `;

    const subtitle = css`
      color: ${theme.vars.colors.text.secondary};
      font-size: 0.875rem;
      margin: 0;
    `;

    const refreshButton = css`
      background-color: ${theme.vars.colors.background.surface};
      border: 1px solid ${theme.vars.colors.border};
      border-radius: ${theme.vars.borderRadius.small};
      color: ${theme.vars.colors.text.primary};
      cursor: pointer;
      font-size: 0.875rem;
      padding: ${theme.vars.spacing.unit} calc(${theme.vars.spacing.unit} * 2);
      transition: all 0.2s;
      &:hover {
        background-color: ${theme.vars.colors.background.surface};
        border-color: ${theme.vars.colors.primary.main};
      }
    `;

    const listContainer = css`
      display: flex;
      flex-direction: column;
      gap: calc(${theme.vars.spacing.unit} * 1.5);
    `;

    const organizationItem = css`
      border: 1px solid ${theme.vars.colors.border};
      border-radius: ${theme.vars.borderRadius.medium};
      display: flex;
      justify-content: space-between;
      padding: calc(${theme.vars.spacing.unit} * 2);
      transition: all 0.2s;
      background-color: ${theme.vars.colors.background.surface};
      &:hover {
        border-color: ${theme.vars.colors.primary.main};
        box-shadow: 0 2px 8px ${theme.vars.colors.primary.main}20;
      }
    `;

    const organizationContent = css`
      display: flex;
      align-items: center;
      gap: calc(${theme.vars.spacing.unit} * 2);
      flex: 1;
    `;

    const organizationInfo = css`
      flex: 1;
    `;

    const organizationName = css`
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: ${theme.vars.colors.text.primary};
    `;

    const organizationHandle = css`
      color: ${theme.vars.colors.text.secondary};
      font-size: 0.875rem;
      margin: 0 0 4px 0;
      font-family: monospace;
    `;

    const organizationStatus = css`
      color: ${theme.vars.colors.text.secondary};
      font-size: 0.875rem;
      margin: 0;
    `;

    const statusText = css`
      font-weight: 500;
    `;

    const statusTextActive = css`
      color: ${theme.vars.colors.success.main};
    `;

    const statusTextInactive = css`
      color: ${theme.vars.colors.error.main};
    `;

    const organizationActions = css`
      display: flex;
      align-items: center;
    `;

    const badge = css`
      border-radius: ${theme.vars.borderRadius.large};
      font-size: 0.75rem;
      font-weight: 500;
      padding: calc(${theme.vars.spacing.unit} / 2) calc(${theme.vars.spacing.unit} * 1.5);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;

    const badgeSuccess = css`
      background-color: color-mix(in srgb, ${theme.vars.colors.success.main} 20%, transparent);
      color: ${theme.vars.colors.success.main};
    `;

    const badgeError = css`
      background-color: color-mix(in srgb, ${theme.vars.colors.error.main} 20%, transparent);
      color: ${theme.vars.colors.error.main};
    `;

    const loadingContainer = css`
      padding: calc(${theme.vars.spacing.unit} * 4);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: calc(${theme.vars.spacing.unit} * 2);
    `;

    const loadingText = css`
      margin-top: ${theme.vars.spacing.unit};
    `;

    const errorContainer = css`
      background-color: color-mix(in srgb, ${theme.vars.colors.error.main} 20%, transparent);
      border: 1px solid ${theme.vars.colors.error.main};
      border-radius: ${theme.vars.borderRadius.medium};
      color: ${theme.vars.colors.error.main};
      padding: calc(${theme.vars.spacing.unit} * 2);
    `;

    const emptyContainer = css`
      padding: calc(${theme.vars.spacing.unit} * 4);
      text-align: center;
    `;

    const emptyText = css`
      color: ${theme.vars.colors.text.secondary};
      font-size: 1rem;
    `;

    const loadMoreButton = css`
      background-color: ${theme.vars.colors.primary.main};
      border: none;
      border-radius: ${theme.vars.borderRadius.medium};
      color: ${theme.vars.colors.primary.contrastText};
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      padding: calc(${theme.vars.spacing.unit} * 1.5) calc(${theme.vars.spacing.unit} * 3);
      width: 100%;
      transition: all 0.2s;
      &:hover:not(:disabled) {
        background-color: ${theme.vars.colors.primary.main};
        opacity: 0.9;
      }
      &:disabled {
        background-color: ${theme.vars.colors.text.secondary};
        cursor: not-allowed;
        opacity: 0.6;
      }
    `;

    const errorMargin = css`
      margin-top: calc(${theme.vars.spacing.unit} * 2);
    `;

    const loadMoreMargin = css`
      margin-top: calc(${theme.vars.spacing.unit} * 3);
    `;

    const popupContent = css`
      padding: ${theme.vars.spacing.unit};
    `;

    return {
      root,
      header,
      headerInfo,
      title,
      subtitle,
      refreshButton,
      listContainer,
      organizationItem,
      organizationContent,
      organizationInfo,
      organizationName,
      organizationHandle,
      organizationStatus,
      statusText,
      statusTextActive,
      statusTextInactive,
      organizationActions,
      badge,
      badgeSuccess,
      badgeError,
      loadingContainer,
      loadingText,
      errorContainer,
      emptyContainer,
      emptyText,
      loadMoreButton,
      errorMargin,
      loadMoreMargin,
      popupContent,
    };
  }, [
    theme.vars.spacing.unit,
    theme.vars.colors.background.surface,
    theme.vars.colors.border,
    theme.vars.borderRadius.large,
    theme.vars.borderRadius.medium,
    theme.vars.borderRadius.small,
    theme.vars.colors.text.primary,
    theme.vars.colors.text.secondary,
    theme.vars.colors.primary.main,
    theme.vars.colors.success.main,
    theme.vars.colors.error.main,
    theme.vars.colors.primary.contrastText,
    colorScheme,
  ]);
};

export default useStyles;
