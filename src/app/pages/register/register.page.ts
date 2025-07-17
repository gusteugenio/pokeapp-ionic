import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  username = '';
  email = '';
  password = '';
  gender = 'male';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.error = '';
    this.success = '';

    this.auth.register({
      username: this.username,
      email: this.email,
      password: this.password,
      gender: this.gender
    }).subscribe({
      next: () => {
        this.error = ''; 
        this.success = 'Usuário registrado com sucesso!';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.success = ''; 
        this.error = 'Não foi possível concluir o cadastro. Verifique se o email já está em uso ou se os dados estão corretos.';
      }
    });
  }
}
