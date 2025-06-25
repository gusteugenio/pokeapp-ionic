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
  allPokemonNames: string[] = [];
  displayedPokemons: Pokemon[] = [];
  limit = 20;
  offset = 0;
  totalPokemons = 0;

  isSearchingSpecificPokemon: boolean = false;
  searchTerm: string = '';
  searchResults: Pokemon[] = [];

  allTypes: TypeListItem[] = [];
  selectedType: string = 'all';
  isLoadingPokemons: boolean = false;

  constructor(
    private pokeService: PokeService,
    private favoriteService: FavoriteService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.pokeService.getPokemons(10000, 0).subscribe(response => {
      this.allPokemonNames = response.results.map(p => p.name);
    });
    this.loadTypes();
    this.loadPokemons();
  }

  loadTypes() {
    this.pokeService.getAllTypes().subscribe(response => {
      this.allTypes = response.results.filter(type =>
        type.name !== 'shadow' && type.name !== 'unknown' && type.name !== 'stellar'
      );
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
    this.offset = 0;
    this.loadPokemons(true);
  }

  searchPokemon(event: any) {
    this.offset = 0;
    const term = event.detail.value.trim().toLowerCase();
    this.searchTerm = term;

    if (!term || /^[^a-z0-9]+$/i.test(term)) {
      this.isSearchingSpecificPokemon = false;
      this.offset = 0;

      if (this.selectedType === 'all') {
        this.loadPokemons(true);
      } else {
        this.totalPokemons = this.pokemons.length;
        this.applyLocalPagination();
      }
      return;
    }

    this.isSearchingSpecificPokemon = true;
    this.isLoadingPokemons = true;

    const filteredNames = this.allPokemonNames.filter(name => name.includes(term));
    this.searchResults = [];
    this.displayedPokemons = [];
    let loaded = 0;

    if (filteredNames.length === 0) {
      this.isLoadingPokemons = false;
      this.totalPokemons = 0;
      return;
    }

    filteredNames.forEach(name => {
      this.pokeService.getPokemonByNameOrId(name).subscribe(data => {
        this.searchResults.push(data);
        loaded++;

        if (loaded === filteredNames.length) {
          this.isLoadingPokemons = false;
          this.totalPokemons = this.searchResults.length;
          this.searchResults.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
          this.displayedPokemons = this.searchResults.slice(this.offset, this.offset + this.limit);
        }
      });
    });

  }

  goToDetails(name: string) {
    this.router.navigate(['/details', name]);
  }

  nextPage() {
    if ((this.offset + this.limit) < this.totalPokemons) {
      this.offset += this.limit;
      if (this.isSearchingSpecificPokemon) {
        this.displayedPokemons = this.searchResults.slice(this.offset, this.offset + this.limit);
      } else if (this.selectedType === 'all') {
        this.loadPokemons(false);
      } else {
        this.applyLocalPagination();
      }
    }
  }

  prevPage() {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      if (this.isSearchingSpecificPokemon) {
        this.displayedPokemons = this.searchResults.slice(this.offset, this.offset + this.limit);
      } else if (this.selectedType === 'all') {
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
