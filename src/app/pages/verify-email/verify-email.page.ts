import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit, OnDestroy{

  // Obtenemos los datos de la sesión del Usuario
  user$: Observable<User> = this.authSvc.user$;

  constructor(private authSvc: AuthService) { }

  ngOnInit() {
    // Muestra los datos de la Sesión del Usuario en la consola
    // this.authSvc.authStateUser()
    // .subscribe(user => {
    //   console.log('userdata->',user);
    // });
  }

  // Función para enviar el correo de verificación
  async onSendEmail(): Promise<void>{
    try {
      await this.authSvc.sendVerificationEmail();
    } catch (error) {
      console.log('Error->', error);
    }
  }

  // Función para cerrar la Sesión del Usuario
  ngOnDestroy(): void {
    this.authSvc.logout();
  }

}
