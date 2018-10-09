import { RequestHandler } from 'express';
// @ts-ignore
import KeyCloakCerts from 'get-keycloak-public-key';
import jwt from 'jsonwebtoken';
import Keycloak, { Token } from 'keycloak-connect';
import { KeyKloackOptions, MiddlewareOptions } from './declarations';

export default class KeycloakConnector {
  private static buildKeycloakOptions(): KeyKloackOptions {
    return {
      'auth-server-url': process.env['KEYCLOAK_AUTH-SERVER-URL'] || '',
      'bearer-only': process.env['KEYCLOAK_BEARER-ONLY'] === 'true',
      'confidential-port': parseInt(process.env.KEYCLOAK_CONFIDENTIAL_PORT || '0', 10),
      'keycloack-url': process.env['KEYCLOAK_KEYCLOACK-URL'] || '',
      'realm': process.env.KEYCLOAK_REALM || '',
      'resource': process.env.KEYCLOAK_RESOURCE || '',
      'ssl-required': process.env['KEYCLOAK_SSL-REQUIRED'] || 'external',
    };
  }

  private keycloak: Keycloak;
  private keyCloakCerts: KeyCloakCerts;

  constructor(config: Keycloak.Config = {}) {
    const keyCloakOptions = KeycloakConnector.buildKeycloakOptions();
    this.keyCloakCerts = new KeyCloakCerts(keyCloakOptions['keycloack-url'], keyCloakOptions.realm);
    this.keycloak = new Keycloak(config, keyCloakOptions);
  }

  public getMiddleware (options: MiddlewareOptions = {}): RequestHandler {
    return this.keycloak.middleware(options);
  }

  public getProtectMiddleware (options?: string | Keycloak.SpecHandler | undefined): RequestHandler {
    return this.keycloak.protect(options);
  }

  public async verifyToken(token: string): Promise<object> {
    const payload = jwt.decode(token, {
      complete: true,
    });

    if (!payload || typeof payload === 'string') {
      throw new Error('Empty or invalid token payload');
    }

    const kid = payload.header.kid;

    try {
      // Fetch the PEM Public Key
      const publicKey = await this.keyCloakCerts.fetch(kid);

      return jwt.verify(token, publicKey) as object;
    } catch (error) {
      // KeyCloak has no Public Key for the specified KID (keyCloakCerts.fetch)
      // or
      // Token is not valid (jwt.verify)
      throw new Error(error);
    }
  }

  public isAuthorized = (token: Token, roles: string[] = []): boolean => {
    return roles.some((role: string) => {
      return token.hasRealmRole(role);
    });
  }
}
