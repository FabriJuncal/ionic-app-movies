import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MovieWithRating, Movie } from '../../interfaces/movies.interface';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-view-movie',
  templateUrl: './view-movie.page.html',
  styleUrls: ['./view-movie.page.scss'],
})
export class ViewMoviePage implements OnInit {

  @Input() movie: Movie;

  getRateMovie: any;

  constructor(private modalCtrl: ModalController,
              private moviesSvc: MoviesService) {

    this.getRateMovie = this.moviesSvc.getRateMovie;
  }

  ngOnInit() {
    console.log(this.movie);
  }

  toGetBack(){
    this.modalCtrl.dismiss();
  }

  async addRating(movie: Movie, rating: number){
    this.movie = await this.moviesSvc.addRating(movie, rating);
    this.getRateMovie = await this.moviesSvc.getRateMovie;

    console.log(this.getRateMovie);
  }

}
