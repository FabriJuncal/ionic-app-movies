import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgout-password',
  templateUrl: './forgout-password.page.html',
  styleUrls: ['./forgout-password.page.scss'],
})
export class ForgoutPasswordPage implements OnInit {

  public onRecovePasswordForm: FormGroup;

  constructor(private authSvc: AuthService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.onRecovePasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])]
    });
  }

  // Envía un email de recuperación de contraseña y redirecciona al Login
  async onResetPassword() {
    try {

      await this.authSvc.resetPassword(this.onRecovePasswordForm.value.email);
      this.router.navigate(['/login']);

    } catch (error) {
      console.log('Error->',error);
    }
  }

}
