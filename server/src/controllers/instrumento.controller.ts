import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  oas,
  param,
  patch,
  post,
  put,
  requestBody,
  Response,
  response,
  RestBindings
} from '@loopback/rest';
import {FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY} from '../keys';
import {Instrumento} from '../models';
import {InstrumentoRepository} from '../repositories';
import {FileUploadHandler} from '../types';

//import {multerMiddleware} from '../middleware/multer.middleware';

import {Request} from 'express';
import {readFile} from 'node:fs';
import {readdir, unlink} from 'node:fs/promises';
import path from 'node:path';

export class InstrumentoController {
  constructor(
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
    @repository(InstrumentoRepository)
    public instrumentoRepository: InstrumentoRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
  ) {}

  @post('/instrumentos')
  @response(200, {
    description: 'Instrumento model instance',
    content: {'application/json': {schema: getModelSchemaRef(Instrumento)}},
  })
  async create(
  @requestBody({
    content: {
    'application/json': {
      schema: getModelSchemaRef(Instrumento, {
      title: 'NewInstrumento',
      }),
    },
    },
  })
  instrumento: Instrumento,
  ): Promise<Instrumento> {
    return this.instrumentoRepository.create(instrumento);
  }
/*	configureFileUpload(bind: Function, configure: Function, destination?: string) {
		// Upload files to `dist/.sandbox` by default
		destination = destination ?? path.join(__dirname, '../.sandbox');
		bind(STORAGE_DIRECTORY).to(destination);
		const multerOptions: multer.Options = {
		storage: multer.diskStorage({
			destination,
			// Use the original file name as is
			filename: (req, file, cb) => {
				this.instrumentoRepository
			cb(null, file.originalname);
			},
		}),
		};
		// Configure the file upload service with multer options
		configure(FILE_UPLOAD_SERVICE).to(multerOptions);
	}*/

  @post('/instrumentos/icone', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, err => {
        if (err) reject(err);
        else {
          resolve(InstrumentoController.getFilesAndFields(request));
        }
      });
    });
  }

  @patch('/instrumentos/icone/{id}', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUploadPatch(
    @param.path.number('id') id: number,
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, err => {
        if (err) reject(err);
        else {
          this.instrumentoRepository.findById(id).then(e=>{
            if (e.tipoImagem) {
              try {
                // check if file exist then delete

                unlink(path.join(this.storageDirectory, id+'.'+e.tipoImagem)).finally(() => resolve(InstrumentoController.getFilesAndFields(request)));
              } catch(e) {
                console.log('error')
                resolve(InstrumentoController.getFilesAndFields(request))
              }

            } else {

            resolve(InstrumentoController.getFilesAndFields(request));
            }
          });

        }
      });
    });
  }


  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private static getFilesAndFields(
    request: Request
  ) {

    console.log('yes?')
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
    });
    let files: object[] = [];

    // if (uploadedFiles) {
    //   files = Array.isArray(uploadedFiles) ? [uploadedFiles[0]].map(mapper) : uploadedFiles[Object.keys(uploadedFiles)[0]].map(mapper);
    //   console.log(JSON.stringify(files))
    // }

    console.log('uploadedFiles', uploadedFiles)
    console.log('uploadedFiles', uploadedFiles?.length)

    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    console.log('files',files)
    console.log('files',files.length)

    return {files, fields: request.body};
  }

  @get('/instrumentos/icone/{filename}')
  @oas.response.file()
  downloadFile(
    @param.path.string('filename') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) : Promise<Buffer> {
    const file = this.validateFileName(fileName);

    return new Promise<Buffer>((res,rej)=>{
      readFile(file, {}, (err,data)=> {
        if (err) rej(err)
          else res(data)
      })
    })
  }

  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private validateFileName(fileName: string) {
    const resolved = path.resolve(this.storageDirectory, fileName);
    if (resolved.startsWith(this.storageDirectory)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
  }

  /*@post('/files/upload', {
responses: {
	'200': {
	description: 'File model instance',
	content: {'application/json': {schema: {'x-ts-type': Instrumento}}},
	},
},
})
async upload(
@requestBody({
	description: 'Upload a file',
	required: true,
	content: {
	'multipart/form-data': {
		'x-parser': 'stream',
		schema: {
		type: 'object',
		properties: {
			imagem: {
			type: 'string',
			format: 'binary',
			},
			nome : { type: 'string'},
			tamanhoX : { type: 'number'},
			tamanhoY : { type: 'number'},
			// Add other fields as needed
		},
		},
	},
	},
})
req: Request,
@inject(RestBindings.Http.RESPONSE) response: RequestHandler
): Promise<object> {
return new Promise<object>((resolve, reject) => {

	this.handler(req, {} as any, async (err: any) => {
	if (err) {
		reject(new HttpErrors.InternalServerError(err.message));
		return
	}

	let file : any = req.files;

		file = Array.isArray(req.files) ? file[0] : file[Object.keys(file)[0]];

	if (!file) {
		reject(new HttpErrors.BadRequest('No file uploaded'));
		return
	}


	const fileData = {
		tipoImagem: file.mimetype,
		data: file.buffer.toString('base64'), // Convert buffer to base64 string


	};

	try {
		const createdFile = await this.instrumentoRepository.create(fileData);
		resolve(createdFile);
	} catch (error) {
		reject(new HttpErrors.InternalServerError(error.message));
	}
	return
	});
});
}*/

  @get('/instrumentos/count')
  @response(200, {
    description: 'Instrumento model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Instrumento) where?: Where<Instrumento>,
  ): Promise<Count> {
    return this.instrumentoRepository.count(where);
  }

  @get('/instrumentos')
  @response(200, {
    description: 'Array of Instrumento model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Instrumento, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Instrumento) filter?: Filter<Instrumento>,
  ): Promise<Instrumento[]> {
    return this.instrumentoRepository.find(filter);
  }

  @patch('/instrumentos')
  @response(200, {
    description: 'Instrumento PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Instrumento, {partial: true}),
        },
      },
    })
    instrumento: Instrumento,
    @param.where(Instrumento) where?: Where<Instrumento>,
  ): Promise<Count> {
    return this.instrumentoRepository.updateAll(instrumento, where);
  }

  @get('/instrumentos/{id}')
  @response(200, {
    description: 'Instrumento model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Instrumento, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Instrumento, {exclude: 'where'})
    filter?: FilterExcludingWhere<Instrumento>,
  ): Promise<Instrumento> {
    return this.instrumentoRepository.findById(id, filter);
  }

  @patch('/instrumentos/{id}')
  @response(200, {
    description: 'Instrumento PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Instrumento, {partial: true}),
        },
      },
    })
    instrumento: Instrumento,
  ): Promise<Instrumento> {
    await this.instrumentoRepository.updateById(id, instrumento);
    return instrumento;
  }

  @put('/instrumentos/{id}')
  @response(200, {
    description: 'Instrumento PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() instrumento: Instrumento,
  ): Promise<Instrumento> {
    await this.instrumentoRepository.replaceById(id, instrumento);
    return instrumento;
  }

  @del('/instrumentos/{id}')
  @response(204, {
    description: 'Instrumento DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const files = await readdir(this.storageDirectory);
    await this.instrumentoRepository.deleteById(id);
    const strId = id+''
    for (const f of files) {
      console.log('file ' + f)
      const stor = f.replace(this.storageDirectory,'');
      if (stor.startsWith(strId)) {
        await unlink(`${this.storageDirectory}\\${stor}`);
        break;
      }
    }
  }
}
