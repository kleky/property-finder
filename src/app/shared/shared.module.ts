import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PropertyMapperService} from "./mappers/property-mapper.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [PropertyMapperService],
})
export class SharedModule { }
