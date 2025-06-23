import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeService } from 'src/app/services/poke.service';
import { PokemonSpecies } from 'src/app/models/pokemon-species.model';
import { ChartConfiguration } from 'chart.js';
import { Pokemon } from 'src/app/models/pokemon.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false,
})
export class DetailsPage implements OnInit {
  pokemon: any = null;
  description: string = '';

  public barChartLabels: string[] = ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'],
    datasets: [
      {
        data: [],
        label: 'Base Stats',
        backgroundColor: '#ffcb05',
        borderColor: '#3b4cca',
        borderWidth: 1,
        barThickness: 20,
        categoryPercentage: 0.7,
        barPercentage: 0.8
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private pokeService: PokeService
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.pokeService.getPokemonByNameOrId(name).subscribe((data: Pokemon) => {
        this.pokemon = data;
        this.barChartData.datasets[0].data = data.stats.map((s: any) => s.base_stat);
      });

      this.pokeService.getPokemonSpecies(name).subscribe((species: PokemonSpecies) => {
        const entry = species.flavor_text_entries.find(
          (e: any) => e.language.name === 'en'
        );
        this.description = entry?.flavor_text.replace(/\f/g, ' ') ?? '';
      });
    }
  }
}
