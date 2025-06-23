import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerAreaPage } from './trainer-area.page';

describe('TrainerAreaPage', () => {
  let component: TrainerAreaPage;
  let fixture: ComponentFixture<TrainerAreaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
