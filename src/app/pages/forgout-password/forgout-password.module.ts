import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgoutPasswordPageRoutingModule } from './forgout-password-routing.module';

import { ForgoutPasswordPage } from './forgout-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgoutPasswordPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ForgoutPasswordPage]
})
export class ForgoutPasswordPageModule {}
