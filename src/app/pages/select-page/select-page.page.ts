import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { AppService } from 'src/app/services/app.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Selections } from 'src/app/models/selections';

@Component( {
    selector: 'app-select-page',
    templateUrl: './select-page.page.html',
    styleUrls: [ './select-page.page.scss' ],
} )
export class SelectPagePage implements OnInit {

    selections = {
        sessionsFilter: 'sessions',
        termsFilter: 'terms',
        subjectsFilter: 'subjects',
        viewSubjectResult: 'viewSubjectResult',
    };
    selectionsId = {
        sessionId: 'sessionId',
        termId: 'termId',
        subjectId: 'subjectId',
    };
    selectionForm: FormGroup;

    sessions: any[];

    terms: any[];

    subjects: any[];

    selectionType: string;

    constructor(
        public loadingController: LoadingController,
        private router: Router,
        private route: ActivatedRoute,
        private db: IndexedDbService,
        private fb: FormBuilder,
        private appS: AppService,
        private navCtrl: NavController
    ) { }

    ngOnInit() {
        this.initForm();
        this.route.data.subscribe(
            resolve => {
                const { data } = resolve;
                const { selections, type } = data;
                this.selectionType = type;
                if ( typeof selections === 'undefined' || typeof selections === null || selections.length === 0 ) {
                    this.navCtrl.navigateBack( 'home' );
                } else {
                    this.sessions = this.filterResolvedData( selections, this.selections.sessionsFilter );
                    this.terms = this.filterResolvedData( selections, this.selections.termsFilter );
                    this.subjects = this.filterResolvedData( selections, this.selections.subjectsFilter );
                }

            },
            err => {
                this.navCtrl.navigateBack( 'home' );
            }
        );
    }
    initForm() {
        this.selectionForm = this.fb.group( {
            sessionId: [ '', [ Validators.required ] ],
            termId: [ '', [ Validators.required ] ],
            subjectId: [ '', [ Validators.required ] ],
        } );
    }
    filterResolvedData( selections: any[], filter: any ) {

        const dataToFind = selections.find(
            ( dat: { id: any; } ) => dat.id === filter
        );
        let sortBy = '';
        switch ( filter ) {
            case this.selections.sessionsFilter:
                sortBy = this.selectionsId.sessionId;
                break;
            case this.selections.termsFilter:
                sortBy = this.selectionsId.termId;
                break;
            case this.selections.subjectsFilter:
                sortBy = this.selectionsId.subjectId;
                break;

            default:
                break;
        }
        if ( Object.entries( dataToFind ).length !== 0 ) {
            return dataToFind.data.sort(
                ( a: any, b: any ) => a[ sortBy ] - b[ sortBy ]
            );
        }
    }

    async loadSelection() {

        const loading = await this.loadingController.create( {
            spinner: 'crescent',
            // duration: 2000,
            message: 'Please wait...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        } );
        await loading.present();

        // push selection to appService
        const appServiceData: Selections = {
            type: this.selectionType,
            ...this.selectionForm.value
        };
        this.db.getDatabaseState().subscribe( async ready => {
            if ( ready ) {
                const isDump = await this.db.isDump();
                if ( isDump === true ) {
                    // load students data
                    try {
                        await this.db.loadStudents();
                        await this.appS.loadAcademicRecordsBySelection(appServiceData);
                        this.appS.selectOptions.next(appServiceData);
                    } catch ( error ) {

                    }
                    loading.dismiss();
                }
            }
        } );

        const { role, data } = await loading.onDidDismiss();
        if ( this.selections.viewSubjectResult === this.selectionType ) {
            this.router.navigateByUrl( `/view-result` );
        } else {
            this.router.navigateByUrl( `/record` );
        }


    }

}
