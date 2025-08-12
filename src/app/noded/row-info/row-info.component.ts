import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

declare var Field: any;
@Component({
  selector: 'noded-row-info',
  templateUrl: './row-info.component.html',
  styleUrl: './row-info.component.scss'
})
export class RowInfoComponent implements OnInit{
	@Input() row:any;
	@Output() onEdit = new EventEmitter<any>();
	type:any;
	val(e:any){
		return e['target']['value'];
	}
	ngOnInit(): void {
	}
	onInput(e:any){
		console.log(e);
	}
	updateValues(row,e){
		row.type = this.val(e); 
		row.setType(this.val(e))
		row.value='';
		row.setValue('');
	}
	textAbstract(text: any, length) {
		let last;
		if (text == null) {
			return "[ ]";
		}
		if (typeof text === 'object' && !Array.isArray(text) && text !== null) {
			text = JSON.stringify(text);
		}
		if (typeof text !== 'object' && Array.isArray(text) && text !== null) {
			text = JSON.stringify(text);
		}
		if (text == "") {
			return "[ ]";
		}
		if (text.length <= length) {
			return text;
		}		
		
		if (text == null) {
			return "[ ]";
		}
		
		text = text.substring(0, length);
		//last = text.lastIndexOf(" ");
		//text = text.substring(0, last);
		return text + "...";
	}
	textAbstractP(text: any) {
		let last;
		if (text == null) {
			return "[ ]";
		}
		if (typeof text === 'object' && !Array.isArray(text) && text !== null) {
			text = JSON.stringify(text,null,2);
		}
		if (typeof text !== 'object' && Array.isArray(text) && text !== null) {
			text = JSON.stringify(text,null,2);
		}
		if (text == "") {
			return "[ ]";
		}
		if (text.length <= length) {
			return text;
		}		
		
		
		return text;
	}
}
