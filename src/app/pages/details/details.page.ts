import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeService } from 'src/app/services/poke.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false,
})
export class DetailsPage implements OnInit {
  pokemon: any = null;
  description: string = '';

  constructor(
    private route: ActivatedRoute,
    private pokeService: PokeService
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.pokeService.getPokemonByNameOrId(name).subscribe(data => {
        this.pokemon = data;
      });

      this.pokeService.getPokemonSpecies(name).subscribe(species => {
        const entry = species.flavor_text_entries.find(
          (e: any) => e.language.name === 'en'
        );
        this.description = entry?.flavor_text.replace(/\f/g, ' ') ?? '';
      });
    }
  }
}
