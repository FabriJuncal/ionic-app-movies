import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, GalleryPhotos, Photo } from '@capacitor/camera';
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

  constructor() { }


  public async loadSaved(mode: string = '') {
    if(mode === 'gallery') {
      // Recuperar datos de matriz de fotos del Local Storage
      const photoList = await Storage.get({ key: this.PHOTOS_STORAGE });
      this.photos = JSON.parse(photoList.value) || [];
    }

  }

  public async loadImage(){
      // Recuperar datos de matriz de fotos del Local Storage
      const photo = await Storage.get({ key: this.PHOTO_STORAGE });

      if(!photo.value){
        Storage.set({
          key: this.PHOTO_STORAGE,
          value:  JSON.stringify([]),
        });
      }

      console.log('photo->', photo);

      this.photo = await JSON.parse(photo.value) || [];

      console.log('this.photo->', this.photo);

      return this.photo;
  }

  public async addNewImage(inGallery: boolean = false, mode: string = '') {

    let savedImageFile;

    if(!inGallery){
      // Toma una Foto
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // Datos basados en archivos, proporciona el mejor rendimiento
        source: CameraSource.Camera, // Toma automáticamente una nueva foto con la cámara
        quality: 100 // máxima calidad (Rango de calidad de imagen entre 0 a 100)
      });
      // Guarda la imagen
      savedImageFile = await this.savePicture(capturedPhoto);

    }else{
      // Toma una Foto


      const selectedImageGallery = await Camera.pickImages({
        quality: 100 // máxima calidad (Rango de calidad de imagen entre 0 a 100)
      });

      console.log('selectedImageGallery->', selectedImageGallery);

      // Guarda la imagen
      savedImageFile = await this.savePicture(selectedImageGallery.photos[0]);
    }

    if(mode === 'gallery') {
      // Agrega a la colección de fotos.
      this.photos.unshift(savedImageFile);

      // Guardamos los datos de las imagenes de las en el Local Storage
      Storage.set({
        key: this.PHOTOS_STORAGE,
        value: JSON.stringify(this.photos),
      });

      return this.photos;

    }else{

      this.photo = savedImageFile;

      // Guardamos los datos de las imagenes de las en el Local Storage
      Storage.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photo),
      });

      return this.photo;
    }



  }

  // Convierte un blob a base64
  private async readAsBase64(photo: Photo) {
    console.log(photo);
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

    console.log('savedFile->', savedFile);
    console.log('this.photos->', this.photos);
    console.log('this.photo->', this.photo.webviewPath);

    // Se usa .webPath para mostrar la nueva imagen en lugar de base64 ya que este es ya cargado en memoria
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

}
