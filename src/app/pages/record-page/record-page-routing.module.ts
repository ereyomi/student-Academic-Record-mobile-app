import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordPagePage } from './record-page.page';

const routes: Routes = [
  {
    path: '',
    component: RecordPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordPagePageRoutingModule {}
