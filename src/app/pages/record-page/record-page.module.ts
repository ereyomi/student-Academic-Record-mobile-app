import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordPagePageRoutingModule } from './record-page-routing.module';

import { RecordPagePage } from './record-page.page';
import { ScorePage } from 'src/app/layout/score/score.page';
import { ScorePageModule } from 'src/app/layout/score/score.module';

@NgModule( {
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RecordPagePageRoutingModule,
        ScorePageModule,
    ],
    declarations: [
        RecordPagePage,
        // ScorePage
    ]
} )
export class RecordPagePageModule { }
