import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStackBuilderComponent } from './game-stack-builder.component';

describe('GameStackBuilderComponent', () => {
  let component: GameStackBuilderComponent;
  let fixture: ComponentFixture<GameStackBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameStackBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStackBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
