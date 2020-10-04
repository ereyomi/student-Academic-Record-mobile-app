import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { NavController } from '@ionic/angular';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { Selections } from 'src/app/models/selections';

@Component( {
    selector: 'app-record-page',
    templateUrl: './record-page.page.html',
    styleUrls: [ './record-page.page.scss' ],
} )
export class RecordPagePage implements OnInit {
    notAvailable = 0;
    appSelection: any;
    students: any[];
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
        this.db.getDatabaseState().subscribe( async ready => {
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
        } );
    }

    myInit() {
        this.appS.getSelctionOptions().subscribe( appDataSelection => {
            console.log( appDataSelection );
            const getObjectAvailability = Object.entries( appDataSelection ).length;
            console.log( getObjectAvailability );
            if ( getObjectAvailability === this.notAvailable ) {
                this.goBackHome();
            } else {
                this.appSelection = appDataSelection;
                this.db.getStudents().subscribe( students => {
                    console.log( 'Recording for this students: ', students );
                    if ( students.length !== 0 ) {
                        this.students = students;
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

}
