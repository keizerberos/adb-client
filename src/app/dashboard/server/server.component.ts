import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'app-server',
	templateUrl: './server.component.html',
	styleUrl: './server.component.scss',
})
export class ServerComponent implements OnInit,OnChanges,AfterViewInit {
	boardGlobal: any;
	frontClicked:boolean=false;
	@Input() selectedTable:any ;
	@Input() server:any ;
	@Output() onTableSelected = new EventEmitter<any>();
	@Output() onRelationSelected = new EventEmitter<any>();
	num2ar(num){
		if (isNaN(num)) return [];
		return Array(Math.round(num)).fill(Math.round(num-1));
	}
	
	last10(arr){
		//arr.slice(Math.max(arr.length - 5, 0))
		
		return arr.slice(Math.max(arr.length - 54, 1))
	}
	ngOnChanges(changes: SimpleChanges): void {
		
	}
	ngAfterViewInit(): void {
	
	}
	ngOnInit(): void {
		console.log("init",this.server);
	}
	
}
