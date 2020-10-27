import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDbService } from '../services/indexed-db.service';
import { LoadingController } from '@ionic/angular';
import { AppService } from '../services/app.service';


@Component( {
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: [ 'home.page.scss' ],
} )
export class HomePage implements OnInit {
    showButtons = false;
    schoolSessions: any;
    constructor(
        private router: Router,
        public loadingController: LoadingController,

    ) { }
    openDetails( routeTo: string ) {
        this.router.navigateByUrl( `/select/${ routeTo }` );
    }
    ngOnInit() {}
     loadTo( routeToOption: string = 'exam') {

        this.openDetails( routeToOption );

    }
}
