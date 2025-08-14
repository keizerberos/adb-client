
import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from './services/websocket.service';
import { DomSanitizer} from '@angular/platform-browser';
declare var $: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'ServerXState-app';
	servers = null;
	devices = null;
	tasks = [];
	actions = [];
	widthless = 100;
	width = 600;
	checkedAll = false;
	selectedDevice = null;
	constructor(
		private websocketService: WebSocketService,
		private sanitizer: DomSanitizer) { }
	ngOnInit(): void {
		this.initializeSocketConnection();
	}
	s(txt){
		return this.sanitizer.bypassSecurityTrustHtml(txt);
	}
	convertText(param, event, task){

		console.log("value",event.target.value)
		let fn = task.functions[param.id];
		if (fn == "fburl"){
			param.value = this.facebookUri(event.target.value);
			event.target.value = param.value
		}else if (fn == "tkburl"){
			param.value = this.facebookUri(event.target.value);
			event.target.value = param.value
		}else{
			param.value = event.target.value ;
		}
	}
	 tiktokUri(url){
		const queryString = url.split("?");
		if (queryString.length!=2) return url;
		return queryString[0];
	}
	 facebookUri(url){
		const queryString = url.split("?")[1];
		if (queryString)
		console.log(queryString,queryString);
		const urlParams = new URLSearchParams(queryString);
		console.log("urlParams",urlParams);
		let links = $(".d-link");
		let id = urlParams.get("id");
		let postid = urlParams.get("story_fbid");
		if (id == undefined) return url;
		if (postid == undefined) return url;
			links.val("https://www.facebook.com/"+id+"/posts/"+postid);
		return "https://www.facebook.com/"+id+"/posts/"+postid;
	}
	ngOnDestroy(): void {
		this.disconnectSocket();
	}
	changeWifi(event){
		if ( event.target.checked ) this.wifiOn();
		else this.wifiOff();
	}
	changeDatos(event){
		if ( event.target.checked ) this.dataOn();
		else this.dataOff();
	}
	offScreen(){
		
		 let devicesChecked = this.devices.filter(d=>d.checked);
			devicesChecked.forEach((d,ii)=>{
				let data = {
					"action":"adb",
					"devices":d.serial,
					"data":{"command":'input keyevent 26'}
				};
			this.websocketService.send("device.adb", data);
			});
	}
	wifiOn(){
		
		 let devicesChecked = this.devices.filter(d=>d.checked);
			devicesChecked.forEach((d,ii)=>{
				let data = {
					"action":"adb",
					"devices":d.serial,
					"data":{"command":'svc wifi enable'}
				};
			this.websocketService.send("device.adb", data);
			});
	}
	wifiOff(){
		 let devicesChecked =  this.devices.filter(d=>d.checked);
			devicesChecked.forEach((d,ii)=>{
				let data = {
					"action":"adb",
					"devices":d.serial,
					"data":{"command":'svc wifi disable'}
				};
			this.websocketService.send("device.adb", data);
			});
	}	
	dataOn(){
		 let devicesChecked =  this.devices.filter(d=>d.checked);
			devicesChecked.forEach((d,ii)=>{
				let data = {
					"action":"adb",
					"devices":d.serial,
					"data":{"command":'svc data enable'}
				};
			this.websocketService.send("device.adb", data);
			});
	}
	dataOff(){
		 let devicesChecked =  this.devices.filter(d=>d.checked);
			devicesChecked.forEach((d,ii)=>{
				let data = {
					"action":"adb",
					"devices":d.serial,
					"data":{"command":'svc data disable'}
				};
			this.websocketService.send("device.adb", data);
			});
	}


	toArray(obj){
		return Object.keys(obj).map(k=>{ return { id: k,value: obj[k] }});
	}
	onWheelEvent(event) {
		const deltaY = event.deltaY; // Vertical scroll amount
		const deltaX = event.deltaX; // Horizontal scroll amount
		this.width -= deltaY;
		this.widthless -= deltaY/10;
		console.log('Wheel event:', event);
		console.log('Delta Y:', deltaY);
		//console.log('Delta X:', deltaX);

	}
	initializeSocketConnection() {
		const self = this;
		var BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
		this.devices = this.websocketService.devices;
		this.websocketService.on("devices", (data) => {
			/*if (this.devices == null)
				this.devices = this.websocketService.devices;*/
			//console.log("servidores recibidos",data);
			this.refresh();
			/*this.devices.forEach(d=>{
			let canvas = $(`#canvas${d.serial}`)[0];
				canvas.addEventListener('mousemove', function (event) {
					console.log("x:" + event.x + " y:" + event.y + " ox:" + event.offsetX + " oy:" + event.offsetY );
				});
			});*/
		});
		this.websocketService.on("tasks", (data) => {
			console.log("-tasks.data",data);
			this.tasks = Object.keys(data).map(k=>{ data[k]['id']=k; data[k]['paramsArray']=this.toArray(data[k].params); return data[k]});
			console.log("-tasks",this.tasks);
		});
		this.websocketService.on("actions", (data) => {
			this.actions = Object.keys(data).map(k=>{data['id']=k; return data[k]});
			console.log("-actions",this.actions);
		});
		this.websocketService.on("capture", (device,data) => {
				const id = device.serial;
				var blob = new Blob([data], {type: 'image/png'})
				var URL = window.URL || window.webkitURL
				
				let canvas = $(`#canvas${id}`)[0];
				if (canvas == null) return;
				var canvasctx = canvas.getContext("2d");
				
				var img = new Image()
				img.onload = function() {
					//console.log(img.width, img.height)
					canvas.width = img.width;
					canvas.height = img.height;
					canvasctx.drawImage(img, 0, 0);
					img.onload = null;
					img.src = BLANK_IMG;
					img = null;
					u = null;
					blob = null;
					if (self.selectedDevice!=null){
						if (self.selectedDevice.serial == device.serial ){
							self.startRec(device);
						}
					}
				};
				/*canvas.addEventListener('mousemove', function (event) {
					console.log("x:" + event.x + " y:" + event.y + " ox:" + event.offsetX + " oy:" + event.offsetY );
				});*/
				var u = URL.createObjectURL(blob)
				img.src = u;
		});
		this.websocketService.connectSocket('client');
	}
	collapseToggle(task){
		this.tasks.forEach(t=>t.collapsed=false);
		if (task.collapsed==undefined){
			task['collapsed'] = true;
		}else{
			task['collapsed'] = !task['collapsed'];
		}

	}
	receiveSocketResponse() {
		this.websocketService.receiveStatus().subscribe((receivedMessage: string) => {
			console.log(receivedMessage);
		});
	}
	disconnectSocket() {
		this.websocketService.disconnectSocket();
	}
	execute(task){
		console.log("execute.tasks",task);
		let devicesFilter = this.devices.filter(d => d.checked);
		//this.websocketService.send("tasks.execute", {devices:devicesFilter.map(d=>d.serial),task:task});
		this.websocketService.send("tasks.execute", {devices:devicesFilter,task:task});
	}
	selectDevice(device){
		console.log("device",device);
		if (device.selected<2){			
			this.devices.forEach(d=>{ d.selected = 0});
			device.selected = 2;
			this.selectedDevice = device;		
			this.startRec(device);
			this.refresh();
		}else{			
			this.selectedDevice = null;
			this.devices.forEach(d=>{ d.selected = 1});
			this.refresh();
		}		
	}
	startRec(device){
		let data = {
				"action": "Screen",
				"devices": device.serial,
				"data": {
					"savePath": "{screen_path}"
				}
			};
			this.websocketService.send("device.adb", data);
	}
	mouseT = 0;
	mouseX = 0;
	mouseY = 0;
	mouseX0 = 0;
	mouseY0 = 0;
	mouseDown(device,event){
		if (device.selected!=2) return;
		let cy = Math.round((event.offsetY / event.target.clientHeight) * event.target.height);
		let cx = Math.round((event.offsetX / event.target.clientWidth) * event.target.width);
		console.log("cx cy",cx,cy);
		
		this.mouseX0 = cx;
		this.mouseY0 = cy;
		this.mouseT = Date.now();
		let data = {
				"action": "adb",
				"devices": device.serial,
				"data": {
					"command": "input tap "+cx+ " "+cy
				}
			};
		this.websocketService.send("device.adb", data);
	}	
	mouseMove(device,event){		
		if (device.selected!=2) return;

		let cx = Math.round((event.offsetX / event.target.clientWidth) * event.target.width);
		let cy = Math.round((event.offsetY / event.target.clientHeight) * event.target.height);
		this.mouseX = cx;
		this.mouseY = cy;
	}	
	mouseUp(device,event){
		if (device.selected!=2) return;
		const elapsed = Date.now() - this.mouseT;
		if (elapsed > 300){
				
			let data = {
					"action": "adb",
					"devices": device.serial,
					"data": {
						"command": "input touchscreen swipe " + this.mouseX0 + " "+ this.mouseY0 + " " + this.mouseX + " "+ this.mouseY + " " + elapsed 
					}
				};
			this.websocketService.send("device.adb", data);
		}else{
			let data = {
				"action": "adb",
				"devices": device.serial,
				"data": {
					"command": "input tap "+this.mouseX+ " "+this.mouseY
				}
			};
			this.websocketService.send("device.adb", data);
		}
		
	}
	checkAll(){		
		console.log("this.checkedAll",this.checkedAll);
		this.devices.forEach((d, ii) => { d.checked=this.checkedAll;});
		this.checkedAll = !this.checkedAll;
	}
	installKey(){
		let devicesChecked = this.devices.filter(d=>d.checked);
		devicesChecked.forEach((d, ii) => {
			console.log("installKey");
			let data = {
				"action": "adb",
				"devices": d.serial,
			};
			this.websocketService.send("adb.install.keyboard", data);
		});
	}
	installGni(){
		let devicesChecked = this.devices.filter(d=>d.checked);
		devicesChecked.forEach((d, ii) => {
			console.log("installKey");
			let data = {
				"action": "adb",
				"devices": d.serial,
			};
			this.websocketService.send("adb.install.gni", data);
		});
	}
	installWifi(){
		let devicesChecked = this.devices.filter(d=>d.checked);
		devicesChecked.forEach((d, ii) => {
			console.log("installKey");
			let data = {
				"action": "adb",
				"devices": d.serial,
			};
			this.websocketService.send("adb.install.wifi", data);
		});
	}
	tetheringStart(){
		let devicesChecked = this.devices.filter(d=>d.checked);
		devicesChecked.forEach((d, ii) => {
			console.log("installKey");
			let data = {
				"action": "adb",
				"devices": d.serial,
			};
			this.websocketService.send("tethering.start", data);
		});
	}
	tetheringStop(){
		let devicesChecked = this.devices.filter(d=>d.checked);
		devicesChecked.forEach((d, ii) => {
			console.log("installKey");
			let data = {
				"action": "adb",
				"devices": d.serial,
			};
			this.websocketService.send("tethering.stop", data);
		});
	}
	goHome() {
		this.devices.forEach((d, ii) => {
			console.log("sending goHome");
			let data = {
				"action": "adb",
				"devices": d.serial,
				"data": {
					"command": "input keyevent 3"
				}
			};
			this.websocketService.send("device.adb", data);
		});
	}
	unlock() {
		this.devices.forEach((d, ii) => {
			let data = {
				"action":"Unlock",
				"devices":d.serial,
				"data":null
			};
			console.log("sending unlock",data);
			this.websocketService.send("device.adb", data);
		});
	}
	lock() {
		this.devices.forEach((d, ii) => {
			let data = {
					"action":"Lock",
					"devices":d.serial,
					"data":null
			};
			console.log("sending lock",data);
			this.websocketService.send("device.adb", data);
		});
	}
	refresh() {
		this.devices.forEach((d, ii) => {
			console.log("sending refresh");
			let data = {
				"action": "Screen",
				"devices": d.serial,
				"data": {
					"savePath": "{screen_path}"
				}
			};
			this.websocketService.send("device.adb", data);
		});
	}
}
