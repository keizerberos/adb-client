import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

declare var createjs: any;
declare var shouldUpdate: any;
declare var Tabla: any;
declare var Field: any;
declare var Board: any;
declare var ButtonGroup: any;
declare var Button: any;
declare var Relation: any;
declare var update: any;
declare var stage: any;
declare var handleTick: any;
declare var setScaleEvents: any;
@Component({
	selector: 'noded-grid',
	templateUrl: './grid.component.html',
	styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit,OnChanges,AfterViewInit {
	boardGlobal: any;
	frontClicked:boolean=false;
	@Input() selectedTable:any ;
	@Output() onTableSelected = new EventEmitter<any>();
	@Output() onRelationSelected = new EventEmitter<any>();
	
	ngOnChanges(changes: SimpleChanges): void {
		
	}
	ngAfterViewInit(): void {
		//this.stage = this.createStage('mainCanvas');

		stage = new createjs.Stage('mainCanvas');
		stage.enableMouseOver();
		stage.enableDOMEvents(true);
		stage.mouseMoveOutside = true;

		this.setDocumentEvents(stage);
		setScaleEvents(stage, 'mainCanvas');
		//cargarJson();

		this.loadBoard();
		//this.addObjectsTest();
		createjs.Ticker.on('tick', handleTick);
		createjs.Ticker.setFPS(60);
	}
	ngOnInit(): void {
		console.log('render');
	}
	loadBoard(){
		let self = this;
		let board = new Board({
			background: '#166497',
			lineColor: '#ffffff22',
			space: 50,
			lineWidth: 0.5,
		});
		this.boardGlobal = board;
		this.boardGlobal.on('clickRelationTool',(id:any,relation:any)=>{
			if (id=="properties")
				this.onRelationSelected.emit(relation);
			if (id=="delete")
				relation.delete();
		});
		board.container.on("mousedown", function (event: any) {
			if (!self.frontClicked){
				console.log("board mousedown");
				self.onTableSelected.emit(null);
				self.frontClicked = true;
			}			
		});
		board.container.on("pressup", function (event: any) {
			self.frontClicked = false;
		});
		stage.addChild(board.container);
		update();
	}

	setDocumentEvents(stage: any) {
		let mouseX = 0;
		let mouseY = 0;
		let self = this;
		stage.on('stagemousemove', (event: any) => {
			mouseX = event.stageX;
			mouseY = event.stageY;
		});
		document.onkeydown = function (e) {
			if (e.keyCode == 84 && self.selectedTable==null ) {
				console.log('add table', e);

				self.addTable(
					mouseX - self.boardGlobal.container.x,
					mouseY - self.boardGlobal.container.y
				);
			}
		};
	}
	addTable(x: any, y: any) {
		let self = this;
		let table1 = new Tabla({ title: 'node-1' });
		const board = this.boardGlobal;

		table1.setX(x);
		table1.setY(y);

		table1.addField({
			name: 'preDelay',
			type: 'number',
			value: 1,
			fieldType: 'number',
			locked:false,
			background: '#585858',
		});
		table1.addField({
			name: 'in',
			type: 'json[]',
			value: '',
			fieldType: 'in',
			linkable: true,
			onlyIn: true,
			locked:true,
			background: '#585858',
		});
		table1.addField({
			name: 'action',
			type: 'json[]',
			value: '',
			locked:false,
			fieldType: 'json[]',
			background: '#585858',
		});
		table1.addField({
			name: 'out',
			type: 'json[]',
			value: '',
			fieldType: 'out',
			linkable: true,
			onlyOut: true,
			locked:true,
			background: '#585858',
		});
		table1.addField({
			name: 'postDelay',
			type: 'number',
			value: 1,
			locked:false,
			fieldType: 'number',
			background: '#585858',
		});
/*
		table1.on("clickTool", function (event: any) {
			console.log("table1 mousedown");
			let table2 = self.addTable(table1.container.x+300,table1.container.y);
			table2.clearFields();
			table1.getFields().forEach(f=>{
				//let field = new Field(f.prop);
				table2.addField(f.prop);
			});


		});*/
		table1.container.on("mousedown", function (event: any) {
			console.log("table1 mousedown");
			self.onTableSelected.emit(table1);
			self.frontClicked = true;
		});
		table1.container.on("pressup", function (event: any) {
			self.frontClicked = false;
		});
		table1.container.on("clickRelation", function (event: any) {
			self.frontClicked = false;
		});
		let buttonGroup = new ButtonGroup({	imageName:null,	text:'button',	w:200,	h:20,	bgColor:"#ffffffaa",});
		let buttonx2 = new Button({x:0,y:0,text:'Duplicate',imageName:'page_copy',bgColor:'#ffffffaa'});		
		let buttonx3 = new Button({x:0,y:0,text:'Delete',imageName:'zoom',bgColor:'#ffffffaa'});		
		//buttonGroup.addButton(buttonx,'add');
		buttonGroup.addButton(buttonx2,'copy');
		buttonGroup.addButton(buttonx3,'delete');
		buttonGroup.on('clickButton',(id)=>{ 
			if (id=='copy'){
				let table2 = self.addTable(table1.container.x+200,table1.container.y);
				table2.clearFields();
				table1.getFields().forEach(f=>{
					table2.addField(f.prop);
				});
			}
			if (id=='delete'){
				board.removeTable(table1);
			}
		});
		table1.addComponent(buttonGroup, 60,-18);
		
		board.addTable(table1);
		return table1;
	}
	createStage(domObjectId: string) {
		let stage = new createjs.Stage(domObjectId);
		stage.update();
		return stage;
	}
	addObjectsTest() {
		const self = this;
		const board = this.boardGlobal;
				
		//let board = new Board({background:"#1b51A9"});

		let table1 = new Tabla({ title: 'node-1' });
		table1.setX(100);
		table1.setY(100);

		table1.addField({
			name: 'preDelay',
			type: '1s',
			background: '#282828',
		});
		table1.addField({
			name: 'in',
			type: '[triger]',
			linkable: true,
			onlyIn: true,
			background: '#585858',
		});
		table1.addField({
			name: 'action',
			type: 'act-1',
			background: '#585858',
		});
		let field_from1 = table1.addField({
			name: 'out',
			type: '[next]',
			linkable: true,
			onlyOut: true,
			background: '#585858',
		});
		table1.addField({
			name: 'postDelay',
			type: '3s',
			background: '#282828',
		});

		let table2 = new Tabla({ title: 'node-2' });
		table2.setX(400);
		table2.setY(450);

		table2.addField({
			name: 'preDelay',
			type: '2s',
			background: '#282828',
		});
		let field_to2 = table2.addField({
			name: 'in',
			type: '[triger]',
			linkable: true,
			onlyIn: true,
			background: '#585858',
		});
		table2.addField({
			name: 'action',
			type: 'act-2',
			background: '#585858',
		});
		table2.addField({
			name: 'out',
			type: '[next]',
			linkable: true,
			onlyOut: true,
			background: '#585858',
		});
		table2.addField({
			name: 'postDelay',
			type: '1s',
			background: '#282828',
		});

		let table3 = new Tabla({ title: 'node-3' });
		table3.setX(400);
		table3.setY(750);

		table3.addField({
			name: 'preDelay',
			type: '1s',
			background: '#282828',
		});
		let field_to3 = table3.addField({
			name: 'in',
			type: '[triger]',
			linkable: true,
			onlyIn: true,
			background: '#585858',
		});
		table3.addField({
			name: 'action',
			type: 'act-3',
			background: '#585858',
		});
		table3.addField({
			name: 'out',
			type: '[next]',
			linkable: true,
			onlyOut: true,
			background: '#585858',
		});
		table3.addField({
			name: 'postDelay',
			type: '1s',
			background: '#282828',
		});

		let table4 = new Tabla({ title: 'node-4' });
		table4.setX(400);
		table4.setY(100);

		table4.addField({
			name: 'preDelay',
			type: '1s',
			background: '#282828',
		});
		table4.addField({
			name: 'in',
			type: '[triger]',
			linkable: true,
			onlyIn: true,
			background: '#585858',
		});
		table4.addField({
			name: 'action',
			type: 'act-1',
			background: '#585858',
		});
		let field_from4 = table4.addField({
			name: 'out',
			type: '[next]',
			linkable: true,
			onlyOut: true,
			background: '#585858',
		});
		table4.addField({
			name: 'postDelay',
			type: '1s',
			background: '#282828',
		});

		let relation = new Relation(field_from1, field_to2);
		let relation2 = new Relation(field_from1, field_to3);

		//rowx = table4;
		board.addTable(table1);
		board.addTable(table2);
		board.addTable(table3);
		board.addTable(table4);
		board.addRelation(relation);
		board.addRelation(relation2);

		//boardx = board;
		//boardGlobal = board;
		//update();
	}
}
