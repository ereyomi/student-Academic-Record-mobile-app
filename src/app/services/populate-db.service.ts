import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PopulateDBService {

    private dumpData = new BehaviorSubject( [] );

    private dumpUrl = 'assets/dump.json';

    private dumpReady: BehaviorSubject<boolean> = new BehaviorSubject( false );

    constructor( private http: HttpClient ) {
        this.http.get( this.dumpUrl ).subscribe(
            data => {
                const toDump: any = data;
                this.dumpData.next( toDump );
                this.dumpReady.next( true );
            }
        );
    }
    getDumpState() {
        return this.dumpReady.asObservable();
    }

    getDumpData(): Observable<any[]> {
        return this.dumpData.asObservable();
    }
}
