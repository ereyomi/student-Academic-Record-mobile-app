export const dbBluePrint = [
    {
        objectStore: 'dump',
        fileindexes: [
            { fileindex: 'dumpId', unique: false },
            { fileindex: 'status', unique: false },
        ],
    },
    {
        objectStore: 'students',
        fileindexes: [
            { fileindex: 'userId', unique: true },
            { fileindex: 'classId', unique: false },
            { fileindex: 'firstName', unique: false },
            { fileindex: 'lastName', unique: false },
            { fileindex: 'age', unique: false },
            { fileindex: 'gender', unique: false },
            { fileindex: 'address', unique: false },
            { fileindex: 'email', unique: false },
            { fileindex: 'admissionYear', unique: false },
        ],
    },
    {
        objectStore: 'sessions',
        fileindexes: [
            { fileindex: 'sessionId', unique: true },
            { fileindex: 'name', unique: false },
        ],
    },
    {
        objectStore: 'terms',
        fileindexes: [
            { fileindex: 'termId', unique: true },
            { fileindex: 'name', unique: false },
        ],
    },
    {
        objectStore: 'classes',
        fileindexes: [
            { fileindex: 'classId', unique: true },
            { fileindex: 'name', unique: false },
        ],
    },
    {
        objectStore: 'subjects',
        fileindexes: [
            { fileindex: 'subjectId', unique: true },
            { fileindex: 'name', unique: false },
            { fileindex: 'grade', unique: false },
            { fileindex: 'term', unique: false },
        ],
    },
    {
        objectStore: 'academic_report',
        fileindexes: [
            { fileindex: 'sessionId', unique: false },
            { fileindex: 'termId', unique: false },
            { fileindex: 'classId', unique: false },
            { fileindex: 'subjectId', unique: false },
            { fileindex: 'studentId', unique: false },
            { fileindex: 'caScore', unique: false },
            { fileindex: 'examScore', unique: false },
            { fileindex: 'remark', unique: false },
            { fileindex: 'offlineStatus', unique: false },
            { fileindex: 'addedBy', unique: false },
            { fileindex: 'approvedBy', unique: false },
            { fileindex: 'createdAt', unique: false },
            { fileindex: 'updatedAt', unique: false },
        ],
    },
];
