class Network {
}

class KWS extends Network {
	constructor(options = {}) {
		super();
		this.ids = {};
		this.node = options.node || 'ws://127.0.0.1:8091';
		this.start();
	}

	setNode(node) {
		this.stop();
		this.node = node;
		this.start();
	}
	start() {
		this.ws = new WebSocket(this.node);
		this.ws.onopen = e => {
			console.log('Connected ' + this.node, e);
			this.ws.onmessage = raw => {
				var e = false, data = {};
				try {
					data = JSON.parse(raw.data);
				} catch (exc) {
					e = exc;
				}
				if (e)
					console.log("ERROR", e, data.id, data.result || data);
				else
					console.log("RESULT:", data.id, data.result || data);

				//ids
				let id = data.id;
				if (id) {
					let cb = this.ids[id];
					if (cb) {
						cb(e, data.result || data);
						delete this.ids[id];
					} else {
						// console.log(`no CB for ${id}`);
					}
				}
			}
			if (this.sendOnConnect) {
				let a = this.sendOnConnect;
				this.sendOnConnect = null;
				this.send(a[0], a[1], a[2], a[3]);
			}
		}
	}
	stop() {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
	}
	restart() {
	}

	send(db, method, params, onmessage) {
		// if (!this.ws) {return}
		if (this.ws.readyState == 3) {
			if (!this.sendOnConnect && this.node) {
				console.log('Connection closed, reconnect...')
				this.sendOnConnect = [db, method, params, onmessage];
				this.start();
			} else {
				console.log("can't reconnect, try manually");
				this.sendOnConnect = null;
			}
			return;
		}
		let id = Math.random()*1000|0;			//todo
		this.ids[id] = onmessage;
		var req = {
			id: id,
			jsonrpc: '2.0',
			method: 'call',
			params: [db, method, params||[]]
		};
		this.ws.send(JSON.stringify(req));
	}
}
