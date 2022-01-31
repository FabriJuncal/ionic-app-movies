import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public onLoginForm: FormGroup;

  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(private authSvc: AuthService,
              private router: Router,
              private formBuilder: FormBuilder,
              private actionSheetCtrl: ActionSheetController) {}

  ngOnInit() {
    // Muestra los datos de la Sesión del Usuario en la consola
    // this.authSvc.authStateUser()
    // .subscribe(user => {
    //   console.log('userdata->',user);
    // });

    this.onLoginForm = this.formBuilder.group({
      user: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  public hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  // Logea al usuario con Email y Contraseña
  async onLogin() {
    try {
      const user = await this.authSvc.login(this.onLoginForm.value.user,this.onLoginForm.value.password);
      if(user){
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    } catch (error) {
      console.log('Error->', error);
    }
  }

  // Logea al usuario con Google
  async onLoginGoogle() {
    try {
      const user = await this.authSvc.loginGoogle();
      if(user){
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    } catch (error) {
      console.log('Error->', error);
    }
  }

  async onChangeImage(){

    const actionSheet = await this.actionSheetCtrl.create({
      header: '¿Como desea cargar su imagen?',
      buttons: [
        {
          text: 'Galería de imágenes',
          handler: () => {
            // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cámara de fotos',
          handler: () => {
            // this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  // Verifica que el email del usuario se encuentre verificado y redirecciona
  private  redirectUser(isVerified: boolean): void {
    if(isVerified){
      this.router.navigateByUrl('/home');
    }else{
      this.router.navigateByUrl('/verify-email');
    }
  }





}
