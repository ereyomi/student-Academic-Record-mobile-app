import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Students } from 'src/app/models/students';
import { IndexedDbService } from 'src/app/services/indexed-db.service';


@Component( {
    selector: 'app-score',
    templateUrl: './score.page.html',
    styleUrls: [ './score.page.scss' ],
} )
export class ScorePage implements OnInit {
    @Input() student: Students;
    focusStatus = false;
    selection = {
        sessionSelection: '2',
        subjectSelection: '3',
        termSelection: '3',
        type: 'exam'
    };
    constructor( private store: Store<any>, private db: IndexedDbService ) { }

    ngOnInit() {
        console.log( this.student );
    }
    onInputIt( event: any ): void {
        const score: number = event.target.value;
        /*  this.store.dispatch( {
             type: 'UPDATE_SCORE',
             payload: score
         } ); */
        console.log( 'score: ', score );
        this.db.processAcademicScore();
    }

    onFocusIt() {
        this.focusStatus = true;
    }
    onBlurIt() {
        this.focusStatus = false;
        /* this.store.pipe( select( 'scores' ) ).subscribe( data => {
            if ( data ) {
                console.log( data );
            } else {
                console.log( 'no state', data );
            }
        } ); */
    }

}
