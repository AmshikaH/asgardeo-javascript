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

import {defineNuxtModule, addImports, createResolver, addServerImports} from '@nuxt/kit';
import {defu} from 'defu';
import type {NitroConfig} from 'nitropack';
import type {Nuxt, NuxtModule} from 'nuxt/schema';
import type {ModuleOptions, BasicUserInfo} from './runtime/types';

const PACKAGE_NAME: string = '@asgardeo/nuxt';

export type {BasicUserInfo};

export default defineNuxtModule<ModuleOptions>({
  defaults: {
    baseUrl: process.env.ASGARDEO_BASE_URL || '',
    clientID: process.env.ASGARDEO_CLIENT_ID || '',
    clientSecret: process.env.ASGARDEO_CLIENT_SECRET || '',
    scope: ['openid', 'profile'],
    signInRedirectURL: process.env.ASGARDEO_SIGN_IN_REDIRECT_URL || '',
    signOutRedirectURL: process.env.ASGARDEO_SIGN_OUT_REDIRECT_URL || '',
  },
  meta: {
    configKey: 'asgardeoAuth',
    name: PACKAGE_NAME,
  },
  setup(userOptions: ModuleOptions, nuxt: Nuxt) {
    const options: ModuleOptions = defu(
      userOptions,
      nuxt.options.runtimeConfig.asgardeoAuth,
      nuxt.options.runtimeConfig.public.asgardeoAuth,
      {
        clientID: process.env.ASGARDEO_CLIENT_ID,
        clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
        enablePKCE: true,
        scope: ['openid', 'profile'],
        serverOrigin: process.env.ASGARDEO_BASE_URL,
        signInRedirectURL: process.env.ASGARDEO_SIGN_IN_REDIRECT_URL || '',
        signOutRedirectURL: process.env.ASGARDEO_SIGN_OUT_REDIRECT_URL || '',
      },
    ) as ModuleOptions;

    // eslint-disable-next-line no-param-reassign
    nuxt.options.runtimeConfig.public.asgardeoAuth = defu(nuxt.options.runtimeConfig.public.asgardeoAuth, {
      clientID: options.clientID,
    });

    // eslint-disable-next-line no-param-reassign
    nuxt.options.runtimeConfig.asgardeoAuth = defu(nuxt.options.runtimeConfig.asgardeoAuth, {
      clientID: options.clientID,
      clientSecret: options.clientSecret,
      scope: options.scope,
      serverOrigin: options.baseUrl,
      signInRedirectURL: options.signInRedirectURL,
      signOutRedirectURL: options.signOutRedirectURL,
    });

    const {resolve} = createResolver(import.meta.url);
    const runtimeDir: string = resolve('./runtime');
    const runtimeServerDir: string = resolve('./runtime/server');

    addImports({
      from: resolve(runtimeDir, 'composables/asgardeo/useAuth'),
      name: 'useAuth',
    });

    addServerImports([
      {
        as: 'AsgardeoAuthHandler',
        from: resolve(runtimeServerDir, 'handler'),
        name: 'AsgardeoAuthHandler',
      },
    ]);

    nuxt.hook('nitro:config', (nitroConfig: NitroConfig) => {
      // eslint-disable-next-line no-param-reassign
      nitroConfig.alias = nitroConfig.alias || {};
      // eslint-disable-next-line no-param-reassign
      nitroConfig.alias['#auth/server'] = resolve(runtimeDir, 'server/services/asgardeo');
      // eslint-disable-next-line no-param-reassign
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve(runtimeDir)],
      });
    });
  },
}) satisfies NuxtModule<ModuleOptions>;

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    asgardeoAuth: Pick<ModuleOptions, 'clientID' | 'baseUrl' | 'signInRedirectURL' | 'signOutRedirectURL' | 'scope'>;
  }

  interface RuntimeConfig {
    asgardeoAuth: {
      clientSecret: string;
    };
  }
}
