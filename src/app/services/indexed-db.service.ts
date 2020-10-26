import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { dbBluePrint } from './dbServiceResource/dbBluePrint';
import { PopulateDBService } from './populate-db.service';
import { Operations } from 'src/app/enum/operations';
import { ObjectStores } from 'src/app/enum/objectStores';
import { createUUID } from '../helpers/academic-record-helper';
@Injectable({
    providedIn: 'root'
})

export class IndexedDbService {
    private dbVersion = 1;
    private dbName = 'academicRecord';

    private indexedDbObject = window.indexedDB;
    private indexedDbtran = window.IDBTransaction;

    private indexedDatabase: any;

    private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private dumpReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private selection = new BehaviorSubject([]);
    private students: BehaviorSubject<any[]> = new BehaviorSubject([]);
    private academicRecords = new BehaviorSubject([]);

    constructor(private plf: Platform, private dump: PopulateDBService) {
        this.plf.ready().then(async () => {
            this.openDb();
        });
    }
    openDb() {
        /* ObjectStore is same as table in mysql and fileIndex is a column * /

        /* myfileindex is and array of object --
        k = [{fileindex: 'me', unique: true}, {fileindex: 'hmmm', unique: false}];
        */

        // check if application support indexed Database
        if (!this.indexedDbObject) {
            console.log('Your App doesnt support indexedDB');
            return;
        }

        // open database
        this.indexedDatabase = this.indexedDbObject.open(this.dbName, this.dbVersion);
        // continue process
        this.indexedDatabase.onupgradeneeded = async () => {
            const db = this.indexedDatabase.result;

            try {
                dbBluePrint.forEach((data) => {
                    const store = db.createObjectStore(
                        data.objectStore,
                        {
                            keyPath: 'id',
                            autoIncrement: true
                        }
                    );
                    [...data.fileindexes].forEach((aFileIdx: any) => {
                        store.createIndex(`${ aFileIdx.fileindex }`, `${ aFileIdx.fileindex }`, { unique: aFileIdx.unique });
                    });
                });

                // dump data
                this.dumpData();

            } catch (error) {

            }
        };
        this.indexedDatabase.onsuccess = () => {
            this.getSessionsTermsAndSubjects();
            this.dbReady.next(true);
        };
        this.indexedDatabase.onerror = () => {
            return;
        };
    }

    getDbReady() {
        this.dbReady.next(true);
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
                if (isReady) {
                    this.dump.getDumpData().subscribe(
                        async dumpData => {
                            try {
                                await this.multipleInsert(dumpData);
                                this.getSessionsTermsAndSubjects();
                                await this.loadStudents();
                                await this.loadacademicRecordsData();
                                this.dbReady.next(true);
                            } catch (error) {

                            }

                        }
                    );
                    // database is Ready
                    this.dumpReady.next(true);
                }
            }
        );
    }
    async isDump() {
        this.openDb();
        const openmydb = this.indexedDatabase;
        console.log('isDumping');
        return new Promise((resolve, reject) => {
            openmydb.onsuccess = async () => {
                const dataBase = openmydb.result;
                const tx = await dataBase.transaction('dump', 'readwrite')
                    .objectStore('dump')
                    .openCursor();
                tx.onsuccess = (event: any) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        // cursor.continue();
                        resolve(cursor.value.status);
                    }
                };
                tx.onerror = () => { };
            };
        });
    }

    async multipleInsert(data: any) {
        /* myfileindex is and array of object --
          k = [{fileindex: 'me', unique: true}, {fileindex: 'hmmm', unique: false}];
        */
        const openmydb = this.indexedDatabase;
        openmydb.onsuccess = async () => {
            const dataBase = openmydb.result;
            for (const aData of data) {
                console.log(aData);
                try {
                    const { objectStoreName, ...otherData } = aData;
                    const toDumpData = otherData.data;
                    const tx = dataBase.transaction(objectStoreName, 'readwrite');
                    const store = tx.objectStore(objectStoreName);
                    for (const toSaveData of toDumpData) {
                        const inserting = await store.add({ id: createUUID(), ...toSaveData });
                        inserting.onsuccess = () => console.log('insert result success', objectStoreName);
                        inserting.onerror = (e: any) => console.log(e);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };

    }
    async getSessionsTermsAndSubjects(objectStoreNames: string[] = ['sessions', 'terms', 'subjects']) {
        this.openDb();
        const openmydb = this.indexedDatabase;
        openmydb.onsuccess = () => {
            const dataBase = openmydb.result;
            Promise.all(
                objectStoreNames.map(objectStoreName => {
                    return new Promise(async (resolve, reject) => {
                        const get = await dataBase.transaction(objectStoreName, 'readwrite')
                            .objectStore(objectStoreName).getAll();
                        get.onsuccess = (event: { target: { result: any; }; }) => {
                            const d = {
                                id: objectStoreName,
                                data: event.target.result
                            };
                            resolve(d);
                        };
                        get.onerror = () => {
                            reject('errrr');
                        };
                    });

                })
            )
                .then(dataa => {
                    console.log(dataa);
                    this.selection.next(dataa);
                });
        };

    }

    async performDatabaseOperation(objectStoreName: string, typeOfOperation: string, passIndata: any = {}) {
        this.openDb();
        const openmydb = this.indexedDatabase;
        const theData: any[] = [];
        openmydb.onsuccess = async () => {
            const dataBase = openmydb.result;
            /* const tx = await dataBase.transaction( objectStoreName, 'readwrite' )
                .objectStore( objectStoreName ).openCursor(); */
            let trans: any;
            try {
                const tx = await dataBase.transaction(objectStoreName, 'readwrite')
                    .objectStore(objectStoreName);

                switch (typeOfOperation) {
                    case Operations.openCursor:
                        trans = tx.openCursor();
                        break;
                    case Operations.getAll:
                        trans = tx.getAll();
                        break;
                    case Operations.put:
                        trans = tx.put(passIndata);
                        break;
                    case Operations.add:
                        trans = tx.add(passIndata);
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.log(error);
            }

            console.log('performing operation');
            trans.onsuccess = async (event: any) => {
                switch (typeOfOperation) {
                    case Operations.openCursor:
                        const cursor = event.target.result;
                        if (cursor) {
                            theData.push(cursor.value);
                            cursor.continue();
                        } else {
                            this.dataSaverSwitch(objectStoreName, theData);
                        }
                        break;
                    case Operations.getAll:
                        theData.push(...trans.result);
                        break;
                    case Operations.put:
                        console.log('successfully updated: ', event.target.result);
                        break;
                    case Operations.add:
                        console.log('added: ', event.target.result);
                        break;
                    default:
                        break;
                }

            };
            trans.onerror = (error: any) => {
                console.log('processed Data error', error);
            };
        };
    }
    dataSaverSwitch(objectStoreName: string, data: any) {
        switch (objectStoreName) {
            case ObjectStores.academicRecords:
                this.academicRecords.next(data);
                break;
            case ObjectStores.students:
                this.students.next(data);
                break;
            default:
                break;
        }
        return true;
    }

    async loadStudents() {
        this.performDatabaseOperation(ObjectStores.students, Operations.openCursor);
    }
    async loadDataAgain(objectStore: string, operation: string) {
        await this.performDatabaseOperation(objectStore, operation);
    }
    async loadacademicRecordsData() {
        await this.performDatabaseOperation(ObjectStores.academicRecords, Operations.openCursor);
    }

}
