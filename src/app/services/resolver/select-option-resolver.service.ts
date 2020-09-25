import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IndexedDbService } from '../indexed-db.service';
import { Observable } from 'rxjs';

@Injectable( {
    providedIn: 'root'
} )
export class SelectOptionResolverService implements Resolve<any>{

    selectionData: any[];
    constructor( private db: IndexedDbService ) { }
    async resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Promise<Observable<any> | Promise<any> | any> {
        const type = route.paramMap.get( 'type' );
        this.db.getSelection().subscribe(
            data => {
                this.selectionData = data;
            }
        );
        return {
            type,
            selections: this.selectionData,
        };
    }
}
