import { Component } from '@angular/core';
import { TrainerService } from 'src/app/services/trainer.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  error = '';

  constructor(private favoriteService: FavoriteService, private trainerService: TrainerService, private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.trainerService.setTrainerId(res.id);
        this.trainerService.loadTrainerInfo();

        this.favoriteService.loadFavorites();

        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.error = 'Email ou senha inválidos. Verifique os dados e tente novamente.'
      },
    });
  }
}
