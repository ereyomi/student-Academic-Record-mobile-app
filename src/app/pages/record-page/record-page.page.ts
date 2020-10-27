import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { NavController } from '@ionic/angular';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { Observable } from 'rxjs';

@Component( {
    selector: 'app-record-page',
    templateUrl: './record-page.page.html',
    styleUrls: [ './record-page.page.scss' ],
} )
export class RecordPagePage implements OnInit {

    academicReports$: Observable<any> = this.appS.academicRecordsBySelection;
    sessions$: Observable<any> = this.appS.sessions;

    terms$: Observable<any> = this.appS.terms;

    subjects$: Observable<any> = this.appS.subjects;
    notAvailable = 0;
    appSelection: any;
    students: any[];
    header: { title: string; subTitle: string; } = {
        title: 'RECORD',
        subTitle: '',
    };
    /* students = [
        {
            address: 'Ereyomi has no address',
            admissionYear: '2019/2020',
            age: 24,
            class: 'JSS1',
            email: 'ereyomioluwaseyi@gmail.com',
            firstName: 'Ereyomi',
            gender: 'male',
            id: '70b3b10a-ee23-46c1-9aad-3f3099422f8c',
            lastName: 'Samuel',
            userId: 2,
        }, {
            address: 'Ereyomi has no address',
            admission_year: '2019/2020',
            age: 20,
            classId: 1,
            email: 'ereyomioluwaseyi@gmail.com',
            firstName: 'Another',
            gender: 'female',
            id: '31151873-0f00-466b-8451-bda9134643bd',
            lastName: 'Student',
            userId: 3
        }
    ]; */
    constructor(
        private appS: AppService,
        private navCtrl: NavController,
        private db: IndexedDbService,
    ) { }

    ngOnInit() {
        /* this.db.getDatabaseState().subscribe( async ready => {
            if ( ready ) {
                console.log( 'db ready: ', ready );
                const isDump = await this.db.isDump();
                console.log( 'aw', isDump );
                if ( isDump === true ) {
                    console.log( 'initiate academic record' );
                    this.db.loadacademicRecordsData();
                    this.myInit();
                }
            }
        } ); */
        this.myInit();
    }

    myInit() {
        this.appS.getSelctionOptions().subscribe( appDataSelection => {
            const getObjectAvailability = Object.entries( appDataSelection ).length;
            if ( getObjectAvailability === this.notAvailable ) {
                this.goBackHome();
            } else {
                this.appSelection = appDataSelection;
                this.db.getStudents().subscribe( students => {
                    if ( students.length !== 0 ) {
                        this.students = students;
                        this.getHeader();
                    } else {
                        this.goBackHome();
                    }
                } );
            }
        } );
    }
    goBackHome() {
        this.navCtrl.navigateBack( 'home' );
    }
    getHeader() {
        switch (this.appSelection.type) {
            case 'exam':
                this.header.subTitle = 'EXAM SCORE';
                break;
            case 'ca':
                this.header.subTitle = 'CA SCORE';
                break;
            default:
                break;
        }
    }

}
