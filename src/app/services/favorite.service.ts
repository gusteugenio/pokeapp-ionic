import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { TrainerService } from './trainer.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favorites: string[] = [];
  // Descomente as chamadas ao rodar localmente.
  // private webhookUrl = 'http://localhost:3000/webhook';
  public favoritesChanged = new Subject<void>();

  constructor(
    private http: HttpClient,
    private trainerService: TrainerService
  ) {
    this.loadFavorites();
    this.trainerService.levelUp(this.favorites.length);
  }

  loadFavorites() {
    const userId = this.trainerService.getTrainerId();

    if (userId) {
      this.http.get<{ favorites: string[] }>(`http://localhost:4000/favorites/get-favorites?userId=${userId}`).subscribe({
        next: (response) => {
          this.favorites = response.favorites;
          this.trainerService.levelUp(this.favorites.length);
          this.favoritesChanged.next();
        },
        error: (err) => {
          console.error('Erro ao carregar os favoritos', err);
        }
      });
    } else {
      console.log('ID do usuário não encontrado.');
    }
  }

  private saveFavorites() {
    this.favoritesChanged.next();
    this.trainerService.levelUp(this.favorites.length);
  }

  getFavorites(): string[] {
    return this.favorites;
  }

  isFavorite(name: string): boolean {
    return this.favorites.includes(name);
  }

  addFavorite(name: string) {
    if (!this.isFavorite(name)) {
      this.favorites.push(name);
      this.saveFavorites();
      this.syncFavorites();
    }
  }

  removeFavorite(name: string) {
    this.favorites = this.favorites.filter(f => f !== name);
    this.saveFavorites();
    this.syncFavorites();
  }

  toggleFavorite(name: string) {
    if (this.isFavorite(name)) {
      this.removeFavorite(name);
    } else {
      this.addFavorite(name);
    }
  }

  clearFavorites() {
    this.favorites = [];
    this.saveFavorites();
    this.syncFavorites();
  }

  private syncFavorites() {
    const userId = this.trainerService.getTrainerId();

    this.http.post('http://localhost:4000/favorites/sync-favorites', {
      userId: userId,
      favorites: this.favorites
    }).subscribe(response => {
      console.log('Favoritos sincronizados no backend', response);
    }, error => {
      console.error('Erro ao sincronizar favoritos no backend', error);
    });
  }
}
