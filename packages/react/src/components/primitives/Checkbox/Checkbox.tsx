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

import {FC, InputHTMLAttributes} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '@emotion/css';
import FormControl from '../FormControl/FormControl';
import InputLabel from '../InputLabel/InputLabel';
import {withVendorCSSClassPrefix, bem} from '@asgardeo/browser';
import useStyles from './Checkbox.styles';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  /**
   * Label text to display next to the checkbox
   */
  label?: string;
  /**
   * Error message to display below the checkbox
   */
  error?: string;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Helper text to display below the checkbox
   */
  helperText?: string;
}

const Checkbox: FC<CheckboxProps> = ({label, error, className, required, helperText, style = {}, ...rest}) => {
  const {theme, colorScheme} = useTheme();
  const hasError = !!error;
  const styles = useStyles(theme, colorScheme, hasError, !!required);

  return (
    <FormControl
      error={error}
      helperText={helperText}
      className={cx(withVendorCSSClassPrefix(bem('checkbox')), className)}
      helperTextMarginLeft={`calc(${theme.vars.spacing.unit} * 3.5)`}
    >
      <div style={style} className={cx(withVendorCSSClassPrefix(bem('checkbox', 'container')), styles.container)}>
        <input
          type="checkbox"
          className={cx(withVendorCSSClassPrefix(bem('checkbox', 'input')), styles.input, styles.errorInput, {
            [withVendorCSSClassPrefix(bem('checkbox', 'input', 'error'))]: hasError,
          })}
          aria-invalid={hasError}
          aria-required={required}
          {...rest}
        />
        {label && (
          <InputLabel
            required={required}
            error={hasError}
            variant="inline"
            className={cx(withVendorCSSClassPrefix(bem('checkbox', 'label')), styles.label, styles.errorLabel, {
              [withVendorCSSClassPrefix(bem('checkbox', 'label', 'error'))]: hasError,
            })}
          >
            {label}
          </InputLabel>
        )}
      </div>
    </FormControl>
  );
};

export default Checkbox;
