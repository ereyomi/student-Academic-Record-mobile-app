import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultPagePageRoutingModule } from './result-page-routing.module';

import { ResultPagePage } from './result-page.page';
import { HeaderPageModule } from 'src/app/layout/header/header.module';
import { ResultCardDisplayComponent } from './result-card-display/result-card-display.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultPagePageRoutingModule,
    HeaderPageModule
  ],
  declarations: [ResultPagePage, ResultCardDisplayComponent]
})
export class ResultPagePageModule {}
