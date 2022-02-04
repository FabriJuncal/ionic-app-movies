import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public onRegisterForm: FormGroup;
  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(private authSvc: AuthService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }


  public hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  // Registra un nuevo usuario
  async onRegister() {
    try {
      const user = await this.authSvc.register(this.onRegisterForm.value.email,this.onRegisterForm.value.password);

      if(user){
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    } catch (error) {
      console.log('Error',error);
    }
  }

  // Verifica que el email del usuario se encuentre verificado y redirecciona
  private redirectUser(isVerified: boolean): void {
    if(isVerified){
      this.router.navigateByUrl('/admin');
    }else{
      this.router.navigateByUrl('/verify-email');
    }
  }

}
