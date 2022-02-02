import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanActivate } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { NotAuthGuard } from './shared/not-auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate:[NotAuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    canActivate:[NotAuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./pages/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule),
    canActivate:[NotAuthGuard]
  },
  {
    path: 'forgout-password',
    loadChildren: () => import('./pages/forgout-password/forgout-password.module').then( m => m.ForgoutPasswordPageModule),
    canActivate:[NotAuthGuard]
  },
  {
    path: 'edit-movie',
    loadChildren: () => import('./pages/edit-movie/edit-movie.module').then( m => m.EditMoviePageModule)
  },
  {
    path: 'add-movie',
    loadChildren: () => import('./pages/add-movie/add-movie.module').then( m => m.AddMoviePageModule)
  },
  {
    path: 'view-movie',
    loadChildren: () => import('./pages/view-movie/view-movie.module').then( m => m.ViewMoviePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
