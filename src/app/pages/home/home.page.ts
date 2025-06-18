import { Component, OnInit } from '@angular/core';
import { PokeService } from 'src/app/services/poke.service';
import { Pokemon } from 'src/app/models/pokemon.model';

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

  constructor(private pokeService: PokeService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokeService.getPokemons(this.limit, this.offset).subscribe(response => {
      this.pokemons = [];
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

  nextPage() {
    this.offset += this.limit;
    this.loadPokemons();
  }

  prevPage() {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.loadPokemons();
    }
  }
}
