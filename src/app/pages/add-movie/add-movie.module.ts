import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMoviePageRoutingModule } from './add-movie-routing.module';

import { AddMoviePage } from './add-movie.page';
import { SafeUrlPipe } from '../../pipes/safe-resource-url.pipe';
import { LoginPageModule } from '../login/login.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMoviePageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoginPageModule
  ],
  declarations: [AddMoviePage]
})
export class AddMoviePageModule {}
