import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon.model';
import { PokemonSpecies } from '../models/pokemon-species.model';
import { PokemonListResponse, PokemonListItem } from '../models/pokemon-list-response.model';

export interface TypeListItem {
  name: string;
  url: string;
}

export interface TypeListResponse {
  count: number;
  results: TypeListItem[];
}

export interface PokemonByTypeEntry {
  pokemon: PokemonListItem;
  slot: number;
}

export interface PokemonTypeResponse {
  pokemon: PokemonByTypeEntry[];
}


@Injectable({
  providedIn: 'root'
})
export class PokeService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemons(limit: number, offset: number): Observable<PokemonListResponse> {
    const url = `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`;
    return this.http.get<PokemonListResponse>(url);
  }

  getPokemonByNameOrId(nameOrId: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

  getPokemonSpecies(name: string): Observable<PokemonSpecies> {
    return this.http.get<PokemonSpecies>(`${this.baseUrl}/pokemon-species/${name}`);
  }

  getAllTypes(): Observable<TypeListResponse> {
    return this.http.get<TypeListResponse>(`${this.baseUrl}/type`);
  }

  getPokemonsByType(type: string): Observable<Pokemon[]> {
    return this.http.get<PokemonTypeResponse>(`${this.baseUrl}/type/${type}`).pipe(
      map(response => response.pokemon),
      switchMap(pokemonEntries => {
        const pokemonObservables = pokemonEntries.map(entry =>
          this.getPokemonByNameOrId(entry.pokemon.name)
        );
        return forkJoin(pokemonObservables);
      })
    );
  }
}
