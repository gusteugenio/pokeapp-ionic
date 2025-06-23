import { Component, OnInit } from '@angular/core';
import { PokeService, TypeListItem } from 'src/app/services/poke.service';
import { Pokemon } from 'src/app/models/pokemon.model';
import { FavoriteService } from 'src/app/services/favorite.service';
import { Router } from '@angular/router';
import { PokemonListResponse } from 'src/app/models/pokemon-list-response.model';

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

  allTypes: TypeListItem[] = [];
  selectedType: string = 'all';
  isLoadingPokemons: boolean = false;

  constructor(
    private pokeService: PokeService,
    private favoriteService: FavoriteService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadTypes();
    this.loadPokemons();
  }

  loadTypes() {
    this.pokeService.getAllTypes().subscribe(response => {
      this.allTypes = response.results.filter(type =>
        type.name !== 'shadow' && type.name !== 'unknown' && type.name !== 'stellar'
      );
      this.allTypes.unshift({ name: 'all', url: '' });
    });
  }

  loadPokemons(resetOffset: boolean = true) {
    if (this.isLoadingPokemons) {
      return;
    }

    this.isLoadingPokemons = true;
    this.pokemons = [];
    this.displayedPokemons = [];

    if (resetOffset) {
      this.offset = 0;
    }

    if (this.selectedType === 'all') {
      this.pokeService.getPokemons(this.limit, this.offset).subscribe({
        next: (response: PokemonListResponse) => {
          this.totalPokemons = response.count;
          let loadedCount = 0;
          const totalToLoad = response.results.length;

          if (totalToLoad === 0) {
            this.isLoadingPokemons = false;
            return;
          }

          response.results.forEach(pokemonListItem => {
            this.pokeService.getPokemonByNameOrId(pokemonListItem.name).subscribe(data => {
              this.pokemons.push(data);
              loadedCount++;

              if (loadedCount === totalToLoad) {
                this.pokemons.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
                this.displayedPokemons = [...this.pokemons];
                this.isLoadingPokemons = false;
              }
            }, error => {
              console.error('Error loading detailed pokemon:', error);
              loadedCount++;
              if (loadedCount === totalToLoad) {
                this.isLoadingPokemons = false;
              }
            });
          });
        },
        error: (err) => {
          console.error('Error loading pokemon list:', err);
          this.isLoadingPokemons = false;
        }
      });
    } else {
      this.pokeService.getPokemonsByType(this.selectedType).subscribe({
        next: (pokemonsOfType: Pokemon[]) => {
          this.pokemons = pokemonsOfType.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
          this.totalPokemons = this.pokemons.length;
          this.applyLocalPagination();
          this.isLoadingPokemons = false;
        },
        error: (err) => {
          console.error(`Error loading pokemons of type ${this.selectedType}:`, err);
          this.pokemons = [];
          this.displayedPokemons = [];
          this.totalPokemons = 0;
          this.isLoadingPokemons = false;
        }
      });
    }
  }

  applyLocalPagination() {
    this.displayedPokemons = this.pokemons.slice(this.offset, this.offset + this.limit);
  }

  onTypeChange(event: any) {
    this.selectedType = event.detail.value;
    this.searchTerm = '';
    this.isSearchingSpecificPokemon = false;
    this.loadPokemons(true);
  }

  searchPokemon(event: any) {
    const term = event.detail.value.trim().toLowerCase();
    this.searchTerm = term;

    if (term === '') {
      this.isSearchingSpecificPokemon = false;
      this.displayedPokemons = this.pokemons.slice(this.offset, this.offset + this.limit);
      return;
    }

    this.isSearchingSpecificPokemon = true;

    this.pokeService.getPokemonByNameOrId(term).subscribe(
      data => {
        this.displayedPokemons = [data];
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
    if (!this.isSearchingSpecificPokemon && (this.offset + this.limit) < this.totalPokemons) {
      this.offset += this.limit;
      if (this.selectedType === 'all') {
        this.loadPokemons(false);
      } else {
        this.applyLocalPagination();
      }
    }
  }

  prevPage() {
    if (!this.isSearchingSpecificPokemon && this.offset >= this.limit) {
      this.offset -= this.limit;
      if (this.selectedType === 'all') {
        this.loadPokemons(false);
      } else {
        this.applyLocalPagination();
      }
    }
  }

  isFavorite(name: string): boolean {
    return this.favoriteService.isFavorite(name);
  }

  toggleFavorite(name: string) {
    this.favoriteService.toggleFavorite(name);
  }

  get canGoNext(): boolean {
    return (this.offset + this.limit) < this.totalPokemons;
  }

  get canGoPrev(): boolean {
    return this.offset > 0;
  }
}
