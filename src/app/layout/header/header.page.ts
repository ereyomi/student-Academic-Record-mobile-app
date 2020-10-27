import { Component, Input, OnInit } from '@angular/core';
import { Selections } from 'src/app/models/selections';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
})
export class HeaderPage implements OnInit {
  appSelection: any;
  appSelection$ = this.appS.getSelctionOptions().subscribe(opt => this.appSelection = opt);
  sessions: any;
  sessions$ = this.appS.getSortedSessions().subscribe(s => this.sessions = s);
  terms: any;
  terms$ = this.appS.getSortedTerms().subscribe(t => this.terms = t);
  subjects: any;
  subjects$ = this.appS.getSortedSubjects().subscribe(sub => this.subjects = sub);
  @Input() header: any;
  @Input() showTitleOptions = true;

  constructor(private appS: AppService) { }

  ngOnInit() { }
  getSession() {
    const a = this.sessions.find((d: any) => d.sessionId === parseInt(this.appSelection.sessionId, 10));
    return typeof a !== 'undefined' ? a.name : 'loading...';
  }
  getTerm() {
    const a = this.terms.find((d: any) => d.termId === parseInt(this.appSelection.termId, 10));
    return typeof a !== 'undefined' ? a.name : 'loading...';
  }
  getSubject() {
    const a = this.subjects.find((d: any) => d.subjectId === parseInt(this.appSelection.subjectId, 10));
    return typeof a !== 'undefined' ? a.shortName : 'loading...';
  }


}
