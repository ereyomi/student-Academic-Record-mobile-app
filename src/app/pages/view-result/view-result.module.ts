import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewResultPageRoutingModule } from './view-result-routing.module';

import { ViewResultPage } from './view-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewResultPageRoutingModule
  ],
  declarations: [ViewResultPage]
})
export class ViewResultPageModule {}
