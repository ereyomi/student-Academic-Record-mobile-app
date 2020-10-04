import { AcademicPayloadModel } from '../models/academic-payload-model';

const baseTen = 10; // for radix (check documentation)

export const createUUID = () => {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, ( char ) => {
        dt = Math.floor( dt / 16 );
        // tslint:disable-next-line:no-bitwise
        const r = ( dt + Math.random() * 16 ) % 16 | 0;
        // tslint:disable-next-line:no-bitwise
        return ( char === 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 );
    } );
    return uuid;
};


export const formatAcademicRecordPayload
    = ( {
        id,
        sessionId,
        subjectId,
        termId,
        userId,
        studentId,
        caScore,
        examScore,
        remark,
        offlineStatus,
        addedBy,
        approvedBy,
        createdAt,
        updatedAt
    } ): AcademicPayloadModel => {
        const theStudentId = isNaN( studentId ) ? ( isNaN( userId ) ? 0 : userId ) : studentId;
        return {
            id,
            sessionId: parseInt( sessionId, baseTen ),
            subjectId: parseInt( subjectId, baseTen ),
            termId: parseInt( termId, baseTen ),
            studentId: parseInt( theStudentId, baseTen ),
            caScore: parseInt( caScore, baseTen ),
            examScore: parseInt( examScore, baseTen ),
            remark,
            offlineStatus,
            addedBy: parseInt( addedBy, baseTen ),
            approvedBy: parseInt( approvedBy, baseTen ),
            createdAt,
            updatedAt

        };

    };

export const formatIdRelatedToInt
    = ( {
        sessionId,
        subjectId,
        termId,
        userId,
        caScore,
        examScore,
    } ) => {
        return {
            sessionId: parseInt( sessionId, baseTen ),
            subjectId: parseInt( subjectId, baseTen ),
            termId: parseInt( termId, baseTen ),
            userId: parseInt( userId, baseTen ),
            studentId: parseInt( userId, baseTen ),
            caScore: parseInt( caScore, baseTen ),
            examScore: parseInt( examScore, baseTen ),
        };

    };

export const formatAndpopulateRecord = ( record: any ): AcademicPayloadModel => {
    const { studentId, userId } = record;
    const theStudentId = isNaN( studentId ) ? ( isNaN( userId ) ? 0 : userId ) : studentId;

    record = {
        ...record,
        id: createUUID(),
        remark: 'by teacher',
        offlineStatus: false,
        addedBy: theStudentId,
        approvedBy: 0,
        createdAt: todayDateInUTC(),
        updatedAt: todayDateInUTC(),
    };

    return formatAcademicRecordPayload( record );
};
export const todayDateInUTC = () => {
    const tDate: Date = new Date();
    const utcDate = tDate.toUTCString();
    return utcDate;
};

export const todayDateInISO = () => {
    const tDate: Date = new Date();
    const isoDate = tDate.toISOString();
    return isoDate;
};
