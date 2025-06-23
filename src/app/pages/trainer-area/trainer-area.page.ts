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
  trainerGender: 'male' | 'female' | null = null;
  trainerName: string | null = null;

  constructor(
    private trainerService: TrainerService,
    private favoriteService: FavoriteService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.trainerService.trainerLevel$.subscribe(level => {
      this.trainerLevel = level;
    });

    this.favoriteService.favoritesChanged.subscribe(() => {
      this.capturedPokemonsCount = this.favoriteService.getFavorites().length;
    });
    this.capturedPokemonsCount = this.favoriteService.getFavorites().length;

    this.trainerGender = this.trainerService.getTrainerGender();
    this.trainerName = this.trainerService.getTrainerName();

    if (!this.trainerGender) {
      await this.presentGenderSelection();
      this.trainerGender = this.trainerService.getTrainerGender();
    }

    if (!this.trainerName) {
      await this.presentNamePrompt();
    }

    if (this.trainerGender) {
      this.setTrainerImage(this.trainerGender);
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
            this.trainerGender = 'male';
            this.setTrainerImage('male');
          }
        },
        {
          text: 'Feminino',
          handler: () => {
            this.trainerService.setTrainerGender('female');
            this.trainerGender = 'female';
            this.setTrainerImage('female');
          }
        }
      ],
      backdropDismiss: false,
    });

    await alert.present();
  }

  async presentNamePrompt() {
    const alert = await this.alertController.create({
      header: 'Qual o seu nome, Treinador?',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Digite seu nome aqui'
        }
      ],
      buttons: [
        {
          text: 'Confirmar',
          handler: (data) => {
            if (data.name && data.name.trim().length > 0) {
              this.trainerName = data.name.trim();
              if (this.trainerName) {
                localStorage.setItem('trainer_name', this.trainerName);
              }
            } else {
              this.presentNamePrompt();
            }
          }
        }
      ],
      backdropDismiss: false,
    });

    await alert.present();
  }

  setTrainerImage(gender: 'male' | 'female') {
    this.trainerImageUrl = gender === 'female'
      ? 'assets/img/serena.png'
      : 'assets/img/ash.png';
  }

  get pokemonsForNextLevel(): number {
    const POKEMONS_FOR_LEVEL_UP = 5;
    const nextLevelThreshold = (this.trainerLevel + 1) * POKEMONS_FOR_LEVEL_UP;
    const remaining = nextLevelThreshold - this.capturedPokemonsCount;
    return remaining > 0 ? remaining : 0;
  }

  get motivationalMessage(): string {
    if (this.trainerLevel >= 1 && this.trainerLevel <= 15) return "Você é um Mestre Pokémon!";
    if (this.trainerLevel >= 16 && this.trainerLevel <= 25) return "Quase no topo!";
    if (this.trainerLevel > 25) return "Bom trabalho, continue assim!";
    return "Vamos começar sua jornada!";
  }

}
