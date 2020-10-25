import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ObjectStores } from '../enum/objectStores';
import { Operations } from '../enum/operations';
import { formatIdRelatedToInt, formatAndpopulateRecord, formatAcademicRecordPayload, formatSelectionToInt } from '../helpers/academic-record-helper';
import { AcademicPayloadModel } from '../models/academic-payload-model';
import { Selections } from '../models/selections';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private subscription: Subscription;
    public selectOptions = new BehaviorSubject({});

    public academicRecordsBySelection: BehaviorSubject<any[]> = new BehaviorSubject([]);
    constructor(private db: IndexedDbService, private navCtrl: NavController) { }
    getSelctionOptions(): Observable<{}> {
        return this.selectOptions.asObservable();
    }
    goBackHome() {
        this.navCtrl.navigateBack('home');
    }
    async processAcademicScore(passInPayload: any) {
        const queryData = formatIdRelatedToInt(passInPayload);
        const { studentId, sessionId, subjectId, termId, examScore, caScore } = queryData;
        let payloadToSave: AcademicPayloadModel = formatAndpopulateRecord(passInPayload);
        try {
            this.subscription = this.db.getAcademicReports().subscribe(
                async (academicRecords) => {
                    if (academicRecords.length === 0) {
                        // insert data ::: on error -> academic record is empty thus am adding this record in as a new one
                        await this.db.performDatabaseOperation(ObjectStores.academicRecords, Operations.add, payloadToSave);
                    } else {
                        const checkIfRecordExist = academicRecords.find(
                            (data) => data.studentId === studentId &&
                                data.sessionId === sessionId && data.subjectId === subjectId
                                && data.termId === termId
                        );
                        try {
                            if (typeof checkIfRecordExist === 'undefined') {
                                // insert data
                                await this.db.performDatabaseOperation(ObjectStores.academicRecords, Operations.add, payloadToSave);
                            } else {
                                // update data
                                const toUpdateRecord: any = {
                                    ...checkIfRecordExist,
                                    examScore,
                                    caScore,
                                };
                                console.log('toUpdateRecord:', toUpdateRecord);
                                payloadToSave = formatAcademicRecordPayload(toUpdateRecord);
                                await this.db.performDatabaseOperation(ObjectStores.academicRecords, Operations.put, payloadToSave);
                            }
                        } catch (error) {
                            // process error
                        }

                    }
                }
            );
            // unsubscribe
            this.subscription.unsubscribe();
            // update academic record
            await this.db.loadacademicRecordsData();
        } catch (error) {
            // academic record processing error
        }
    }

    async loadAcademicRecordsBySelection(selctions: any) {
        const formatedSelection = formatSelectionToInt(selctions);
        const { sessionId, subjectId, termId } = formatedSelection;
        console.log('loadAcademicRecordsBySelection');
        try {
            this.subscription = this.db.getAcademicReports().subscribe(
                async (academicRecords) => {
                    if (academicRecords.length === 0) {
                        // tell users that they have no academic record
                        console.log('acadea: ', academicRecords);
                    } else {
                        const checkIfRecordExist = academicRecords.filter(
                            (data) => data.sessionId === sessionId && data.subjectId === subjectId
                                && data.termId === termId
                        );
                        try {
                            if (checkIfRecordExist.length === 0) {
                                // tell user to contact admin
                                console.log('null: ', checkIfRecordExist);
                            } else {
                                // pass data academics by selection observable

                                this.academicRecordsBySelection.next(checkIfRecordExist);
                            }
                        } catch (error) {
                        }

                    }
                }
            );
        }catch (e){}
    }
}
