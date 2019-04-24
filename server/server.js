'use strict';

require('dotenv').config();

const Hapi = require('hapi');
const Iner = require('inert');

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const xmlParser = require('fast-xml-parser');

const MAX_FILES_NUM = 10000;
const HTTP_PORT = process.env.PORT || '8080';
const isProduction = process.env.NODE_ENV === 'production';

const validate = async (request, username, password, h) => {

    const validUsername = process.env.USER_NAME;

    if (username !== validUsername) {
        return { credentials: null, isValid: false };
    }

    const passwordHash = crypto.createHash('md5').update(password).digest("hex");

    const isValid = passwordHash === process.env.USER_PASSWORD;
    const credentials = { id: 0, name: process.env.USER_NAME };

    return { isValid, credentials };
};

const server = Hapi.server({
    port: process.env.port || HTTP_PORT,
    host: '0.0.0.0'
});

const init = async () => {

  await server.register(require('inert'));
  await server.register(require('hapi-auth-basic'));

  await server.auth.strategy('simple', 'basic', { validate });

  await server.route({
    method: 'GET',
    path: '/landmark/download',
    options: {
      auth: 'simple'
    },
    handler: (request, h) => {
      return h.file('./dist/app/index.html');
    }
  })

  // await server.route({
  //   method: 'POST',
  //   path: '/api/save-landmark',
  //   handler: (request, h) => {
  //     try {
  //       if (request.info.hostname !== 'localhost' && 
  //           request.info.hostname !== '127.0.0.1' && 
  //           request.info.referrer !== 'http://facing-landmarks.com/') {
  //         console.log(`request from unknown url ${request.info.hostname}`);
  //         console.log(request.info);

  //         return h.response().code(404);
  //       }

  //       let failedFileName = 0;
  //       let rnd = Math.floor(Math.random() * Math.floor(MAX_FILES_NUM));
  //       let filename = `mask-${rnd}.svg`;
  //       let filePath = path.join(__dirname, 'landmarks', filename);
  //       const content = request.payload.image;

  //       if (xmlParser.validate(content).err) {
  //         return h.response().code(404);
  //       }

  //       while (fs.existsSync(filePath)) {
  //         failedFileName += 1;

  //         if (failedFileName >= MAX_FILES_NUM) {
  //           console.log('max number of files reached');

  //           return h.response().code(404);
  //         }

  //         rnd = Math.floor(Math.random() * Math.floor(MAX_FILES_NUM));
  //         filename = `mask-${rnd}.svg`;
  //         filePath = path.join(__dirname, 'landmarks', filename);
  //       }

  //       fs.writeFile(filePath, content, function (err) {
  //         if (err) h.response().code(404);

  //         console.log(`Saved new mask as ${filename}`);
  //       });

  //       return h.response().code(200);
  //     } catch (err) {
  //       console.log(err);

  //       return h.response().code(404);
  //     }
  //   }
  // })

  await server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.file('./dist/app/index.html');
    }
  });

  await server.route({
    method: 'GET',
    path: '/index.html.var',
    handler: (request, h) => {
      return h.file('./dist/app/index.html');
    }
  });

  await server.route({
    method: 'GET',
    path: '/index.html',
    handler: (request, h) => {
      return h.file('./dist/app/index.html');
    }
  });

  await server.route({
    method: 'GET',
    path: '/app/{filepath*}',
    handler: (request, h) => {
      return h.file(`./dist/app/${request.params.filepath}`);
    }
  });

  await server.route({
    method: ['GET'],
    path: '/{any*}',
    handler: (request, h) => {
      console.log(`404 on route ${request.params.any}`);

      return h.file('./dist/app/404.html').code(404);
    }
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

process.on('SIGINT', () => {
  console.log('stopping hapi server');

  server.stop({ timeout: 10000 }).then(err => {
    console.log('hapi server stopped');
    process.exit(err ? 1 : 0);
  });
});

init();