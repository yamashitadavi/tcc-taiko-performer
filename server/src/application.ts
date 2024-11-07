import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';

import multer from 'multer';
import path from 'node:path';
import {FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY} from './keys';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class TaikoPerformerApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    this.bind(RestBindings.ERROR_WRITER_OPTIONS).to({safeFields: ['statusCode','message', 'errorCode']});
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.configureFileUpload(options.fileStorageDirectory);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

protected configureFileUpload(destination?: string) {
  // Upload files to `dist/.sandbox` by default
  destination = destination ?? path.join(__dirname, '../.sandbox');
  this.bind(STORAGE_DIRECTORY).to(destination);
  const multerOptions: multer.Options = {
    storage: multer.diskStorage({
      destination,
      // Use the original file name as is
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  };
  // Configure the file upload service with multer options
  this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
}


}
