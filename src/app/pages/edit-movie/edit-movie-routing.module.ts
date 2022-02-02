import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditMoviePage } from './edit-movie.page';

const routes: Routes = [
  {
    path: '',
    component: EditMoviePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMoviePageRoutingModule {}
