import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const TRAINER_LEVEL_KEY = 'trainer_level';
const TRAINER_GENDER_KEY = 'trainer_gender';
const TRAINER_NAME_KEY = 'trainer_name';
const POKEMONS_FOR_LEVEL_UP = 5;
const MAX_TRAINER_LEVEL = 50;

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private trainerLevelSubject = new BehaviorSubject<number>(0);
  public trainerLevel$: Observable<number> = this.trainerLevelSubject.asObservable();
  // Descomente as chamadas ao rodar localmente.
  // private webhookUrl = 'http://localhost:3000/webhook';

  constructor(private http: HttpClient) {
    this.loadTrainerLevel();
  }

  private loadTrainerLevel() {
    const storedLevel = localStorage.getItem(TRAINER_LEVEL_KEY);
    const level = storedLevel ? parseInt(storedLevel, 10) : 0;
    this.trainerLevelSubject.next(level);
  }

  private saveTrainerLevel(level: number) {
    // const previousLevel = this.trainerLevelSubject.value;
    const levelToSave = Math.min(level, MAX_TRAINER_LEVEL);

    localStorage.setItem(TRAINER_LEVEL_KEY, levelToSave.toString());
    this.trainerLevelSubject.next(levelToSave);

    // let eventType: 'level_up' | 'level_down' | null = null;
    // if (levelToSave > previousLevel) {
    //   eventType = 'level_up';
    // } else if (levelToSave < previousLevel) {
    //   eventType = 'level_down';
    // }

    // if (eventType !== null) {
    //   const payload = {
    //     event: eventType,
    //     trainerName: this.getTrainerName(),
    //     trainerGender: this.getTrainerGender(),
    //     fromLevel: previousLevel,
    //     toLevel: levelToSave
    //   };

    //   this.http.post(this.webhookUrl, payload).subscribe();
    // }
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

  getTrainerName(): string | null {
    return localStorage.getItem(TRAINER_NAME_KEY);
  }

  setTrainerGender(gender: 'male' | 'female') {
    localStorage.setItem(TRAINER_GENDER_KEY, gender);
  }

}
