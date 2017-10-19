import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameProjectComponent } from './game-project/game-project.component';
import { ThreeBuilderComponent } from './three-builder/three-builder.component';
import { GameStackBuilderComponent } from './game-stack-builder/game-stack-builder.component';
import { ObjectBrowserComponent } from './object-browser/object-browser.component';

@NgModule({
  declarations: [
    AppComponent,
    GameProjectComponent,
    ThreeBuilderComponent,
    GameStackBuilderComponent,
    ObjectBrowserComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [GameStackBuilderComponent, ObjectBrowserComponent]
})
export class AppModule { }
