import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScorePageRoutingModule } from './score-routing.module';

import { ScorePage } from './score.page';


/* NgRx - Angular state management */
import { StoreModule } from '@ngrx/store';
import { reducer } from 'src/app/state/scores.reducer';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
        IonicModule,
        ScorePageRoutingModule,
    StoreModule.forFeature( 'scores', reducer ),
    ],
    declarations: [ ScorePage ],
    exports: [ ScorePage ],

})
export class ScorePageModule {}
