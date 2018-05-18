// api params helpers
let _csv2Arr = csv => {return [csv.split(',')]};
let _str2Obj = str => {return [JSON.parse(str)]};

let fixApiParams = (name, args) => {let fn = ApiParamsFix[name]||console.log;return fn.apply(null, args)};

// loader
let APIS = ['0.17', '0.18'],
    API = {};
for (let i in APIS) {
	let v = APIS[i];
	console.log(v);
	let s = document.createElement('script');
	s.src = `api-${v}.js?`+Date.now();
	document.head.appendChild(s);
}

function normApi(x, needIdx) {
    let i = {17:1, '17':1, '17.0':1, 18:2, '18':2, '18.0':2}[x];
    i = i ? i - 1 : 0;
    return needIdx ? i : APIS[i];
}
