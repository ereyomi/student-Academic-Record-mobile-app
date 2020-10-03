import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { dbBluePrint } from './dbServiceResource/dbBluePrint';
import { PopulateDBService } from './populate-db.service';
import { Operations } from 'src/app/enum/operations';
import { ObjectStores } from 'src/app/enum/objectStores';
@Injectable( {
    providedIn: 'root'
} )

export class IndexedDbService {
    private dbVersion = 1;
    private dbName = 'academicRecord';

    private indexedDbObject = window.indexedDB;
    private indexedDbtran = window.IDBTransaction;

    private indexedDatabase: any;

    private dbReady: BehaviorSubject<boolean> = new BehaviorSubject( false );
    private dumpReady: BehaviorSubject<boolean> = new BehaviorSubject( false );
    private selection = new BehaviorSubject( [] );
    private students: BehaviorSubject<any[]> = new BehaviorSubject( [] );
    private academicRecords = new BehaviorSubject( [] );

    constructor( private plf: Platform, private dump: PopulateDBService ) {
        this.plf.ready().then( async () => {
            this.openDb();
        } );
    }
    openDb() {
        /* ObjectStore is same as table in mysql and fileIndex is a column * /

        /* myfileindex is and array of object --
        k = [{fileindex: 'me', unique: true}, {fileindex: 'hmmm', unique: false}];
        */

        // check if application support indexed Database
        if ( !this.indexedDbObject ) {
            console.log( 'Your App doesnt support indexedDB' );
            return;
        }

        // open database
        this.indexedDatabase = this.indexedDbObject.open( this.dbName, this.dbVersion );
        // continue process
        this.indexedDatabase.onupgradeneeded = async () => {
            const db = this.indexedDatabase.result;

            try {
                dbBluePrint.forEach( ( data ) => {
                    const store = db.createObjectStore(
                        data.objectStore,
                        {
                            keyPath: 'id',
                            autoIncrement: true
                        }
                    );
                    [ ...data.fileindexes ].forEach( ( aFileIdx: any ) => {
                        store.createIndex( `${ aFileIdx.fileindex }`, `${ aFileIdx.fileindex }`, { unique: aFileIdx.unique } );
                    } );
                } );

                // dump data
                this.dumpData();

            } catch ( error ) {

            }
        };
        this.indexedDatabase.onsuccess = () => {
            console.log( 'database created' );
            this.getSessionsTermsAndSubjects();
            this.dbReady.next( true );
        };
        this.indexedDatabase.onerror = () => {
            console.log( 'database error' );
            return;
        };
    }

    getDbReady() {
        this.dbReady.next( true );
    }

    getDatabaseState() {
        return this.dbReady.asObservable();
    }
    getSelection(): Observable<any[]> {
        return this.selection.asObservable();
    }
    getIsDumpState(): Observable<boolean> {
        return this.dumpReady.asObservable();
    }
    getStudents(): Observable<any[]> {
        return this.students.asObservable();
    }
    getAcademicReports(): Observable<any[]> {
        return this.academicRecords.asObservable();
    }
    dumpData() {
        this.dump.getDumpState().subscribe(
            isReady => {
                if ( isReady ) {
                    this.dump.getDumpData().subscribe(
                        async dumpData => {
                            try {
                                await this.multipleInsert( dumpData );
                                this.getSessionsTermsAndSubjects();
                                await this.loadStudents();
                                this.dbReady.next( true );
                            } catch ( error ) {

                            }

                        }
                    );
                    // database is Ready
                    this.dumpReady.next( true );
                }
            }
        );
    }
    async isDump() {
        this.openDb();
        const openmydb = this.indexedDatabase;
        console.log( 'isDumping' );
        return new Promise( ( resolve, reject ) => {
            openmydb.onsuccess = async () => {
                const dataBase = openmydb.result;
                const tx = await dataBase.transaction( 'dump', 'readwrite' )
                    .objectStore( 'dump' )
                    .openCursor();
                tx.onsuccess = ( event: any ) => {
                    const cursor = event.target.result;
                    if ( cursor ) {
                        // cursor.continue();
                        console.log( cursor.value.status );
                        resolve( cursor.value.status );
                    }
                };
                tx.onerror = () => {
                    console.log( 'isDump.error' );
                };
            };
        } );
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
        return uuid;
    }
    async multipleInsert( data: any ) {
        /* myfileindex is and array of object --
          k = [{fileindex: 'me', unique: true}, {fileindex: 'hmmm', unique: false}];
        */
        const openmydb = this.indexedDatabase;
        openmydb.onsuccess = async () => {
            const dataBase = openmydb.result;
            for ( const aData of data ) {
                console.log( aData );
                try {
                    const { objectStoreName, ...otherData } = aData;
                    const toDumpData = otherData.data;
                    const tx = dataBase.transaction( objectStoreName, 'readwrite' );
                    const store = tx.objectStore( objectStoreName );
                    for ( const toSaveData of toDumpData ) {
                        const inserting = await store.add( { id: this.createUUID(), ...toSaveData } );
                        inserting.onsuccess = () => console.log( 'insert result success', objectStoreName );
                        inserting.onerror = ( e: any ) => console.log( e );
                    }
                } catch ( error ) {
                    console.log( error );
                }
            }
        };

    }
    async getSessionsTermsAndSubjects( objectStoreNames: string[] = [ 'sessions', 'terms', 'subjects' ] ) {
        this.openDb();
        const openmydb = this.indexedDatabase;
        openmydb.onsuccess = () => {
            const dataBase = openmydb.result;
            Promise.all(
                objectStoreNames.map( objectStoreName => {
                    return new Promise( async ( resolve, reject ) => {
                        const get = await dataBase.transaction( objectStoreName, 'readwrite' )
                            .objectStore( objectStoreName ).getAll();
                        get.onsuccess = ( event: { target: { result: any; }; } ) => {
                            const d = {
                                id: objectStoreName,
                                data: event.target.result
                            };
                            resolve( d );
                        };
                        get.onerror = () => {
                            reject( 'errrr' );
                        };
                    } );

                } )
            )
                .then( dataa => {
                    console.log( dataa );
                    this.selection.next( dataa );
                } );
        };

    }
    async loadStudents() {
        this.openDb();
        const openmydb = this.indexedDatabase;
        const objectStoreName = 'students';
        openmydb.onsuccess = () => {
            const dataBase = openmydb.result;
            return new Promise( async ( resolve, reject ) => {
                const toSendData: any[] = [];
                const tx = await dataBase.transaction( objectStoreName, 'readwrite' )
                    .objectStore( objectStoreName ).openCursor();
                tx.onsuccess = ( event: any ) => {
                    const cursor = event.target.result;
                    if ( cursor ) {
                        console.log( cursor.value );
                        toSendData.push( cursor.value );
                        cursor.continue();
                    } else {
                        console.log( 'studnets', toSendData );
                        this.students.next( toSendData );
                        resolve( toSendData );
                    }
                };
                tx.onerror = () => {
                    console.log( 'txyghv.result' );
                };
            } );
        };

    }

