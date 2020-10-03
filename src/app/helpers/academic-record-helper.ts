export const formatAcademicRecordPayload
    = ( {
        sessionId,
        subjectId,
        termId,
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
        const baseTen = 10; // for radix (check documentation)
        return {
            sessionId: parseInt( sessionId, baseTen ),
            subjectId: parseInt( subjectId, baseTen ),
            termId: parseInt( termId, baseTen ),
            studentId: parseInt( studentId, baseTen ),
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
