import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'noded-json-info-one',
	templateUrl: './json-info-one.component.html',
	styleUrl: './json-info-one.component.scss',
})

export class JsonInfoOneComponent implements OnInit, OnChanges {
	@Input() name: any;
	@Input() json: any;
	@Input() data: any;
	@Input() type: any;
	@Output() onEdit = new EventEmitter<any>();
	@Output() onEditJson = new EventEmitter<any>();
	@Output() onEditArray = new EventEmitter<any>();
	@Output() onClose = new EventEmitter<any>();
	format: any;
	values: any;
	val(e: any) {
		return e['target']['value'];
	}
	ngOnInit(): void {
		this.load();
	}
	ngOnChanges(changes: SimpleChanges): void {
		console.log("changes", changes);
		this.load();
	}
	getFormat(valueRaw) {
		let fields = [];
		console.log("getFormat valueRaw", valueRaw);
		Object.keys(valueRaw).forEach(k => {
			const value = valueRaw[k];
			console.log("getFormat value", value);
			if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
				fields.push({ type: "json", name: k });
			} else if (Array.isArray(value) && value !== null) {
				fields.push({ type: "json[]", name: k });
			} else if (typeof value !== 'object' && !Array.isArray(value) && typeof value === 'number' && typeof value !== 'string') {
				fields.push({ type: "number", name: k });
			} else if (typeof value !== 'object' && !Array.isArray(value) && typeof value !== 'number' && typeof value === 'string') {
				fields.push({ type: "string", name: k });
			}
			console.log("fields", fields);
		});

		return fields;
	}
	load() {
		if (this.data == undefined) {
			console.log("array opened");
			let valueRaw = this.json.getValue();
			this.name = this.json.name;
			console.log("valueRaw", valueRaw);
			console.log("typeof valueRaw === 'object'", typeof valueRaw === 'object');
			if (typeof valueRaw === 'object' && !Array.isArray(valueRaw) && valueRaw !== null) {
				console.log("load new json1");console.log("load new json2");
				this.format = [];
					let format1 = valueRaw;
					this.format = this.getFormat(format1);
					console.log("fields", this.format);
					this.values = [];
						let val = [];
						this.format.forEach((f, i) => {
							val.push({ value: valueRaw[f.name], type: f.type, delete:false });
						});
						this.values.push(val);
				
				
				//this.format=valueRaw.format;
				/*valueRaw.values.forEach((v:any)=>{
					this.values.push(v);
				});*/
				/*if (Array.isArray(valueRaw)){
					console.log("load new json");
					this.format = valueRaw.format;
					valueRaw.value.forEach((v:any)=>{
						this.values.push(v);
					});*/
			} if (typeof valueRaw === 'object' && Array.isArray(valueRaw) && valueRaw !== null) {
				console.log("load new json2");
				this.format = [];
				if (valueRaw.length > 0) {
					let format1 = valueRaw[0];
					this.format = this.getFormat(format1);
					console.log("fields", this.format);
					this.values = [];
					valueRaw.forEach(v => {
						let val = [];
						this.format.forEach((f, i) => {
							val.push({ value: v[f.name], type: f.type, delete:false });
						});
						this.values.push(val);
					})
				}

				//this.format=valueRaw.format;
				/*valueRaw.values.forEach((v:any)=>{
					this.values.push(v);
				});*/
				/*if (Array.isArray(valueRaw)){
					console.log("load new json");
					this.format = valueRaw.format;
					valueRaw.value.forEach((v:any)=>{
						this.values.push(v);
					});*/
			} else if (valueRaw == "") {
				console.log("valueRaw is empty");
				this.format = [{ name: 'field_1', type: 'string', delete:false }];
				this.values = [[{ "value": '', type: 'string' }]];
			}
		} else if (this.json == undefined) {
			let valueRaw = this.data.value;
			//this.name = this.data.name;
			console.log("json valueRaw", valueRaw);
			if (typeof valueRaw === 'object' && !Array.isArray(valueRaw) && valueRaw !== null) {
				console.log("load new value");
				this.format = [];
					let format1 = valueRaw;
					this.format = this.getFormat(format1);
					console.log("fields", this.format);
					this.values = [];
						let val = [];
						this.format.forEach((f, i) => {
							val.push({ value: valueRaw[f.name] });
						});
						this.values.push(val);

			} else if (valueRaw == "") {
				this.format = [{ name: 'field_1', type: 'string', delete:false }];
				this.values = [[{ value: '' }]];
				console.log("format", this.format, this.values);
			}
		}
	}
	addField() {
		this.format.push({ name: 'field_' + (this.format.length + 1), type: 'string' });
		this.values.forEach((v: any) => {
			this.format.forEach((f: any, i: any) => {
				if (v[i] == null) v[i] = [];
				v[i]['value'] = v[i]['value'] == undefined ? '' : v[i]['value'];
			});
		});
		console.log("data", { format: this.format, values: this.values });
	}
	addValue() {
		let val: any = [];
		this.format.forEach((f: any) => {
			val.push({ value: '', type: f.type });
		});
		this.values.push(val);
	}
	onInput(e: any) {

	}
	save() {
		let ar = [];

		this.values.forEach((v: any) => {
			let obj = {};
			this.format.forEach((f: any, i: number) => {		
				if (f.delete) return;
				if (f.type == 'number')
					obj[f.name] = Number(v[i].value);
				else
					obj[f.name] = v[i].value;
			});
			ar.push(obj);
		});

		console.log("ar", ar);
		console.log("data", this.data);
		if (this.data == undefined)
			this.json.setValue(ar[0]);
		else
			this.data.value = ar[0];
		this.onClose.emit();
	}
	/*addItem() {
		this.values.push({ name: '', value: '' });
	} */
	delItem(value: any) {
		this.values.splice(this.values.indexOf(value), 1);
	}
	remoteItem(value: any) {
		this.values.splice(this.values.indexOf(value), 1);
	}
	updateValue() {
		//this.json.setValue(this.values.map((v:any)=>v.value));
		/*if (this.data == undefined)
			this.json.setValue({format:this.format,values:this.values});		*/

	}
	textAbstract(text: any, length) {
		let last;
		if (text == null) {
			return "[ ]";
		}
		if (typeof text === 'object' && !Array.isArray(text) && text !== null) {
			text = JSON.stringify(text);
		}
		if (Array.isArray(text) ) {
			text = JSON.stringify(text);
		}
		if (text == null) {
			return "[ ]";
		}
		if (text == "") {
			return "[ ]";
		}
		if (text.length <= length) {
			return text;
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
		if (Array.isArray(text) ) {
			text = JSON.stringify(text,null,2);
		}
		if (text == null) {
			return "[ ]";
		}
		if (text == "") {
			return "[ ]";
		}
		if (text.length <= length) {
			return text;
		}		
		
		
		return text;
	}
	updateFields() {
		this.values.forEach((v: any) => {
			this.format.forEach((f: any, i: number) => {
				//				if (v[i]) v[i]={value:''};
				if (f.type == 'json[]' || v[i].value == undefined) {
					if (typeof v[i].value !== 'object' && !Array.isArray(v[i].value)) {
						v[i].value = '';
					}
				}
				v[i].type = f.type;
			});
		});
		console.log("updateFields", { format: this.format, values: this.values });
	}
}
