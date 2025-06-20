import { Component, OnInit } from '@angular/core';
import { PokeService } from 'src/app/services/poke.service';
import { Pokemon } from 'src/app/models/pokemon.model';
import { FavoriteService } from 'src/app/services/favorite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  pokemons: Pokemon[] = [];
  displayedPokemons: Pokemon[] = [];
  limit = 20;
  offset = 0;
  totalPokemons = 0;
  isSearchingSpecificPokemon: boolean = false;
  searchTerm: string = '';

  constructor(
    private pokeService: PokeService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokemons = [];
    this.displayedPokemons = [];

    this.pokeService.getPokemons(this.limit, this.offset).subscribe(response => {
      this.totalPokemons = response.count;
      let loadedCount = 0;
      const totalToLoad = response.results.length;

      response.results.forEach((pokemon: any) => {
        this.pokeService.getPokemonByNameOrId(pokemon.name).subscribe(data => {
          this.pokemons.push({
            name: data.name,
            id: data.id,
            sprites: data.sprites
          });
          loadedCount++;

          if (loadedCount === totalToLoad) {
            this.pokemons.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
            if (!this.isSearchingSpecificPokemon) {
              this.displayedPokemons = [...this.pokemons];
            }
          }
        });
      });
    });
  }

  searchPokemon(event: any) {
    const term = event.detail.value.trim().toLowerCase();
    this.searchTerm = term;

    if (term === '') {
      this.isSearchingSpecificPokemon = false;
      this.displayedPokemons = [...this.pokemons];
      return;
    }

    this.isSearchingSpecificPokemon = true;

    this.pokeService.getPokemonByNameOrId(term).subscribe(
      data => {
        this.displayedPokemons = [{
          name: data.name,
          id: data.id,
          sprites: data.sprites
        }];
      },
      error => {
        this.displayedPokemons = [];
      }
    );
  }

  goToDetails(name: string) {
    this.router.navigate(['/details', name]);
  }

  nextPage() {
    if (!this.isSearchingSpecificPokemon && this.offset + this.limit < this.totalPokemons) {
      this.offset += this.limit;
      this.loadPokemons();
    }
  }

  prevPage() {
    if (!this.isSearchingSpecificPokemon && this.offset >= this.limit) {
      this.offset -= this.limit;
      this.loadPokemons();
    }
  }

  isFavorite(name: string): boolean {
    return this.favoriteService.isFavorite(name);
  }

  toggleFavorite(name: string) {
    this.favoriteService.toggleFavorite(name);
  }

}
