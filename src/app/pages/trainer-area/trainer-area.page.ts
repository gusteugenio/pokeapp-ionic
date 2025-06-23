import { Component, OnInit } from '@angular/core';
import { TrainerService } from 'src/app/services/trainer.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-trainer-area',
  templateUrl: './trainer-area.page.html',
  styleUrls: ['./trainer-area.page.scss'],
  standalone: false,
})
export class TrainerAreaPage implements OnInit {
  trainerLevel: number = 0;
  capturedPokemonsCount: number = 0;
  maxLevel: number = 50;
  trainerImageUrl: string = '';

  constructor(
    private trainerService: TrainerService,
    private favoriteService: FavoriteService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.trainerService.trainerLevel$.subscribe(level => {
      this.trainerLevel = level;
    });

    this.favoriteService.favoritesChanged.subscribe(() => {
      this.capturedPokemonsCount = this.favoriteService.getFavorites().length;
    });
    this.capturedPokemonsCount = this.favoriteService.getFavorites().length;

    const gender = this.trainerService.getTrainerGender();
    if (!gender) {
      this.presentGenderSelection();
    } else {
      this.setTrainerImage(gender);
    }
  }

  async presentGenderSelection() {
    const alert = await this.alertController.create({
      header: 'Escolha seu Gênero',
      buttons: [
        {
          text: 'Masculino',
          handler: () => {
            this.trainerService.setTrainerGender('male');
            this.setTrainerImage('male');
          }
        },
        {
          text: 'Feminino',
          handler: () => {
            this.trainerService.setTrainerGender('female');
            this.setTrainerImage('female');
          }
        }
      ]
    });

    await alert.present();
  }

  setTrainerImage(gender: 'male' | 'female') {
    this.trainerImageUrl = gender === 'female'
      ? 'assets/img/serena.png'
      : 'assets/img/ash.png';
  }

}
