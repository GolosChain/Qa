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
			console.log(e);
			this.ws.onmessage = raw => {
				var e = false, data = {};
				try {
					data = JSON.parse(raw.data);
				} catch (exc) {
					e = exc;
				}
				if (e)
					console.log(e, id, data.result || data);
				else
					console.log(id, data.result || data);

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
// 		if (!this.ws) {return}
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
