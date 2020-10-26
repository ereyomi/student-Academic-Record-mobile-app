import { Component, Input, OnInit } from '@angular/core';
import { Selections } from 'src/app/models/selections';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
})
export class HeaderPage implements OnInit {
  @Input() appSelection: Selections;
  constructor() { }

  ngOnInit() {
    console.log(this.appSelection);
  }

}
