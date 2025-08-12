import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid/grid.component';
import { TableInfoComponent } from './table-info/table-info.component';
import { RowInfoComponent } from './row-info/row-info.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ArrayInfoComponent } from './array-info/array-info.component';
import { JsonInfoComponent } from './json-info/json-info.component';
import { JsonInfoOneComponent } from './json-info-one/json-info-one.component';

@NgModule({
  declarations: [
    GridComponent,
    TableInfoComponent,
    RowInfoComponent,
	ArrayInfoComponent,
	JsonInfoComponent,
	JsonInfoOneComponent
  ],
  imports: [
    CommonModule,
	ReactiveFormsModule,
	FormsModule,	
  ],
 exports:[
	GridComponent,
	TableInfoComponent,
	JsonInfoComponent,
	JsonInfoOneComponent,
	ArrayInfoComponent
	]
})
export class NodedModule { }
