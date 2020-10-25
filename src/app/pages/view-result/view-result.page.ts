import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.page.html',
  styleUrls: ['./view-result.page.scss'],
})
export class ViewResultPage implements OnInit {

  constructor(private appS: AppService) { }

  ngOnInit() {
    // this.appS.loadAcademicRecordsBySelection();
  }

}
