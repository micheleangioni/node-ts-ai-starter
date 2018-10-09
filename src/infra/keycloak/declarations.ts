export type KeyKloackOptions = {
  'auth-server-url': string;
  'bearer-only': boolean;
  'confidential-port': number;
  'keycloack-url': string;
  'realm': string;
  'resource': string;
  'ssl-required': string;
};

export type MiddlewareOptions = {
  logout?: string;
  admin?: string;
};
