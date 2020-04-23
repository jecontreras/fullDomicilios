import { Injectable, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ServiciosService } from '../services/servicios.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ToolsService } from '../services/tools.service';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { async } from '@angular/core/testing';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  options:any;
  imageResponse:any = [];
  imagenView:any = [];

  constructor(
    private _model: ServiciosService,
    private imagePicker: ImagePicker,
    private _tools: ToolsService,
    private transfer: FileTransfer
  ) {
  }
  get(query: any){
    return this._model.querys<ARCHIVO>('galeria/querys', query, 'post');
  }
  
  saved (query: any){
    let postData = new FormData();
    for(let row of query.img){
      row.img = postData.append('file', row);
    }
    // console.log(query);
    return this._model.querys<ARCHIVO>('galeria/file', query, 'post');
  }

  // async getImages( config:any = {} ) {
  //   this.options = {
  //     maximumImagesCount: config.maximum || 1,
  //     width: config.width || 300,
  //     height: config.height || 600,
  //     quality: config.quality || 100,
  //     outputType: config.outputType || 1
  //   };
  //   this.imageResponse = [];
  //   this.imagenView = [];
  //   return new Promise( async( resolve )=>{
  //     let results = await this.imagePicker.getPictures(this.options);
  //     for (var i = 0; i < results.length; i++) {
  //       this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
  //       this.imagenView.push({
  //         id: i,
  //         foto: 'data:image/jpeg;base64,' + results[i]
  //       });
  //     }
  //     resolve( this.imagenView )
  //   });
  // }

  async upload(file_array:any, data:any){
    let FileTransfer: FileTransferObject = this.transfer.create();

    let random = Math.floor(Math.random() * 100);

    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: "myImage_"+ random + ".jpg",
      chunkedMode: false,
      httpMethod: "post",
      mimeType: "image/jpeg",
      headers: {},
      params: {
        data: data
      }
      
    };
    return new Promise( async (resolve:any) =>{
      file_array.forEach((row: any)=>{
        return FileTransfer.upload(row, URL+"/galeria/file", options)
        .then((file:any)=>{
          return file;
        }, (err)=>{
        });
      });
      resolve(true);
    });
  }

}

export interface ARCHIVO {

};
