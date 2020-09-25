import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
/*  */
import { HttpClientModule } from '@angular/common/http';
/* NgRx - Angular state management */
import { StoreModule } from '@ngrx/store';
import { ScorePageModule } from './layout/score/score.module';
import { IndexedDbService } from './services/indexed-db.service';
@NgModule( {
    declarations: [ AppComponent ],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        ScorePageModule,
        HttpClientModule,
        StoreModule.forRoot( {
            // scores: reducer,
        } )
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        IndexedDbService
    ],
    bootstrap: [ AppComponent ]
} )
export class AppModule { }
