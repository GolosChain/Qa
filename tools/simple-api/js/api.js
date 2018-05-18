// api params helpers
let _csv2Arr = csv => {return [csv.split(',')]};
let _str2Obj = str => {return [JSON.parse(str)]};

// loader
let apis = ['0.17', '0.18'], API = {};
for (let i in apis) {
	let v = apis[i];
	console.log(v);
	let s = document.createElement('script');
	s.src = `api-${v}.js`;
	document.head.appendChild(s);
}
