import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const POKEMONS_FOR_LEVEL_UP = 5;
const MAX_TRAINER_LEVEL = 50;

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private trainerLevelSubject = new BehaviorSubject<number>(0);
  public trainerLevel$: Observable<number> = this.trainerLevelSubject.asObservable();
  public trainerNameSubject = new BehaviorSubject<string | null>(null);
  public trainerGenderSubject = new BehaviorSubject<'male' | 'female' | null>(null);

  // Descomente as chamadas ao rodar localmente.
  // private webhookUrl = 'http://localhost:3000/webhook';

  constructor(private http: HttpClient) {
    this.loadTrainerLevel();
  }

  loadTrainerLevel() {
    const trainerId = this.getTrainerId();
    if (!trainerId) {
      this.trainerLevelSubject.next(0);
      return;
    }
    const key = this.getTrainerLevelKey(trainerId);
    const storedLevel = localStorage.getItem(key);
    const level = storedLevel ? parseInt(storedLevel, 10) : 0;
    this.trainerLevelSubject.next(level);
  }

  private saveTrainerLevel(level: number) {
    const trainerId = this.getTrainerId();
    if (!trainerId) {
      return;
    }
    const key = this.getTrainerLevelKey(trainerId);

    // const previousLevel = this.trainerLevelSubject.value;
    const levelToSave = Math.min(level, MAX_TRAINER_LEVEL);

    localStorage.setItem(key, levelToSave.toString());
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

  getTrainerName(): string | null {
    return this.trainerNameSubject.value;
  }

  getTrainerGender(): 'male' | 'female' | null {
    return this.trainerGenderSubject.value;
  }

  loadTrainerInfo() {
    const userId = this.getTrainerId();
    if (userId) {
      this.http.get<{ username: string, gender: 'male' | 'female' }>(`http://localhost:4000/trainer/get-trainer-info?userId=${userId}`)
        .subscribe({
          next: (response) => {
            this.trainerNameSubject.next(response.username);
            this.trainerGenderSubject.next(response.gender);
          },
          error: (error) => {
            console.error('Erro ao carregar informações do treinador', error);
          }
        });
    }
  }

  getTrainerId(): string | null {
    return localStorage.getItem('trainer_id')
  }

  setTrainerId(trainerId: string) {
    localStorage.setItem('trainer_id', trainerId);
  }

  getTrainerLevelKey(trainerId: string): string {
    return `trainer_level_${trainerId}`;
  }
}
