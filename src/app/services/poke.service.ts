import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonSpecies } from '../models/pokemon-species.model'

@Injectable({
  providedIn: 'root'
})
export class PokeService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemons(limit: number, offset: number): Observable<any> {
    const url = `${this.baseUrl}?limit=${limit}&offset=${offset}`;
    return this.http.get(url);
  }

  getPokemonByNameOrId(nameOrId: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${nameOrId}`);
  }

  getPokemonSpecies(name: string): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
  }
}
