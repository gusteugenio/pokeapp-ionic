import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { TrainerService } from './trainer.service';

const FAVORITES_KEY = 'pokemon_favorites';

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

  private loadFavorites() {
    const fav = localStorage.getItem(FAVORITES_KEY);
    this.favorites = fav ? JSON.parse(fav) : [];
  }

  private saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites));
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
}
