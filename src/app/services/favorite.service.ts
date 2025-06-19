import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const FAVORITES_KEY = 'pokemon_favorites';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favorites: string[] = [];
  // Para uso efetivo do webhook, é preciso desativar o CORS.
  private webhookUrl = 'https://webhook.site/2d5ef690-52b6-4fe3-bb9e-5894697fee19';

  constructor(private http: HttpClient) {
    this.loadFavorites();
  }

  private loadFavorites() {
    const fav = localStorage.getItem(FAVORITES_KEY);
    this.favorites = fav ? JSON.parse(fav) : [];
  }

  private saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites));
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
      this.http.post(this.webhookUrl, { pokemon: name, event: 'favorited' }).subscribe();
    }
  }

  removeFavorite(name: string) {
    this.favorites = this.favorites.filter(f => f !== name);
    this.saveFavorites();
    this.http.post(this.webhookUrl, { pokemon: name, event: 'unfavorited' }).subscribe();
  }

  toggleFavorite(name: string) {
    if (this.isFavorite(name)) {
      this.removeFavorite(name);
    } else {
      this.addFavorite(name);
    }
  }
}
