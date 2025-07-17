import { Component, OnInit } from '@angular/core';
import { TrainerService } from 'src/app/services/trainer.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.trainerService.trainerLevel$.subscribe(level => {
      this.trainerLevel = level;
    });

    this.favoriteService.loadFavorites().subscribe(() => {
      this.capturedPokemonsCount = this.favoriteService.getFavorites().length;
    });

    this.favoriteService.favoritesChanged.subscribe(() => {
      this.capturedPokemonsCount = this.favoriteService.getFavorites().length;
    });

    this.trainerService.loadTrainerInfo();

    this.trainerService.trainerNameSubject.subscribe(name => {
      this.trainerName = name;
    });

    this.trainerService.trainerGenderSubject.subscribe(gender => {
      this.trainerGender = gender;
      if (this.trainerGender) {
        this.setTrainerImage(this.trainerGender);
      }
    });
  }

  setTrainerImage(gender: 'male' | 'female') {
    this.trainerImageUrl = gender === 'female'
      ? 'assets/img/serena.png'
      : 'assets/img/ash.png';
  }

  logout() {
    this.authService.logout();
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
