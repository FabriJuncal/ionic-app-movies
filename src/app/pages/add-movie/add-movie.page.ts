import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { MovieWithRating } from '../../interfaces/movies.interface';
import { PhotoService } from '../../services/photo.service';
import { MoviesService } from '../../services/movies.service';
import { Picture } from '../../interfaces/photo.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.page.html',
  styleUrls: ['./add-movie.page.scss'],
})
export class AddMoviePage implements OnInit {

  @Input() movie: MovieWithRating;

  public formAddMovie: FormGroup;

  isPhoto: boolean;
  photos: Picture[] = [];

  constructor(private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private photoSvc: PhotoService,
              private formBuilder: FormBuilder,
              private movieSrv: MoviesService,
              private authSrc: AuthService) { }

  async ngOnInit() {

    const currentTime = new Date();
    const  currentYear = currentTime.getFullYear();

    this.formAddMovie = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(30)])],
      year: ['', Validators.compose([Validators.required,Validators.min(1926), Validators.max(currentYear)])],
      shortDescription: ['', Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(60)])],
      longDescription: ['', Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(500)])]
    });

    // Carga la imagen almacenado en el Local
    await this.onLoadImage();

  }

  toGetBack(){
    this.modalCtrl.dismiss();
  }

  async onAddMovie(){
    const isAddMovie = await this.movieSrv.addMovie(this.formAddMovie.value);
    if (isAddMovie) {
      this.toGetBack();
    }else{
      const message = 'La película debe tener una portada';
      this.authSrc.presentToast(message, 'danger');
    }
  }

  async onAddImage(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: '¿Como desea cargar su imagen?',
      buttons: [
        {
          text: 'Galería de imágenes',
          handler: async () => {

            this.photos = await this.photoSvc.addNewImage('select', 'movie');
          }
        },
        {
          text: 'Cámara de fotos',
          handler: async () => {

            this.photos = await this.photoSvc.addNewImage('camera', 'movie');
            // .then(async (image) => image);


          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async  onLoadImage(){
    this.photos = await this.photoSvc.loadImage('movie');
    this.isPhoto = this.photoSvc.photo[0].webviewPath ? true : false;
  }

}
