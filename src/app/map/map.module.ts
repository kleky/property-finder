import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MapComponent} from './map.component';



@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule
  ],
  entryComponents: [MapComponent],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
