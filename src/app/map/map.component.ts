import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;

  constructor() { }

  ngOnInit() {

  }

}
