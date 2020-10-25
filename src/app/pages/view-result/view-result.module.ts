import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewResultPageRoutingModule } from './view-result-routing.module';

import { ViewResultPage } from './view-result.page';
import { ViewPage } from './view/view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewResultPageRoutingModule
  ],
  declarations: [ViewResultPage, ViewPage]
})
export class ViewResultPageModule {}
