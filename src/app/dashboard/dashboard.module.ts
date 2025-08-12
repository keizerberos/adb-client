import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid/grid.component';
import { ServerComponent } from './server/server.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GridComponent,
    ServerComponent,
  ],
  imports: [
    CommonModule,
	ReactiveFormsModule,
	FormsModule,	
  ],
 exports:[
	GridComponent,
	ServerComponent,
	]
})
export class DashboardModule { }
