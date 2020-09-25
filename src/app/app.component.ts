import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IndexedDbService } from './services/indexed-db.service';

@Component( {
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: [ 'app.component.scss' ]
} )
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private db: IndexedDbService,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then( () => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.db.getDatabaseState().subscribe( async ready => {
                if ( ready ) {
                    const isDump = await this.db.isDump();
                    console.log( 'aw', isDump );
                    if ( isDump === true ) {
                        console.log( 'db(dump sucessfull) is ready: ', ready );
                    } else {
                        console.log( 'you need to wait while we dump ', ready );
                    }
                } else {
                    console.log( 'db is not ready: ', ready );
                }
            } );
        } );
    }
}
