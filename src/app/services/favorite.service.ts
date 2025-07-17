import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { TrainerService } from './trainer.service';
import { tap, catchError } from 'rxjs/operators';

const API_BASE = 'https://pokeapp-ionic-backend.onrender.com';

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
    this.loadFavorites().subscribe();
    this.trainerService.levelUp(this.favorites.length);
  }

  loadFavorites() {
    const userId = this.trainerService.getTrainerId();

    if (userId) {
      return this.http.get<{ favorites: string[] }>(`${API_BASE}/favorites/get-favorites?userId=${userId}`).pipe(
        tap(response => {
          this.favorites = response.favorites;
          this.trainerService.levelUp(this.favorites.length);
          this.favoritesChanged.next();
        }),
        catchError(err => {
          console.error('Erro ao carregar os favoritos', err);
          return of(null);
        })
      );
    } else {
      console.log('ID do usuário não encontrado.');
      return of(null);
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

      // this.http.post(this.webhookUrl, {
      //   event: 'favorited',
      //   pokemon: name,
      //   trainerName: this.trainerService.getTrainerName()
      // }).subscribe();
    }
  }

  removeFavorite(name: string) {
    this.favorites = this.favorites.filter(f => f !== name);
    this.saveFavorites();
    this.syncFavorites();
    
    // this.http.post(this.webhookUrl, {
    //   event: 'unfavorited',
    //   pokemon: name,
    //   trainerName: this.trainerService.getTrainerName()
    // }).subscribe();
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

    // this.http.post(this.webhookUrl, {
    //   event: 'favorites_cleared',
    //   trainerName: this.trainerService.getTrainerName()
    // }).subscribe();
  }

  private syncFavorites() {
    const userId = this.trainerService.getTrainerId();

    this.http.post(`${API_BASE}/favorites/sync-favorites`, {
      userId: userId,
      favorites: this.favorites
    }).subscribe(response => {
      console.log('Favoritos sincronizados no backend', response);
    }, error => {
      console.error('Erro ao sincronizar favoritos no backend', error);
    });
  }
}
