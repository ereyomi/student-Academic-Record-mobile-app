import { Component } from '@angular/core';

import { LoadingController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IndexedDbService } from './services/indexed-db.service';
import { AppService } from './services/app.service';

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
        private appS: AppService,
        public loadingController: LoadingController,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then( () => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.loadTo();
        } );
    }
    async loadTo(routeToOption: string = 'exam') {
        const loading = await this.loadingController.create({
            spinner: 'crescent',
            // duration: 2000,
            message: 'Please wait...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        });
        // return await loading.present();
        await loading.present();
        this.db.getDatabaseState().subscribe(async ready => {
            if (ready) {
                const isDump = await this.db.isDump();
                console.log('aw', isDump);
                if (isDump === true) {
                    await this.db.loadacademicRecordsData();
                    await this.db.getSessionsTermsAndSubjects();
                    await this.appS.properlySortSelections();
                    console.log('db(dump sucessfull) is ready: ', ready);
                    loading.dismiss();
                } else {
                    console.log('you need to wait while we dump ', ready);
                }
            } else {
                console.log('db is not ready: ', ready);
            }
        });

        const { role, data } = await loading.onDidDismiss();

    }
}
