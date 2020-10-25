import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewResultPage } from './view-result.page';

describe('ViewResultPage', () => {
  let component: ViewResultPage;
  let fixture: ComponentFixture<ViewResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewResultPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
