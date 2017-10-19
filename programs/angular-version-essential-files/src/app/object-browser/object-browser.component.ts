import { Component, OnInit } from '@angular/core';

declare var jQuery:any;

declare var $:any;


@Component({
  selector: 'app-object-browser',
  templateUrl: './object-browser.component.html',
  styleUrls: ['./object-browser.component.css']
})
export class ObjectBrowserComponent implements OnInit {

  constructor() {

    //data.allowed = {mainObjectConstructors:[], listMemberProfiles:[]}


  }

  ngOnInit() {

    alert('object-browser-init');

    $("button.browser-open").sidr({
      name: 'sidr-left-top',
      timing: 'ease-in-out',
      speed: 500,
      source:".object-browser"});


  }

}
