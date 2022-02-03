import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MovieWithRating } from '../../interfaces/movies.interface';

@Component({
  selector: 'app-view-movie',
  templateUrl: './view-movie.page.html',
  styleUrls: ['./view-movie.page.scss'],
})
export class ViewMoviePage implements OnInit {

  @Input() movie: MovieWithRating;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.movie);
  }

  toGetBack(){
    this.modalCtrl.dismiss();
  }

}
