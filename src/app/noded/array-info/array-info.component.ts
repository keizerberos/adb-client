import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'noded-array-info',
	templateUrl: './array-info.component.html',
	styleUrl: './array-info.component.scss',
})
export class ArrayInfoComponent implements OnInit,OnChanges {
	@Input() array: any;
	@Output() onEdit = new EventEmitter<any>();
	@Output() onClose = new EventEmitter<any>();
	type: any;
	values:any=[];
	val(e: any) {
		return e['target']['value'];
	}
	ngOnInit(): void {
		this.load();
	}
	ngOnChanges(changes: SimpleChanges): void {
    	console.log("changes",changes);
		this.load();
	}
	load(){
		console.log("array opened");
		//let valueRaw = this.array.getValue();
		//this.type = this.array.getType();		
		let valueRaw = this.array.value;
		this.type = this.array.type;
		console.log("valueRaw",valueRaw);
		console.log("this.type",this.type);
		if (Array.isArray(valueRaw)){
			this.values=[];
			valueRaw.forEach(v=>{
				this.values.push({name:'',value:v});
			});
			
		}else if(valueRaw == ""){
			this.values = [];
		}
	}
	onInput(e: any) {
		
	}
	
	addItem(){
		this.values.push({name:'',value:''});
		console.log("this.values",this.values);
	}
	remoteItem(value:any){
		this.values.splice(this.values.indexOf(value),1);
	}
	updateValue(){
		//this.array.setValue(this.values.map((v:any)=>v.value));
		//this.array.value = this.values.map((v:any)=>v.value);
	}
	save(){
		this.array.value = this.values.map((v:any)=>v.value);
		console.log("this.array.value",this.array.value);
		this.onClose.emit()
	}
}
