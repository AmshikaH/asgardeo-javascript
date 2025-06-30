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

import {FC, ReactElement, useEffect, useState} from 'react';
import BaseOrganizationProfile, {BaseOrganizationProfileProps} from './BaseOrganizationProfile';
import {OrganizationDetails} from '@asgardeo/browser';
import getOrganization from '../../../api/getOrganization';
import updateOrganization, {createPatchOperations} from '../../../api/updateOrganization';
import useAsgardeo from '../../../contexts/Asgardeo/useAsgardeo';
import useTranslation from '../../../hooks/useTranslation';
import {Dialog, DialogContent, DialogHeading} from '../../primitives/Popover/Popover';

/**
 * Props for the OrganizationProfile component.
 * Extends BaseOrganizationProfileProps but makes the organization prop optional
 * since it will be fetched using the organizationId
 */
export type OrganizationProfileProps = Omit<BaseOrganizationProfileProps, 'organization' | 'mode'> & {
  /**
   * Component to show when there's an error loading organization data.
   */
  errorFallback?: ReactElement;

  /**
   * Component to show while loading organization data.
   */
  loadingFallback?: ReactElement;

  /**
   * Display mode for the component.
   */
  mode?: 'default' | 'popup';

  /**
   * Callback fired when the popup should be closed (only used in popup mode).
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Callback fired when the organization should be updated.
   */
  onUpdate?: (payload: any) => Promise<void>;

  /**
   * Whether the popup is open (only used in popup mode).
   */
  open?: boolean;

  /**
   * The ID of the organization to fetch and display.
   */
  organizationId: string;

  /**
   * Custom title for the popup dialog (only used in popup mode).
   */
  popupTitle?: string;
};

/**
 * OrganizationProfile component displays organization information in a
 * structured and styled format. It automatically fetches organization details
 * using the provided organization ID and displays them using BaseOrganizationProfile.
 *
 * The component supports editing functionality, allowing users to modify organization
 * fields inline. Updates are automatically synced with the backend via the SCIM2 API.
 *
 * This component is the React-specific implementation that automatically
 * retrieves the organization data from Asgardeo API.
 *
 * @example
 * ```tsx
 * // Basic usage with editing enabled (default)
 * <OrganizationProfile organizationId="0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1" />
 *
 * // Read-only mode
 * <OrganizationProfile
 *   organizationId="0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1"
 *   editable={false}
 * />
 *
 * // With card layout and custom fallbacks
 * <OrganizationProfile
 *   organizationId="0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1"
 *   cardLayout={true}
 *   loadingFallback={<div>Loading organization...</div>}
 *   errorFallback={<div>Failed to load organization</div>}
 *   fallback={<div>No organization data available</div>}
 * />
 *
 * // With custom fields configuration and update callback
 * <OrganizationProfile
 *   organizationId="0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1"
 *   fields={[
 *     { key: 'id', label: 'Organization ID', editable: false },
 *     { key: 'name', label: 'Organization Name', editable: true },
 *     { key: 'description', label: 'Description', editable: true, render: (value) => value || 'No description' },
 *     { key: 'created', label: 'Created Date', editable: false, render: (value) => new Date(value).toLocaleDateString() },
 *     { key: 'lastModified', label: 'Last Modified Date', editable: false, render: (value) => new Date(value).toLocaleDateString() },
 *     { key: 'attributes', label: 'Custom Attributes', editable: true }
 *   ]}
 *   onUpdate={async (payload) => {
 *     console.log('Organization updated:', payload);
 *     // payload contains the updated field values
 *     // The component automatically converts these to patch operations
 *   }}
 * />
 *
 * // In popup mode
 * <OrganizationProfile
 *   organizationId="0d5e071b-d3d3-475d-b3c6-1a20ee2fa9b1"
 *   mode="popup"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   popupTitle="Edit Organization Profile"
 * />
 * ```
 */
const OrganizationProfile: FC<OrganizationProfileProps> = ({
  organizationId,
  mode = 'default',
  open = false,
  onOpenChange,
  onUpdate,
  popupTitle,
  loadingFallback = <div>Loading organization...</div>,
  errorFallback = <div>Failed to load organization data</div>,
  ...rest
}: OrganizationProfileProps): ReactElement => {
  const {baseUrl} = useAsgardeo();
  const {t} = useTranslation();
  const [organization, setOrganization] = useState<OrganizationDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchOrganization = async () => {
    if (!baseUrl || !organizationId) {
      setLoading(false);
      setError(true);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      const orgData = await getOrganization({
        baseUrl,
        organizationId,
      });
      setOrganization(orgData);
    } catch (err) {
      console.error('Failed to fetch organization:', err);
      setError(true);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [baseUrl, organizationId]);

  const handleOrganizationUpdate = async (payload: any): Promise<void> => {
    if (!baseUrl || !organizationId) return;

    try {
      // Convert payload to patch operations format
      const operations = createPatchOperations(payload);

      await updateOrganization({
        baseUrl,
        organizationId,
        operations,
      });
      // Refetch organization data after update
      await fetchOrganization();

      // Call the optional onUpdate callback
      if (onUpdate) {
        await onUpdate(payload);
      }
    } catch (err) {
      console.error('Failed to update organization:', err);
      throw err;
    }
  };

  if (loading) {
    return mode === 'popup' ? (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeading>{popupTitle || t('organization.profile.title')}</DialogHeading>
          <div style={{padding: '1rem'}}>{loadingFallback}</div>
        </DialogContent>
      </Dialog>
    ) : (
      loadingFallback
    );
  }

  if (error) {
    return mode === 'popup' ? (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeading>{popupTitle || t('organization.profile.title')}</DialogHeading>
          <div style={{padding: '1rem'}}>{errorFallback}</div>
        </DialogContent>
      </Dialog>
    ) : (
      errorFallback
    );
  }

  const profileContent = (
    <BaseOrganizationProfile
      organization={organization}
      onUpdate={handleOrganizationUpdate}
      mode={mode === 'popup' ? 'popup' : 'inline'}
      open={open}
      onOpenChange={onOpenChange}
      title={popupTitle || t('organization.profile.title')}
      {...rest}
    />
  );

  return profileContent;
};

export default OrganizationProfile;
