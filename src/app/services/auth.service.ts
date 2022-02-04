import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { ToastController } from '@ionic/angular';

import { getAuth,
         signOut,
         signInWithEmailAndPassword,
         createUserWithEmailAndPassword,
         sendEmailVerification,
         GoogleAuthProvider,
         sendPasswordResetEmail,
         onAuthStateChanged,
         signInWithRedirect
        } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Observable que almacena la session del usuario
  public user$: Observable<User>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private PHOTO_MOVIE_STORAGE =  'photo_movie';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private DATA_USER_STORAGE = 'user';

  constructor(private router: Router,
              private toastController: ToastController) {
    this.user$ = this.authStateUser();
  }

  // Obtiene la sesión del usuario logeado
  authStateUser(): Observable<User>{
    return new Observable( subscriber => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, subscriber);
        return unsubscribe;
    });
  }

  // Esta función es la que mostrará el mensaje en el Toast
  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message,
      duration: 6000,
      color,
      position: 'top'
    });
    toast.present();
  }

  // Envía un correo de recuperación de contraseña
  async resetPassword(email): Promise<void> {
    try{
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
    } catch(error){
      console.log('Error->', error);
    }

  }

  // Logea al usuario con Google
  async loginGoogle(): Promise<User>{
    try{

      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      const {user} = await signInWithRedirect(auth, provider);

      this.updateUserData(user);
      return user;

    } catch(error){
      console.log('Error->', error);
    }
  }

  // Registra al usuario con email y contraseña
  async register( email: string, password: string ): Promise<User>{
    try{

      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      this.sendVerificationEmail();
      return user;

    } catch(error){
      const message = 'El Correo electrónico ingresado ya se encuentra registrado';
      this.presentToast(message, 'danger');
    }
  }

  // Logea al usuario con email y contraseña
  async login( email: string, password: string ): Promise<User>{
    try{

      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      this.updateUserData(user);

      const dataUser: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      };

      Storage.set({
        key: this.DATA_USER_STORAGE,
        value: JSON.stringify([dataUser])
      });

      return user;

    } catch(error){
      const message = 'Correo electrónico o contraseña incorrectos';
      this.presentToast(message, 'danger');
    }
  }

  // Envia un correo de verificación
  async sendVerificationEmail(): Promise<void> {
    try{

      const auth = getAuth();
      sendEmailVerification(auth.currentUser)
        .then(() => {
          // Email verification sent!
          // ...
        });

    } catch(error){
      console.log('Error->', error);
    }
  }

  // Verifica si el email del usuario está verificado
  isEmailVerified(user: User): boolean {
    return user.emailVerified === true ? true : false;
  }

  // Deslogea al usuario
  async logout(): Promise<void> {
    try{

      // Eliminamos la imagen cargada anteriormente para el alta de una película
      await Storage.remove({
        key: this.PHOTO_MOVIE_STORAGE
      });


      if(this.user$){
        const auth = getAuth();
        signOut(auth).then(() => {

          const message = 'Se ha cerrado la sesión';
          this.presentToast(message, 'success');

          this.router.navigate(['/login']);

        }).catch((error) => {
          console.log('Error->', error);
        });
      }else{
        this.router.navigate(['/login']);
      }

    } catch(error){
      console.log('Error->', error);
    }
  }

  // Actualiza los datos del usuario al logearse
  private updateUserData(user: User){

    const db = getFirestore();
    const userRef = doc(db, `users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName
    };

    setDoc(userRef, data, { merge: true });

  }

}
