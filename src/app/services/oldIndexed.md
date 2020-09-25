import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable( {
    providedIn: 'root'
} )

export class IndexedDbService {
    private uniqueId: any;
    private dbVersion = 1;
    private dbName = 'academicRecord';

    private indexedDbObject = window.indexedDB;
    private indexedDbtran = window.IDBTransaction;

    private indexedDatabase: any;

    private dbReady: BehaviorSubject<boolean> = new BehaviorSubject( false );

    constructor( private plf: Platform ) {

        /* ObjectStore is same as table in mysql and fileIndex is a column * /

        /* myfileindex is and array of object --
        k = [{fileindex: 'me', unique: true}, {fileindex: 'hmmm', unique: false}];
        */
        this.plf.ready().then( () => {
            // check if application support indexed Database
            if ( !this.indexedDbObject ) {
                console.log( 'Your App doesnt support indexedDB' );
                return;
            }

            // open database
            const openDb = this.indexedDbObject.open( this.dbName, this.dbVersion );
            /* openDb.onsuccess = () => {
                console.log( 'database created' );
            };
            openDb.onerror = () => {
                console.log( 'database error' );
                return;
            }; */
            // continue process
            openDb.onupgradeneeded = () => {
                const db = openDb.result;

                const dbObjectStore = db.createObjectStore(
                    'users',
                    {
                        keyPath: 'id',
                        autoIncrement: true
                    }
                );
                dbObjectStore.createIndex( 'name', 'name', { unique: false } );
                console.log( 'database ok' );
            };
            this.indexedDatabase = openDb;

            // database is Ready
            this.dbReady.next( true );
        } );
    }

    getDbReady() {
        this.dbReady.next( true );
    }
    addUser() {
        this.dbReady.next( true );
    }

    getDatabaseState() {
        return this.dbReady.asObservable();
    }
    getStoreIndexedDb( objectStoreName: string, passedInDatabase: any = this.indexedDatabase ) {
        // table is same as objectStore
        const database: any = {};
        /* if (this.DB) {
          passedInDatabase = this.DB;
        } */
        database.db = passedInDatabase.result;
        database.tx = database.db.transaction( objectStoreName, 'readwrite' );
        database.store = database.tx.objectStore( objectStoreName );
        /* this is not need as there might be multiple fileindex (column -mysql) */
        // database.index = database.store.index(fileindex);
        return database;
    }

    createUUID() {
        let dt = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, ( char ) => {
            dt = Math.floor( dt / 16 );
            // tslint:disable-next-line:no-bitwise
            const r = ( dt + Math.random() * 16 ) % 16 | 0;
            // tslint:disable-next-line:no-bitwise
            return ( char === 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 );
        } );

        console.log( 'uniqueid: ', uuid );
        return uuid;
    }

    async insert( data: any ) {
        /* myfileindex is and array of object --
          k = [{fileindex: 'me', unique: true}, {fileindex: 'hmmm', unique: false}];
        */

        const { objectStoreName, fileindex, id, ...otherData } = data;
        // generate unique ID

        const toSaveData = {
            id: this.createUUID(),
            ...otherData
        };
        return new Promise( ( resolve: any, reject: any ) => {
            const openmydb = this.indexedDatabase;
            openmydb.onsuccess = async () => {
                const getdb = await this.getStoreIndexedDb( objectStoreName );
                const inserting = getdb.store.add( toSaveData );
                inserting.onsuccess = () => resolve( inserting.result );
                inserting.onerror = ( e: any ) => reject( e );
                console.log( 'inserted sucessfully.lll.. ' );
            };
            openmydb.onerror = () => {
                console.log( 'an error occur while trying to connect to indexedBD' );
                return { error: `an error occur while trying to getAll data from ${ objectStoreName }` };
            };
        } );
    }
}
