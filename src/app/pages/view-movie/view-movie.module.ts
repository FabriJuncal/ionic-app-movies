import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewMoviePageRoutingModule } from './view-movie-routing.module';

import { ViewMoviePage } from './view-movie.page';
import { LoginPageModule } from '../login/login.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewMoviePageRoutingModule,
    LoginPageModule
  ],
  declarations: [ViewMoviePage]
})
export class ViewMoviePageModule {}
