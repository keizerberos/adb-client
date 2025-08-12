import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'dashboard-grid',
	templateUrl: './grid.component.html',
	styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit,OnChanges,AfterViewInit {
	boardGlobal: any;
	frontClicked:boolean=false;
	@Input() selectedTable:any ;
	@Input() servers:any ;
	@Output() onTableSelected = new EventEmitter<any>();
	@Output() onRelationSelected = new EventEmitter<any>();
	
	ngOnChanges(changes: SimpleChanges): void {
		console.log("grid servers",this.servers);
		
	}
	ngAfterViewInit(): void {
	
	}
	ngOnInit(): void {
		console.log("grid servers",this.servers);
	}
	
}
