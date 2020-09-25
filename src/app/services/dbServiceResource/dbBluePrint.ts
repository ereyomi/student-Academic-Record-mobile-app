export const dbBluePrint = [
    {
        objectStore: 'dump',
        fileindexes: [
            { fileindex: 'dump_id', unique: false },
            { fileindex: 'status', unique: false },
        ],
    },
    {
        objectStore: 'students',
        fileindexes: [
            { fileindex: 'user_id', unique: true },
            { fileindex: 'class_id', unique: false },
            { fileindex: 'first_name', unique: false },
            { fileindex: 'last_name', unique: false },
            { fileindex: 'age', unique: false },
            { fileindex: 'gender', unique: false },
            { fileindex: 'address', unique: false },
            { fileindex: 'email', unique: false },
            { fileindex: 'admission_year', unique: false },
        ],
    },
    {
        objectStore: 'sessions',
        fileindexes: [
            { fileindex: 'session_id', unique: true },
            { fileindex: 'name', unique: false },
        ],
    },
    {
        objectStore: 'terms',
        fileindexes: [
            { fileindex: 'term_id', unique: true },
            { fileindex: 'name', unique: false },
        ],
    },
    {
        objectStore: 'classes',
        fileindexes: [
            { fileindex: 'class_id', unique: true },
            { fileindex: 'name', unique: false },
        ],
    },
    {
        objectStore: 'subjects',
        fileindexes: [
            { fileindex: 'subject_id', unique: true },
            { fileindex: 'name', unique: false },
            { fileindex: 'grade', unique: false },
            { fileindex: 'term', unique: false },
        ],
    },
    {
        objectStore: 'academic_report',
        fileindexes: [
            { fileindex: 'session_id', unique: false },
            { fileindex: 'term_id', unique: false },
            { fileindex: 'class_id', unique: false },
            { fileindex: 'subject_id', unique: false },
            { fileindex: 'student_id', unique: false },
            { fileindex: 'ca_score', unique: false },
            { fileindex: 'exam_score', unique: false },
            { fileindex: 'remark', unique: false },
            { fileindex: 'offline_status', unique: false },
            { fileindex: 'added_by', unique: false },
            { fileindex: 'approved_by', unique: false },
            { fileindex: 'created_at', unique: false },
            { fileindex: 'updated_at', unique: false },
        ],
    },
];
