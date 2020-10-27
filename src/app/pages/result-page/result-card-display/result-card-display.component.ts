import { Component, Input, OnInit } from '@angular/core';
import { Students } from 'src/app/models/students';

@Component({
  selector: 'app-result-card-display',
  templateUrl: './result-card-display.component.html',
  styleUrls: ['./result-card-display.component.scss'],
})
export class ResultCardDisplayComponent implements OnInit {

  @Input() academicRecord: any;
  @Input() studentsData: any;

  studentData: Students;
  constructor() { }

  ngOnInit() {
    this.getStudentDetails();
  }

  getStudentDetails() {
    this.studentData = this.studentsData.find((studentsData: { userId: any; }) => studentsData.userId === this.academicRecord.studentId);
  }
  getTotalScore(exam: number, ca: number) {
    return exam + ca;
  }

}
