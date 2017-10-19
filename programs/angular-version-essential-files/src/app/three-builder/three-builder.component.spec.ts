import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeBuilderComponent } from './three-builder.component';

describe('ThreeBuilderComponent', () => {
  let component: ThreeBuilderComponent;
  let fixture: ComponentFixture<ThreeBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
