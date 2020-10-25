import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { formatIdRelatedToInt, formatSelectionToInt } from 'src/app/helpers/academic-record-helper';
import { Selections } from 'src/app/models/selections';
import { Students } from 'src/app/models/students';
import { AppService } from 'src/app/services/app.service';


@Component({
    selector: 'app-score',
    templateUrl: './score.page.html',
    styleUrls: ['./score.page.scss'],
})
export class ScorePage implements OnInit {
    score = 0;
    @Input() academicReports: any;
    @Input() student: Students;
    @Input() selection: Selections;
    focusStatus = false;
    /*  selection = {
         sessionId: 1,
         subjectId: 1,
         termId: 1,
         type: 'exam'
     }; */
    typeData = {
        examScore: 0,
        caScore: 0,
    };

    constructor(private store: Store<any>, private appS: AppService) { }

    ngOnInit() {
        try {
            this.getPreviousScoreIfExist();
            if (this.selection.type === 'exam') {
                this.score = this.typeData.examScore;
            } else {
                this.score = this.typeData.caScore;
            }
            console.log('score: ', this.score);
        } catch (error) { }
    }
    onInputIt(event: any): void {
        const score: number = event.target.value;
        /*  this.store.dispatch( {
             type: 'UPDATE_SCORE',
             payload: score
         } ); */
        const payload = {
            ...this.selection,
            userId: this.student?.userId ?? 0,
            ...this.scoreProcessing(this.selection.type, score),
        };
        console.log('score processing...', score, payload);
        this.appS.processAcademicScore(payload);
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
    scoreProcessing(type: string, score: any) {
        switch (type) {
            case 'exam':
                this.typeData.examScore = score;
                break;
            case 'ca':
                this.typeData.caScore = score;
                break;
            default:
                break;
        }
        return this.typeData;
    }

    getPreviousScoreIfExist() {
        const selectionFormatToint = formatSelectionToInt(this.selection);
        const checkIfRecordExist = this.academicReports.find(
            (data:
                {
                    studentId: number; sessionId: number; subjectId: number; termId: number;
                }
            ) => data.studentId === this.student.userId &&
            data.sessionId === selectionFormatToint.sessionId && data.subjectId === selectionFormatToint.subjectId
                && data.termId === selectionFormatToint.termId
        );

        if (typeof checkIfRecordExist !== 'undefined') {
            if (checkIfRecordExist.examScore !== '' ||
                typeof checkIfRecordExist.examScore !== null ||
                typeof checkIfRecordExist.examScore !== 'undefined') {
                this.typeData.examScore = checkIfRecordExist.examScore;
            }
            if (checkIfRecordExist.caScore !== '' ||
                typeof checkIfRecordExist.caScore !== null ||
                typeof checkIfRecordExist.caScore !== 'undefined') {
                this.typeData.caScore = checkIfRecordExist.caScore;
            }
        }
        console.log('this.typeData: ', this.typeData, checkIfRecordExist);
    }

}
