import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const TRAINER_LEVEL_KEY = 'trainer_level';
const TRAINER_GENDER_KEY = 'trainer_gender';
const POKEMONS_FOR_LEVEL_UP = 5;
const MAX_TRAINER_LEVEL = 50;

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private trainerLevelSubject = new BehaviorSubject<number>(0);
  public trainerLevel$: Observable<number> = this.trainerLevelSubject.asObservable();

  constructor() {
    this.loadTrainerLevel();
  }

  private loadTrainerLevel() {
    const storedLevel = localStorage.getItem(TRAINER_LEVEL_KEY);
    const level = storedLevel ? parseInt(storedLevel, 10) : 0;
    this.trainerLevelSubject.next(level);
  }

  private saveTrainerLevel(level: number) {
    const levelToSave = Math.min(level, MAX_TRAINER_LEVEL);
    localStorage.setItem(TRAINER_LEVEL_KEY, levelToSave.toString());
    this.trainerLevelSubject.next(levelToSave);
  }

  levelUp(favoritedCount: number) {
    const calculatedLevel = Math.floor(favoritedCount / POKEMONS_FOR_LEVEL_UP);
    const newLevel = calculatedLevel;
    this.saveTrainerLevel(newLevel);
  }

  getCurrentLevel(): number {
    return this.trainerLevelSubject.value;
  }

  getTrainerGender(): 'male' | 'female' | null {
    const gender = localStorage.getItem(TRAINER_GENDER_KEY);
    if (gender === 'male' || gender === 'female') {
      return gender;
    }
    return null;
  }

  setTrainerGender(gender: 'male' | 'female') {
    localStorage.setItem(TRAINER_GENDER_KEY, gender);
  }

}
