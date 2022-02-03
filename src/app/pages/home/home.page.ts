import {Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { MoviesService } from '../../services/movies.service';
import { Movies, MovieWithRating } from '../../interfaces/movies.interface';
import { Router } from '@angular/router';
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

  constructor(private authSvc: AuthService,
              private moviesSvc: MoviesService,
              private modalCtrl: ModalController) {


       this.getMovies();
  }

  ngOnInit() {
  }

  // Deslogea al usuario
  async onLogout(){
    await this.authSvc.logout();
  }

  // Obtiene las Peliculas
  async getMovies(){
    this.movies = await this.moviesSvc.getMoviesDefault();
    this.movies = this.movies.map(element => this.moviesSvc.getRateMovie(element));

    console.log('movies->', this.movies);
  }

  // Redirecciona que se le pasa como parametro
  async redirectPage(page: string, movie: MovieWithRating){

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
