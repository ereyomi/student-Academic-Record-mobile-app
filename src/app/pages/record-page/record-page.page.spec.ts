import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecordPagePage } from './record-page.page';

describe('RecordPagePage', () => {
  let component: RecordPagePage;
  let fixture: ComponentFixture<RecordPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecordPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
