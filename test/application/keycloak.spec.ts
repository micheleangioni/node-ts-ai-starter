import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import supertest from 'supertest';
import appModule from '../../src/app';
import KeycloakConnector from '../../src/infra/keycloak';

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Test only if Keycloak is set

describe('Test the Keycloak Application Service', () => {
  test('the test should always run', () => {
    expect(true).toBe(true);
  });

  if (process.env.KEYCLOAK_REALM) {
    const app: express.Application = express();
    const keycloak = new KeycloakConnector();

    test('it should successfully instantiate Keycloak', async () => {
      expect(keycloak).toBeInstanceOf(KeycloakConnector);
    });

    test('it should correctly throw an error when checking an invalid token', async (done) => {
      keycloak.verifyToken('invalid-error')
        .catch((error) => {
          expect(error).toBeInstanceOf(Error);
          done();
        });
    });

    test(
      'it should correctly protect an endpoint with its middleware and perform a redirect to Keyclok (302)',
      async (done) => {
        app.get('/test-middleware', keycloak.getProtectMiddleware(), (req, res) => {
          res.status(200).json({});

          return;
        });

        const object = await appModule(app);
        supertest(object.app).get('/test-middleware').then((response: any) => {
          expect(response.statusCode).toBe(302);
          done();
        });
      });
  }
});
