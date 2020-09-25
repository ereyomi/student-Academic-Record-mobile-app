import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable( {
    providedIn: 'root'
} )
export class AppService {

    public selectOptions = new BehaviorSubject( {} );
    constructor() { }
    getSelctionOptions(): Observable<{}> {
        return this.selectOptions.asObservable();
    }
}
