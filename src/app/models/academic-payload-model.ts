export interface AcademicPayloadModel {
    sessionId: number;
    subjectId: number;
    termId: number;
    studentId: number;
    caScore: number;
    examScore: number;
    remark: string;
    offlineStatus: boolean;
    addedBy: number;
    approvedBy: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}
