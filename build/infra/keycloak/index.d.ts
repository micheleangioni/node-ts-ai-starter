import { RequestHandler } from 'express';
import Keycloak from 'keycloak-connect';
import { MiddlewareOptions } from './declarations';
export default class KeycloakConnector {
    private static buildKeycloakOptions;
    private keycloak;
    private keyCloakCerts;
    constructor(config?: Keycloak.Config);
    getMiddleware(options?: MiddlewareOptions): RequestHandler;
    getProtectMiddleware(options?: string | Keycloak.SpecHandler | undefined): RequestHandler;
    verifyToken(token: string): Promise<object>;
    isAuthorized: (token: Keycloak.Token, roles?: string[]) => boolean;
}
