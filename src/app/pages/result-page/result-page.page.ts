import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.page.html',
  styleUrls: ['./result-page.page.scss'],
})
export class ResultPagePage implements OnInit {
  header = {
    title: 'VIEW',
    subTitle: 'RESULT'
  };
  academicReports$: Observable<any> = this.appS.academicRecordsBySelection;
  studentsData$: Observable<any> = this.db.getStudents();
  constructor(private appS: AppService, private db: IndexedDbService) { }

  ngOnInit() {
  }

}
