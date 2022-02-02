import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { PhotoService } from '../../services/photo.service';
import { AuthService } from '../../services/auth.service';

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
  photo = {
    filepath: '',
    webviewPath: ''
  };

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
      password: ['', Validators.compose([Validators.required])]
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

            this.photo = await this.photoSvc.addNewImage('select');
          }
        },
        {
          text: 'Cámara de fotos',
          handler: async () => {

            this.photo = await this.photoSvc.addNewImage('camera');
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
    this.photo = await this.photoSvc.loadImage();
    this.isPhoto = this.photoSvc.photo.webviewPath ? true : false;
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
