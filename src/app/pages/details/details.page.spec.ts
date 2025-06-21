import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsPage } from './details.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PokeService } from 'src/app/services/poke.service';

describe('DetailsPage', () => {
  let component: DetailsPage;
  let fixture: ComponentFixture<DetailsPage>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => 'pikachu'
      }
    }
  };

  const mockPokeService = {
    getPokemonByNameOrId: jasmine.createSpy('getPokemonByNameOrId').and.returnValue(of({
      name: 'pikachu',
      sprites: {
        other: {
          'official-artwork': {
            front_default: 'https://example.com/pikachu.png'
          }
        }
      },
      types: [
        { slot: 1, type: { name: 'electric' } }
      ]
    })),
    getPokemonSpecies: jasmine.createSpy('getPokemonSpecies').and.returnValue(of({
      flavor_text_entries: [
        { language: { name: 'en' }, flavor_text: 'Pikachu, the Mouse Pokémon.' }
      ]
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsPage],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PokeService, useValue: mockPokeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsPage);
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load Pokémon data and description on init', () => {
    expect(mockPokeService.getPokemonByNameOrId).toHaveBeenCalledWith('pikachu');
    expect(mockPokeService.getPokemonSpecies).toHaveBeenCalledWith('pikachu');
    expect(component.pokemon.name).toBe('pikachu');
    expect(component.description).toBe('Pikachu, the Mouse Pokémon.');
  });
});
