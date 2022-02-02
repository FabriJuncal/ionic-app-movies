import { Injectable } from '@angular/core';
import { Camera,
        CameraResultType,
        CameraSource,
        Photo,
        ImageOptions } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';
import { UserPhoto } from '../interfaces/photointerface';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  public photo;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private PHOTOS_STORAGE = 'photos';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private PHOTO_STORAGE = 'photo';

  constructor() {
    Camera.requestPermissions({permissions:['photos']});
  }


  // Carga imagenes de la Galeria
  public async loadImages() {

    // Recuperar datos de matriz de fotos del Local Storage
    const photoList = await Storage.get({ key: this.PHOTOS_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];
    return this.photos;


  }

  // Cagar imagen del Avatar
  public async loadImage(){
      // Recuperar datos de matriz de fotos del Local Storage
      const photo = await Storage.get({ key: this.PHOTO_STORAGE });

      if(!photo.value){
        Storage.set({
          key: this.PHOTO_STORAGE,
          value:  JSON.stringify([]),
        });
      }

      this.photo = await JSON.parse(photo.value) || [];
      return this.photo;
  }

  public async addNewImage(opcion: string, mode: string = '') {


    console.log('opcion->', opcion);
    console.log('mode->', mode);

    const source = opcion === 'camera' ? CameraSource.Camera : CameraSource.Photos;
    // const resultType = opcion === 'camera' ? CameraResultType.Uri : CameraResultType.DataUrl; 

    const opcionPicture: ImageOptions = {
      source,
      resultType : CameraResultType.Uri,
      quality: 100
    };

    // Obtiene la imagen
    const capturedPhoto = await Camera.getPhoto(opcionPicture);

    console.log('capturedPhoto->', capturedPhoto);

    // Guarda la imagen
    const savedImageFile = await this.savePicture(capturedPhoto);

    console.log('savedImageFile->', savedImageFile);

    // Definimos las variables dependiendo del modo seleccionado
    const key = mode === 'gallery' ? this.PHOTOS_STORAGE : this.PHOTO_STORAGE;

    let picture;
    if(mode === 'gallery') {
      this.photos.unshift(savedImageFile);
      picture = this.photos;
    }else{
      this.photo = savedImageFile;
      picture = this.photo;
    }

    Storage.set({
      key,
      value: JSON.stringify(picture)
    });

    console.log('picture->', picture);
    return picture;
  }

  // Convierte un blob a base64
  private async readAsBase64(photo: Photo) {
    // Obtiene la foto
    const response = await fetch(photo.webPath);
    // Lo lee como un blob
    const blob = await response.blob();
    // Convierte al formato base64
    return await this.convertBlobToBase64(blob) as string;
  }

  // Helper para convertir un blob a base64
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });


  private async savePicture(photo) {
    // Convierte la foto al formato base64, requerido por la API del sistema de archivos para guardar
    const base64Data = await this.readAsBase64(photo);

    // Agrega el archivo en el directorio de datos.
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Se usa .webPath para mostrar la nueva imagen en lugar de base64 ya que este es ya cargado en memoria
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

}
