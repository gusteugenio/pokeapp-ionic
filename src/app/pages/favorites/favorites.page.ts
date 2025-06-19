import { Component, OnInit } from '@angular/core';
import { FavoriteService } from 'src/app/services/favorite.service';
import { PokeService } from 'src/app/services/poke.service';
import { Pokemon } from 'src/app/models/pokemon.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false,
})
export class FavoritesPage implements OnInit {
  pokemons: Pokemon[] = [];
  limit = 10;
  offset = 0;

  constructor(
    private favoriteService: FavoriteService,
    private pokeService: PokeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.pokemons = [];
    const favNames = this.favoriteService.getFavorites().slice(this.offset, this.offset + this.limit);
    favNames.forEach(name => {
      this.pokeService.getPokemonByNameOrId(name).subscribe(data => {
        this.pokemons.push(data);
      });
    });
  }

  goToDetails(name: string) {
    this.router.navigate(['/details', name]);
  }

  nextPage() {
    const total = this.favoriteService.getFavorites().length;
    if (this.offset + this.limit < total) {
      this.offset += this.limit;
      this.loadFavorites();
    }
  }

  prevPage() {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.loadFavorites();
    }
  }

  isFavorite(name: string): boolean {
    return this.favoriteService.isFavorite(name);
  }

  toggleFavorite(name: string) {
    this.favoriteService.toggleFavorite(name);
    this.loadFavorites();
  }

  get canGoNext(): boolean {
    return this.offset + this.limit < this.favoriteService.getFavorites().length;
  }

  get canGoPrev(): boolean {
    return this.offset > 0;
  }
}

