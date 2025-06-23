import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainerAreaPageRoutingModule } from './trainer-area-routing.module';

import { TrainerAreaPage } from './trainer-area.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainerAreaPageRoutingModule
  ],
  declarations: [TrainerAreaPage]
})
export class TrainerAreaPageModule {}
