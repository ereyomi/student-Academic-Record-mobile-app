import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectPagePage } from './select-page.page';

describe('SelectPagePage', () => {
  let component: SelectPagePage;
  let fixture: ComponentFixture<SelectPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
