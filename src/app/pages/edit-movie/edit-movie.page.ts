import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Movie } from '../../interfaces/movies.interface';
import { PhotoService } from '../../services/photo.service';
import { MoviesService } from '../../services/movies.service';
import { Picture } from '../../interfaces/photo.interface';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.page.html',
  styleUrls: ['./edit-movie.page.scss'],
})
export class EditMoviePage implements OnInit {

  @Input() movie: Movie;

  public formAddMovie: FormGroup;

  isPhoto: boolean;
  photos: Picture[] = [];

  constructor(private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private photoSvc: PhotoService,
              private formBuilder: FormBuilder,
              private movieSrv: MoviesService) { }

  async ngOnInit() {

    const currentTime = new Date();
    const  currentYear = currentTime.getFullYear();

    this.formAddMovie = this.formBuilder.group({
      title: [this.movie.title, Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(30)])],
      year: [this.movie.year, Validators.compose([Validators.required,Validators.min(1926), Validators.max(currentYear)])],
      // eslint-disable-next-line max-len
      shortDescription: [this.movie.shortDescription, Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(60)])],
      // eslint-disable-next-line max-len
      longDescription: [this.movie.longDescription, Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(500)])],
      img: [this.movie.img, Validators.compose([Validators.required])]
    });

    // Carga la imagen almacenado en el Local
    await this.onLoadImage();

  }

  toGetBack(){
    this.modalCtrl.dismiss();
  }

  async onEditMovie(){

    let title, year, shortDescription, longDescription, img;

    ({ title, year, shortDescription, longDescription, img } = this.formAddMovie.value);

    const dataMovie: Movie = {
      hash: this.movie.hash,
      uid: this.movie.uid,
      title,
      shortDescription,
      longDescription,
      year,
      rating: this.movie.rating,
      img
    };

    console.log('dataMovie',dataMovie);
    await this.movieSrv.addMovie(dataMovie);
    this.toGetBack();
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
