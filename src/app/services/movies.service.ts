import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

import sha256 from 'crypto-js/sha256';
import { Movie, MovieWithRating } from '../interfaces/movies.interface';
import { User } from '../interfaces/user.interface';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  user;
  // Obtenemos los datos de la sesión del Usuario
  user$: Observable<User> = this.authSvc.user$;

  movies: Movie[] = [];
  private localMovies: Movie[] = [];

   // eslint-disable-next-line @typescript-eslint/naming-convention
   private DATA_USER_STORAGE = 'user';
   // eslint-disable-next-line @typescript-eslint/naming-convention
   private PHOTO_MOVIE_STORAGE = 'photo_movie';
   // eslint-disable-next-line @typescript-eslint/naming-convention
   private DATA_MOVIE_STORAGE = 'data_movie';

  constructor(private http: HttpClient,
              private authSvc: AuthService) { }

    // Metodo Especial que devuelve los datos del Local Storage
    get getLocalMovies(){
      return [...this.localMovies];
    }

  // Función que se utilizó al principio para obtener los datos de Peliculas para pruebas
  async getMoviesDefault(){
      return new Promise(resolve => {
        this.user$.subscribe(user => {
          this.http.get('assets/movies/movies.json')
            .subscribe(movies => {
              const moviesFilteredByUsers = this.getFilteredByKey(movies, 'uid', user.uid);
              resolve(moviesFilteredByUsers);
            });
        });
      });
  }

  // Carga las peliculas del Local Storage
  async loadMovies() {
    try{
      return new Promise(resolve => {
        this.user$.subscribe(async user => {

          if(user){
            let movies = await Storage.get({ key: this.DATA_MOVIE_STORAGE });
            movies = JSON.parse(movies.value);

            this.localMovies =  this.getFilteredByKey(movies, 'uid', user.uid);
            resolve(this.localMovies);
          }
        });
      });
    }catch( error ){
      console.log('Error al obtener los datos del Local Storage', error);
    }

  }

  //Helper que filtra un Arreglo de Objetos
  getFilteredByKey(array, key, value) {
    return array.filter((e) =>e[key] === value);
  }

  // Helper que crea un nuevo array con las peliculas y su estrellas
  getRateMovie(rating: number){

    const startRate = [];
    for (let i = 0; i < 5; i++) {

      const valueRate = rating > i ? 'star' : 'star-outline';
      startRate.push(valueRate);

    }

    return startRate;
  }

  // Elimina una película del Local Storage
  deleteMovie(movie){
    this.localMovies = this.localMovies.filter( localMovies => localMovies.hash !== movie.hash );
    // Guardamos la película con la calificación modificada en el Local Storage
    Storage.set({
      key: this.DATA_MOVIE_STORAGE,
      value: JSON.stringify(this.localMovies)
    });
    this.loadMovies();
  }

  // Agrega la calificación a la Película
  async addRating(movie, rate): Promise<Movie>{
    this.localMovies = this.localMovies.filter( localMovies => localMovies.hash !== movie.hash );

    const dataMovie: Movie = {
      hash: movie.hash,
      uid: movie.uid,
      title: movie.title,
      shortDescription: movie.shortDescription,
      longDescription: movie.longDescription,
      year: movie.year,
      rating: rate,
      img: movie.img
    };

    this.localMovies = [dataMovie, ...this.localMovies];

    // Guardamos la película con la calificación modificada en el Local Storage
    await Storage.set({
      key: this.DATA_MOVIE_STORAGE,
      value: JSON.stringify(this.localMovies)
    });

    return dataMovie;
  }

  // Agrega una película al Local Storage
  async addMovie(movie: Movie){

    console.log(movie);
    this.localMovies = this.localMovies.filter( localMovies => localMovies.hash !== movie.hash );

    let dataUser = await Storage.get({ key: this.DATA_USER_STORAGE });
    dataUser = JSON.parse(dataUser.value);
    const uid = dataUser[0].uid;

    let urlPhotoMovie = await Storage.get({ key: this.PHOTO_MOVIE_STORAGE });
    urlPhotoMovie = JSON.parse(urlPhotoMovie.value);
    const img = urlPhotoMovie[0].webviewPath ? urlPhotoMovie[0].webviewPath : movie.img;

    console.log(img);
    const movieEncontrada = this.localMovies = this.localMovies.filter( localMovies => localMovies.hash === movie.hash );
    console.log(movieEncontrada);
    if(!img){
      return false;
    }

    const rating = movie.rating ? movie.rating : 0;

    let hash = sha256(movie.title + movie.shortDescription + movie.longDescription + urlPhotoMovie[0].webviewPath);
    hash = hash.toString();

    const dataMovie: Movie = {
      hash,
      title: movie.title,
      shortDescription: movie.shortDescription,
      longDescription: movie.longDescription,
      year: movie.year,
      rating,
      img,
      uid
    };

    this.movies = [dataMovie, ...this.localMovies] ;

    Storage.set({
      key: this.DATA_MOVIE_STORAGE,
      value: JSON.stringify(this.movies)
    });

    Storage.remove({
      key: this.PHOTO_MOVIE_STORAGE
    });

    this.loadMovies();

    return true;
  }


}
