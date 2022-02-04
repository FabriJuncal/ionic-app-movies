import {Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { MoviesService } from '../../services/movies.service';
import { MovieWithRating, Movie } from '../../interfaces/movies.interface';
import { ModalController } from '@ionic/angular';
import { ViewMoviePage } from '../view-movie/view-movie.page';
import { AddMoviePage } from '../add-movie/add-movie.page';
import { EditMoviePage } from '../edit-movie/edit-movie.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  movies: any;
  movie: MovieWithRating;
  modal: any;
  getRateMovie: any;

  constructor(
    private authSvc: AuthService,
    private moviesSvc: MoviesService,
    private modalCtrl: ModalController) {


    this.getMovies();
    this.getRateMovie = this.moviesSvc.getRateMovie;
  }

  get dataMovies(): Movie[]{
    return this.moviesSvc.getLocalMovies;
  }

  ngOnInit() {
  }

  // Deslogea al usuario
  async onLogout(){
    await this.authSvc.logout();
  }

  // Elimina la pelicula
  async onDeleteMovie(movie: Movie){
    await this.moviesSvc.deleteMovie(movie);
    this.getMovies();
  }

  // Obtiene las Peliculas
  getMovies(){
    this.moviesSvc.loadMovies();
  }

  // Redirecciona que se le pasa como parametro
  async redirectPage(page: string, movie: Movie = null){

    const component = page === 'view-movie' ? ViewMoviePage : page === 'add-movie' ? AddMoviePage: EditMoviePage;

    // con la función importada, creamos el modal, para eso se le pasa el siguiente objeto con sus respectivos datos
    this.modal = await this.modalCtrl.create({
      component,
      componentProps: {
        movie
      }

    });

    await this.modal.present();
    // this.router.navigate([`/${page}`]);
  }


}
