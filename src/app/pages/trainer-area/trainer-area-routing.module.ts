import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainerAreaPage } from './trainer-area.page';

const routes: Routes = [
  {
    path: '',
    component: TrainerAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainerAreaPageRoutingModule {}
