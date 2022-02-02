import {Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { MoviesService } from '../../services/movies.service';
import { Movies } from '../../interfaces/movies.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  movies: any;
  iconoRate = 'star-outline';

  constructor(private authSvc: AuthService,
              private moviesSvc: MoviesService,
              private router: Router) {


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
    this.movies = this.movies.map(element => this.getRateMovie(element));

    console.log('movies->', this.movies);
  }

  // Crea un nuevo array con las peliculas y su estrellas
  getRateMovie(movie: Movies){
    const startRate = [];
    for (let i = 0; i < 5; i++) {

      const valueRate = movie.rating > i ? 'star' : 'star-outline';
      startRate.push(valueRate);

    }

    const moviesWithRate = {
      uid: movie.uid,
      title: movie.title,
      description: movie.description,
      rating: startRate,
      img: movie.img
    };

    return moviesWithRate;
  }

  // Redirecciona que se le pasa como parametro
  redirectPage(page: string){
    this.router.navigate([`/${page}`]);
  }


}
