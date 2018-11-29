"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const get_keycloak_public_key_1 = __importDefault(require("get-keycloak-public-key"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keycloak_connect_1 = __importDefault(require("keycloak-connect"));
class KeycloakConnector {
    constructor(config = {}) {
        this.isAuthorized = (token, roles = []) => {
            return roles.some((role) => {
                return token.hasRealmRole(role);
            });
        };
        const keyCloakOptions = KeycloakConnector.buildKeycloakOptions();
        this.keyCloakCerts = new get_keycloak_public_key_1.default(keyCloakOptions['keycloack-url'], keyCloakOptions.realm);
        this.keycloak = new keycloak_connect_1.default(config, keyCloakOptions);
    }
    static buildKeycloakOptions() {
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
    getMiddleware(options = {}) {
        return this.keycloak.middleware(options);
    }
    getProtectMiddleware(options) {
        return this.keycloak.protect(options);
    }
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = jsonwebtoken_1.default.decode(token, {
                complete: true,
            });
            if (!payload || typeof payload === 'string') {
                throw new Error('Empty or invalid token payload');
            }
            const kid = payload.header.kid;
            try {
                // Fetch the PEM Public Key
                const publicKey = yield this.keyCloakCerts.fetch(kid);
                return jsonwebtoken_1.default.verify(token, publicKey);
            }
            catch (error) {
                // KeyCloak has no Public Key for the specified KID (keyCloakCerts.fetch)
                // or
                // Token is not valid (jwt.verify)
                throw new Error(error);
            }
        });
    }
}
exports.default = KeycloakConnector;
//# sourceMappingURL=index.js.map