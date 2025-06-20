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
  limit = 20;
  offset = 0;
  totalPokemons = 0;

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
    this.pokeService.getPokemons(this.limit, this.offset).subscribe(response => {
      this.totalPokemons = response.count;
      response.results.forEach((pokemon: any) => {
        this.pokeService.getPokemonByNameOrId(pokemon.name).subscribe(data => {
          this.pokemons.push({
            name: data.name,
            url: pokemon.url,
            id: data.id,
            sprites: data.sprites
          });
        });
      });
    });
  }

  goToDetails(name: string) {
    this.router.navigate(['/details', name]);
  }

  nextPage() {
    if (this.offset + this.limit < this.totalPokemons) {
      this.offset += this.limit;
      this.loadPokemons();
    }
  }

  prevPage() {
    if (this.offset >= this.limit) {
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
