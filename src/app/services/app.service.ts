import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ObjectStores } from '../enum/objectStores';
import { Operations } from '../enum/operations';
import { formatIdRelatedToInt, formatAndpopulateRecord, formatAcademicRecordPayload } from '../helpers/academic-record-helper';
import { AcademicPayloadModel } from '../models/academic-payload-model';
import { IndexedDbService } from './indexed-db.service';

@Injectable( {
    providedIn: 'root'
} )
export class AppService {
    private subscription: Subscription;
    public selectOptions = new BehaviorSubject( {} );
    constructor( private db: IndexedDbService) { }
    getSelctionOptions(): Observable<{}> {
        return this.selectOptions.asObservable();
    }

    async processAcademicScore( passInPayload: any ) {
        const queryData = formatIdRelatedToInt( passInPayload );
        const { studentId, sessionId, subjectId, termId, examScore, caScore } = queryData;
        let payloadToSave: AcademicPayloadModel = formatAndpopulateRecord( passInPayload );
        console.log( 'payloadToSave: ', payloadToSave );
        try {
            this.subscription = this.db.getAcademicReports().subscribe(
                async ( academicRecords ) => {
                    console.log( 'academicRecords: ', academicRecords );
                    if ( academicRecords.length === 0 ) {
                        // insert data
                        console.log( 'academic record is empty thus am adding this record in as a new one' );
                        await this.db.performDatabaseOperation( ObjectStores.academicRecords, Operations.add, payloadToSave );
                    } else {
                        const checkIfRecordExist = academicRecords.find(
                            ( data ) => data.studentId === studentId &&
                                data.sessionId === sessionId && data.subjectId === subjectId
                                && data.termId === termId
                        );
                        try {
                            if ( typeof checkIfRecordExist === 'undefined' ) {
                                // insert data
                                console.log( 'inserting' );
                                await this.db.performDatabaseOperation( ObjectStores.academicRecords, Operations.add, payloadToSave );
                            } else {
                                // update data
                                const toUpdateRecord: any = {
                                    ...checkIfRecordExist,
                                    examScore,
                                    caScore,
                                };
                                payloadToSave = formatAcademicRecordPayload( toUpdateRecord );
                                console.log( 'updating data' );
                                await this.db.performDatabaseOperation( ObjectStores.academicRecords, Operations.put, payloadToSave );
                            }
                        } catch ( error ) {
                            console.log( 'academic: ', error );
                        }

                    }
                }
            );
            // unsubscribe
            this.subscription.unsubscribe();
            // update academic record
            console.log( 'update Academic record...' );
            await this.db.loadacademicRecordsData();
        } catch ( error ) {
            console.log( 'academic record processing error' );
        }
    }
}
