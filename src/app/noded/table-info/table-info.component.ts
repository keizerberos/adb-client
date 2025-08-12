import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
	selector: 'noded-table-info',
	templateUrl: './table-info.component.html',
	styleUrl: './table-info.component.scss',
})
export class TableInfoComponent implements OnChanges, OnInit {

	@Input() board: any;
	@Input() table: any;

	title: any;
	rows: any;
	fieldValues: any;
	selectedArray: any=[];
	selectedJson: any=[];

	val(e: any) {
		return e['target']['value'];
	}
	editRow(event:any){
		console.log(event);
		//this.selectedArray = [event];
		this.selectedArray.push(event);
	}
	editArray(event:any){
		console.log(event);
		//this.selectedArray = [event];
		this.selectedArray.push(event);
	}
	addEditJson(event:any){
		this.selectedJson.push(event);
	}
	removeJson(json:any){
		this.selectedJson.splice( this.selectedJson.indexOf(json),1);
	}
	removeArray(array:any){
		this.selectedArray.splice( this.selectedArray.indexOf(array),1);
	}
	ngOnInit(): void {

	}
	ngOnChanges(changes: SimpleChanges): void {
		console.log("ngOnChanges");

		let fields = this.table.getFields();
		console.log("fields", fields);
		fields.forEach((f: any) => {
			console.log("f", f.getType());
		});
		this.rows = this.table.getFields();
		//console.log("this.rows",this.rows);
	}
	updateTitle(event: any) {
		this.table.setTitle(this.title);
	}
	addField(){
		this.table.addField({
			name: '',
			type: 'string',
			value: '',
			in:false,
			out:false,
			show:false,
			locked:false,
			fieldType: 'string',
			background: '#585858'});
	}
}
