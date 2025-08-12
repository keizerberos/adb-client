import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from './services/websocket.service';
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
	constructor(private websocketService: WebSocketService) { }
	ngOnInit(): void {
		this.initializeSocketConnection();
	}
	ngOnDestroy(): void {
		this.disconnectSocket();
	}
	initializeSocketConnection() {
		
		var BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
		this.devices = this.websocketService.devices;
		this.websocketService.on("devices", (data) => {
			/*if (this.devices == null)
				this.devices = this.websocketService.devices;*/
			//console.log("servidores recibidos",data);
		});
		this.websocketService.on("capture", (device,data) => {
				const id = device.serial;
				var blob = new Blob([data], {type: 'image/png'})
				var URL = window.URL || window.webkitURL
				
				//console.log("id",`canvas${id}`);
				let canvas = $(`#canvas${id}`)[0];
				//console.log("canvas",canvas);
				if (canvas == null) return;
				console.log("canvas", canvas);
				var canvasctx = canvas.getContext("2d");

				
				var img = new Image()
				img.onload = function() {
					//console.log(img.width, img.height)
					canvas.width = img.width
					canvas.height = img.height
					canvasctx.drawImage(img, 0, 0)
					img.onload = null
					img.src = BLANK_IMG
					img = null
					u = null
					blob = null
				}
				var u = URL.createObjectURL(blob)
				img.src = u;
		});
		this.websocketService.connectSocket('client');
	}
	receiveSocketResponse() {
		this.websocketService.receiveStatus().subscribe((receivedMessage: string) => {
			console.log(receivedMessage);
		});
	}
	disconnectSocket() {
		this.websocketService.disconnectSocket();
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
