import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ViewMoviePage } from '../view-movie/view-movie.page';
import { AddMoviePage } from '../add-movie/add-movie.page';
import { EditMoviePage } from '../edit-movie/edit-movie.page';
import { ViewMoviePageModule } from '../view-movie/view-movie.module';
import { AddMoviePageModule } from '../add-movie/add-movie.module';
import { EditMoviePageModule } from '../edit-movie/edit-movie.module';


@NgModule({
  entryComponents: [
    ViewMoviePage,
    AddMoviePage,
    EditMoviePage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ViewMoviePageModule,
    AddMoviePageModule,
    EditMoviePageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
