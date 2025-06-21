import { Component, OnInit } from '@angular/core';
import { FavoriteService } from 'src/app/services/favorite.service';
import { PokeService } from 'src/app/services/poke.service';
import { Pokemon } from 'src/app/models/pokemon.model';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false,
})
export class FavoritesPage implements OnInit {
  allFavoritesSortedById: Pokemon[] = [];
  displayedPokemons: Pokemon[] = [];
  limit = 10;
  offset = 0;

  constructor(
    private favoriteService: FavoriteService,
    private pokeService: PokeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.favoriteService.favoritesChanged.subscribe(() => {
      this.loadAndSortAllFavorites();
    });
    this.loadAndSortAllFavorites();
  }

  loadAndSortAllFavorites() {
    const favoriteNames = this.favoriteService.getFavorites();

    if (favoriteNames.length === 0) {
      this.allFavoritesSortedById = [];
      this.displayedPokemons = [];
      this.offset = 0;
      return;
    }

    const allPokemonRequests: Observable<Pokemon>[] = favoriteNames.map(name =>
      this.pokeService.getPokemonByNameOrId(name)
    );

    forkJoin(allPokemonRequests).subscribe({
      next: (pokemons: Pokemon[]) => {
        this.allFavoritesSortedById = pokemons.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        this.applyPagination();
      },
      error: (err) => {
        console.error('Error loading all favorite Pokémons:', err);
        this.allFavoritesSortedById = [];
        this.displayedPokemons = [];
      }
    });
  }

  applyPagination() {
    if (this.offset >= this.allFavoritesSortedById.length && this.offset > 0) {
      this.offset = Math.max(0, this.allFavoritesSortedById.length - this.limit);
      if (this.offset % this.limit !== 0) {
        this.offset = Math.floor(this.offset / this.limit) * this.limit;
      }
    } else if (this.allFavoritesSortedById.length === 0) {
      this.offset = 0;
    }

    this.displayedPokemons = this.allFavoritesSortedById.slice(this.offset, this.offset + this.limit);

    if (this.displayedPokemons.length === 0 && this.allFavoritesSortedById.length > 0) {
        if (this.offset > 0) {
            this.prevPage();
            return;
        }
    }
  }

  goToDetails(name: string) {
    this.router.navigate(['/details', name]);
  }

  nextPage() {
    if (this.canGoNext) {
      this.offset += this.limit;
      this.applyPagination();
    }
  }

  prevPage() {
    if (this.canGoPrev) {
      this.offset -= this.limit;
      this.applyPagination();
    }
  }

  isFavorite(name: string): boolean {
    return this.favoriteService.isFavorite(name);
  }

  toggleFavorite(name: string) {
    this.favoriteService.toggleFavorite(name);
  }

  get canGoNext(): boolean {
    return (this.offset + this.limit) < this.allFavoritesSortedById.length;
  }

  get canGoPrev(): boolean {
    return this.offset > 0;
  }
}
