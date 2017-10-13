import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameProjectComponent } from './game-project.component';

describe('GameProjectComponent', () => {
  let component: GameProjectComponent;
  let fixture: ComponentFixture<GameProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
