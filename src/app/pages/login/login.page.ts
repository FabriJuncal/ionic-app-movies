import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { PhotoService } from '../../services/photo.service';
import { AuthService } from '../../services/auth.service';
import { Picture } from '../../interfaces/photo.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{

  public onLoginForm: FormGroup;

  passwordType = 'password';
  passwordIcon = 'eye-off';
  isPhoto: boolean;
  photos: Picture[] = [];

  constructor(private authSvc: AuthService,
              private router: Router,
              private formBuilder: FormBuilder,
              private actionSheetCtrl: ActionSheetController,
              public photoSvc: PhotoService) {}

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  async ngOnInit() {
    // Muestra los datos de la Sesión del Usuario en la consola
    // this.authSvc.authStateUser()
    // .subscribe(user => {
    //   console.log('userdata->',user);
    // });

    this.onLoginForm = this.formBuilder.group({
      user: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    // Carga la imagen almacenado en el Local
    await this.onLoadImage();
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
          handler: async () => {

            this.photos = await this.photoSvc.addNewImage('select');
          }
        },
        {
          text: 'Cámara de fotos',
          handler: async () => {

            this.photos = await this.photoSvc.addNewImage('camera');
            // .then(async (image) => image);


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

  async  onLoadImage(){
    this.photos = await this.photoSvc.loadImage();
    // this.isPhoto = this.photoSvc.photo[0].webviewPath ? true : false;
  }

  // Verifica que el email del usuario se encuentre verificado y redirecciona
  private  redirectUser(isVerified: boolean): void {
    if(isVerified){
      const message = 'Inicio de Sesión Exitoso';
      this.authSvc.presentToast(message, 'success');
      this.router.navigateByUrl('/home');
    }else{
      const message = 'Verifique su correo electrónico';
      this.authSvc.presentToast(message, 'warning');
      this.router.navigateByUrl('/verify-email');
    }
  }







}
