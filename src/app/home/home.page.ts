import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDbService } from '../services/indexed-db.service';
import { LoadingController } from '@ionic/angular';


@Component( {
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: [ 'home.page.scss' ],
} )
export class HomePage implements OnInit {
    schoolSessions: any;
    constructor( private router: Router, private db: IndexedDbService, public loadingController: LoadingController ) { }
    openDetails( routeTo: string ) {
        this.router.navigateByUrl( `/select/${ routeTo }` );
    }
    ngOnInit() {}
    async loadTo( routeToOption: string = 'exam') {
        const loading = await this.loadingController.create( {
            spinner: 'crescent',
            // duration: 2000,
            message: 'Please wait...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        } );
        // return await loading.present();
        await loading.present();
        this.db.getDatabaseState().subscribe( async ready => {
            if ( ready ) {
                console.log( 'db ready: ', ready );
                const isDump = await this.db.isDump();
                console.log( 'aw', isDump );
                if ( isDump === true ) {
                    this.db.loadacademicRecordsData();
                    this.db.getSessionsTermsAndSubjects();

                    loading.dismiss();
                }
            }
        } );

        const { role, data } = await loading.onDidDismiss();
        this.openDetails( routeToOption );

    }
}
