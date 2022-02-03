import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

import { Movies } from '../interfaces/movies.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  user;

  // Obtenemos los datos de la sesión del Usuario
  user$: Observable<User> = this.authSvc.user$;

  constructor(private http: HttpClient,
              private authSvc: AuthService) { }

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

  //Helper que filtra un Arreglo de Objetos
  getFilteredByKey(array, key, value) {
    return array.filter((e) =>e[key] === value);
  }

  // Helper que crea un nuevo array con las peliculas y su estrellas
  getRateMovie(movie: Movies){

    const startRate = [];
    for (let i = 0; i < 5; i++) {

      const valueRate = movie.rating > i ? 'star' : 'star-outline';
      startRate.push(valueRate);

    }

    const moviesWithRate = {
      uid: movie.uid,
      title: movie.title,
      shortDescription: movie.shortDescription,
      longDescription: movie.longDescription,
      year: movie.year,
      rating: startRate,
      img: movie.img
    };

    return moviesWithRate;
  }
}
