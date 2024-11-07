import fs from 'node:fs';
import {ApplicationConfig, TaikoPerformerApplication} from './application';
export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new TaikoPerformerApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.info(`Server is running at ${url}`);
  console.info(`Try ${url}/ping`); // ToDo: Remove this

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST ?? '127.0.0.1', //substituir com o seu ipv4 local se precisar testar mobile
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },

      // Enable HTTPS
      protocol: 'https',
      key: fs.readFileSync('./.cert/key.pem'),
      cert: fs.readFileSync('./.cert/cert.pem'),
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