    async performDatabaseOperation( objectStoreName: string, type: string, passIndata: any = {} ) {
        this.openDb();
        const openmydb = this.indexedDatabase;
        const theData: any[] = [];
        openmydb.onsuccess = async () => {
            const dataBase = openmydb.result;
            const tx = await dataBase.transaction( objectStoreName, 'readwrite' )
                .objectStore( objectStoreName );
            let trans: any;
            switch ( type ) {
                case Operations.openCursor:
                    trans = tx.openCursor();
                    break;
                case Operations.getAll:
                    trans = tx.getAll();
                    break;
                case Operations.put:
                    trans = tx.put( passIndata );
                    break;
                case Operations.add:
                    trans = tx.add( { id: this.createUUID(), ...passIndata } );
                    break;
                default:
                    break;
            }
            /* const tx = await dataBase.transaction( objectStoreName, 'readwrite' )
                .objectStore( objectStoreName ).openCursor(); */
            console.log( 'performing operation' );
            trans.onsuccess = ( event: any ) => {
                switch ( type ) {
                    case Operations.openCursor:
                        const cursor = event.target.result;
                        if ( cursor ) {
                            console.log( cursor.value );
                            theData.push( cursor.value );
                            cursor.continue();
                        } else {
                            this.dataSaverSwitch( objectStoreName, theData );
                            return theData;
                        }
                        break;
                    case Operations.getAll:
                        theData.push( ...trans.result );
                        break;
                    case Operations.put:
                        console.log( 'successfully updated: ', event.target.result );
                        break;
                    case Operations.add:
                        console.log( 'added: ', event.target.result );
                        break;
                    default:
                        break;
                }
                this.dataSaverSwitch( objectStoreName, theData );

            };
            trans.onerror = ( error: any ) => {
                console.log( 'processed Data error', error );
            };
        };
    }
    dataSaverSwitch( objectStoreName: string, data: any ) {
        switch ( objectStoreName ) {
            case ObjectStores.academicRecords:
                this.academicRecords.next( data );
                break;
            case ObjectStores.students:
                this.students.next( data );
                break;
            default:
                break;
        }
        return true;
    }
    async loadacademicRecordsData() {
        await this.performDatabaseOperation( ObjectStores.academicRecords, Operations.openCursor );
    }

    async processAcademicScore( payload: any ) {
        const { userId, sessionId, subjectId, termId, type, score } = payload;
        this.academicRecords.subscribe(
            academicRecords => {
                if ( academicRecords.length === 0 ) {
                    // insert data
                } else {
                    console.log( 'academicRecords: ', academicRecords );
                    const checkIfRecordExist = academicRecords.filter(
                        ( data ) => data.studentId === userId &&
                            data.sessionId === sessionId && data.subjectId === subjectId
                            && data.termId === termId
                    );
                    if ( typeof checkIfRecordExist === 'undefined') {
                        console.log( 'hmmm I didnt get any data' );
                        // insert data
                    } else {
                        console.log( 'do you get a data: ', checkIfRecordExist );
                        // update data
                    }

                }

                // this.updateData( { ...filterIt[ 0 ], examScore: score } );
            }
        );
    }
    async insertStudentAcademicReport( data: {} ) {
        this.openDb();
        const openmydb = this.indexedDatabase;
        const objectStoreName = 'academic_report';
        openmydb.onsuccess = () => {
            const dataBase = openmydb.result;
            return new Promise( async ( resolve, reject ) => {
                const tx = await dataBase.transaction( objectStoreName, 'readwrite' )
                    .objectStore( objectStoreName ).add( { id: this.createUUID(), ...data } );
                tx.onsuccess = ( event: any ) => {
                    const txSuccess = event.target.result;
                    console.log( txSuccess );
                };
                tx.onerror = () => {
                    console.log( 'error while trying to insert academic record' );
                };

            } );
        };

    }
}
