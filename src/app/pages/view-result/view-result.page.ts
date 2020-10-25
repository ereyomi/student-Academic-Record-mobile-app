import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';

@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.page.html',
  styleUrls: ['./view-result.page.scss'],
})
export class ViewResultPage implements OnInit {

  academicReports$: Observable<any> = this.appS.academicRecordsBySelection;
  studentsData$: Observable<any> = this.db.getStudents();
  constructor(private appS: AppService, private db: IndexedDbService) { }

  ngOnInit() {}

}
