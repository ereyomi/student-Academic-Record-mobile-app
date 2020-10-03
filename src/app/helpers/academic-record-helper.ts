const baseTen = 10; // for radix (check documentation)

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
    } ) => {
        const theStudentId = isNaN( studentId ) ? ( isNaN( userId ) ? 0 : userId) : studentId;
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

