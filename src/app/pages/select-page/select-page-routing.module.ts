import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPagePage } from './select-page.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPagePageRoutingModule {}
