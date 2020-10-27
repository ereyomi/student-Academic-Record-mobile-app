import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { AppService } from 'src/app/services/app.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Selections } from 'src/app/models/selections';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-select-page',
    templateUrl: './select-page.page.html',
    styleUrls: ['./select-page.page.scss'],
})
export class SelectPagePage implements OnInit {
    header = {
        title: 'SELECT',
        subTitle: '',
    };
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

    sessions$: Observable<any> = this.appS.sessions;

    terms$: Observable<any> = this.appS.terms;

    subjects$: Observable<any> = this.appS.subjects;

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
                this.selectionType = data.type;
            },
            err => {
                this.navCtrl.navigateBack('home');
            }
        );
    }
    initForm() {
        this.selectionForm = this.fb.group({
            sessionId: ['', [Validators.required]],
            termId: ['', [Validators.required]],
            subjectId: ['', [Validators.required]],
        });
    }
    async loadSelection() {

        const loading = await this.loadingController.create({
            spinner: 'crescent',
            // duration: 2000,
            message: 'Please wait...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        });
        await loading.present();

        // push selection to appService
        const appServiceData: Selections = {
            type: this.selectionType,
            ...this.selectionForm.value
        };
        this.db.getDatabaseState().subscribe(async ready => {
            if (ready) {
                const isDump = await this.db.isDump();
                if (isDump === true) {
                    // load students data
                    try {
                        await this.db.loadStudents();
                        /* this is for viewing that selection result */
                        await this.appS.loadAcademicRecordsBySelection(appServiceData);
                        /*  */
                        this.appS.selectOptions.next(appServiceData);
                    } catch (error) {

                    }
                    loading.dismiss();
                }
            }
        });

        const { role, data } = await loading.onDidDismiss();
        if (this.selections.viewSubjectResult === this.selectionType) {
            this.router.navigateByUrl(`/result`);
        } else {
            this.router.navigateByUrl(`/record`);
        }


    }

}
