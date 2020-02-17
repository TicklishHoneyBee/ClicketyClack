var tickLog = {
	state:0, // 1 for debug, 2 for core debug
	length:{
		max:20,
		current:0
	},
	addLog:function(t) {
		var p = document.getElementById("logbox");
		if (!p)
			return;
		var n = document.createElement('p');
		n.innerText = t;
		if (p.firstChild) {
			p.insertBefore(n,p.firstChild);
		}else{
			p.appendChild(n);
		}
		tickLog.length.current++;
		while (tickLog.length.current > tickLog.length.max) {
			p.removeChild(p.lastChild);
			tickLog.length.current--;
		}
	},
	clearLog:function() {
		var po = document.getElementById("logbox");
		if (!po)
			return;
		var p = po.cloneNode(false);
		po.parentNode.replaceChild(p.po);
	},
	debug:function(t) {
		if (tickLog.state <1)
			return;
		tickLog.addLog('DEBUG: '+t);
	},
	core:function(t) {
		if (tickLog.state <2)
			return;
		tickLog.addLog('CORE: '+t);
	},
	addError:function(t) {
		tickLog.addLog('ERROR: '+t);
	}
};

var tickControl = {
	rate:{
		step:10,
		recalc:300
	},
	length:{
		step:0,
		recalc:0,
	},
	state:0, // 0 stopped, 1 paused, 2 running
	ticker:{
		timer:null,
		last: {
			step:0,
			recalc:0,
		},
		step:function() {
			if (tickControl.state != 2)
				return;
			var tickStart = Date.now();
			if (tickStart-tickControl.ticker.last.recalc > tickControl.length.recalc) {
				tickControl.ticker.recalc();
				tickControl.ticker.last.recalc = tickStart;
			}

			asset.update();
			resource.update();

			var tickEnd = Date.now();
			var tickNext = tickControl.length.step-(tickEnd-tickStart);
			if (tickNext > tickControl.length.step)
				tickNext = tickControl.length.step;
			tickControl.ticker.timer = setTimeout(tickControl.ticker.step,tickNext);
		},
		recalc:function() {
			tickLog.core("recalc");
			resource.reset();
			asset.recalc();
			asset.display();
			resource.recalc();
			resource.display();
		}
	},
	init:function(s,r) {
		if (tickControl.state != 0)
			return;
		if (s>1 && s<1001)
			tickControl.rate.step = s;
		if (r>0 && r<1001)
			tickControl.rate.recalc = r;
		tickControl.length.step = (1000.0/tickControl.rate.step);
		tickControl.length.recalc = (1000.0*tickControl.rate.recalc);
	},
	start:function() {
		if (tickControl.length <= 0)
			return false;
		if (tickControl.state > 1)
			return false;
		tickControl.state = 2;
		tickControl.ticker.last.step = 0;
		tickControl.ticker.last.recalc = 0;

		tickControl.ticker.step();
	},
	stop:function() {
		if (tickControl.state != 2)
			return;

		tickControl.state = 0;
	},
	pause:function() {
		tickControl.stop(); // probably be its own thing later
	}
};

var resource = {
	displayonstep:false,
	items:[],	// {name:'string',title:'string',enabled:bool,prefix:'string',count:integer,max:integer,base:float,add:float,inc:float,rec:array of objects}
	reset:function() {
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].enabled == false)
				continue;
			resource.items[i].base = 0;
			resource.items[i].add = 0;
			resource.items[i].inc = 0;
		}
	},
	update:function() {
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].enabled == false)
				continue;
			resource.items[i].count += resource.items[i].inc;
			if (resource.items[i].max > 0 && resource.items[i].count > resource.items[i].max)
				resource.items[i].count = resource.items[i].max;
		}
		if (resource.displayonstep)
			resource.display();
	},
	recalc:function() {
		tickLog.core('resource.recalc');
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].enabled == false)
				continue;

			var ii = (resource.items[i].base/100.0)*resource.items[i].add;
			resource.items[i].inc = (resource.items[i].base+ii)/tickControl.rate.step;
		}
	},
	display:function() {
		var po = document.getElementById('resource');
		if (!po) {
			tickLog.debug('no resource display');
			return;
		}
		var p = po.cloneNode(false);
		po.parentNode.replaceChild(p,po);
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].enabled == false)
				continue;
			var n = document.createElement('div');

			var s = document.createElement('span');
			s.className = 'resourcename';
			s.appendChild(document.createTextNode(resource.items[i].title));
			n.appendChild(s);

			s = document.createElement('span');
			s.className = 'resourcecount';
			var t = resource.items[i].prefix+''+resource.items[i].count.toFixed(2);
			if (resource.items[i].max > 0)
				t += '/'+parseInt(resource.items[i].max);

			s.appendChild(document.createTextNode(t));
			n.appendChild(s);

			if (resource.items[i].inc != 0) {
				s = document.createElement('span');
				s.className = 'resourceadd';
				s.appendChild(document.createTextNode((resource.items[i].inc*tickControl.rate.step).toFixed(2)+'/s'));
				n.appendChild(s);
			}

			p.appendChild(n);
		}
	},
	add:function(name,title,prefix,count,max,enabled,requires) {
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].name == name) {
				tickLog.debug('resource "'+name+'" already exists');
				return;
			}
		}
		resource.items.push({name:name,title:title,enabled:enabled,prefix:prefix,count:count,max:max,base:0,add:0,inc:0,rec:requires});
		tickLog.debug('added, resources: '+resource.items.length);
	},
	enable:function(name) {
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].name == name) {
				resource.items[i].enabled = true;
				break;
			}
		}
	},
	disable:function(name) {
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].name == name) {
				resource.items[i].enabled = false;
				break;
			}
		}
	},
	increment:function(name,inc) {
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].name == name) {
				resource.items[i].enabled = true;
				resource.items[i].count += inc;
				break;
			}
		}
	},
	getItem:function(name) {
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].name == name) {
				return resource.items[i];
				break;
			}
		}
		return null;
	},
	decrement:function(name,dec) {
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].name == name) {
				resource.items[i].enabled = true;
				if (resource.items[i].count < dec)
					return false;
				resource.items[i].count -= dec;
				return true;
				break;
			}
		}
		return false;
	},
	test:function(name,count) {
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].name == name) {
				if (!resource.items[i].enabled)
					return false
				if (resource.items[i].count < count)
					return false;
				return true;
				break;
			}
		}
		return false;
	},
	addBase:function(name,count) {
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].name == name) {
				resource.items[i].enabled = true;
				resource.items[i].base += count;
				break;
			}
		}
		tickLog.core('addBase("'+name+'",'+count+')');
	},
	addBoost:function(name,count) {
		for (var i=0; i<resource.items.length; i++) {
			if (resource.items[i].name == name) {
				resource.items[i].enabled = true;
				resource.items[i].add += count;
				break;
			}
		}
		tickLog.core('addBoost("'+name+'",'+count+')');
	}
};

var asset = {
	tabs:[],	// {name:'string',title:'string'}
	types:[],	// {name:'string',title:'string',tab:'string'}
	items:[],	// {name:'string',title:'string',tooltip:'string',enabled:bool,count:integer,type:'string',once:boolean,inc:boolean or object,cost:array of objects, sectake:array of objects, secgive: array of objects,rec:array of objects}
			// 	{resource:'string',count:float,inc:float}
			//	{cat:'string',name:'string',type:'string',count:integer}
	once:false,	// if true 'once' types are visible after claiming
	updateDisplay:true, // marked true when the display needs updating, reset by display()
	active:{
		tab:'',
		info:''
	},
	reset:function() {
	},
	update:function() {
		for (var i=0; i<asset.items.length; i++) {
			if (asset.items[i].enabled == true)
				continue;
			if (asset.items[i].once && asset.items[i].count)
				continue;
			if (asset.rec(asset.items[i])) {
				tickLog.debug('enabling "'+asset.items[i].name+'"');
				asset.items[i].enabled = true;
				asset.updateDisplay = true;
			}
		}
	},
	recalc:function() {
		tickLog.core('asset.recalc');
		for (var i=0; i<asset.items.length; i++) {
			if (asset.items[i].enabled == false)
				continue;
			if (asset.items[i].once && !asset.items[i].count)
				continue;
			for (var k=0; k<asset.items[i].sectake.length; k++) {
				resource.addBase(asset.items[i].sectake[k].resource,-asset.items[i].sectake[k].count*asset.items[i].count);
				resource.addBoost(asset.items[i].sectake[k].resource,-asset.items[i].sectake[k].inc*asset.items[i].count);
			}
			for (var k=0; k<asset.items[i].secgive.length; k++) {
				resource.addBase(asset.items[i].secgive[k].resource,asset.items[i].secgive[k].count*asset.items[i].count);
				resource.addBoost(asset.items[i].secgive[k].resource,asset.items[i].secgive[k].inc*asset.items[i].count);
			}
		}
	},
	display:function() {
		tickLog.core('asset.display');
		if (!asset.updateDisplay)
			return;
		var info = false;
		var t = document.getElementById('tablist');
		var a = document.getElementById('action');
		if (!a || !t) {
			tickLog.debug('no asset display');
			return;
		}
		var tt = t.cloneNode(false);
		t.parentNode.replaceChild(tt,t);
		t = tt;
		for (var j=0; j<asset.tabs.length; j++) {
			tt = document.createElement('div');
			tt.className = 'tablist-button';
			if (asset.tabs[j].name == asset.active.tab)
				tt.className += ' tablist-active';
			tt.id = 'tablist-'+asset.tabs[j].name;
			tt.data = asset.tabs[j].name;
			tt.onclick = asset.clickTab;
			tt.appendChild(document.createTextNode(asset.tabs[j].title));
			t.appendChild(tt);
			var p;
			var po = document.getElementById('action-'+asset.tabs[j].name);
			if (po) {
				p = po.cloneNode(false);
				po.parentNode.replaceChild(p,po);
			}else{
				p = document.createElement('div');
				p.id = 'action-'+asset.tabs[j].name;
				p.className = 'action-tab';
				a.appendChild(p);
			}
			if (asset.tabs[j].name != asset.active.tab) {
				p.style.display = 'none';
				continue;
			}
			p.style.display = 'block';
			for (var k=0; k<asset.types.length; k++) {
				if (asset.tabs[j].name != asset.types[k].tab)
					continue;
				tt = document.createElement('div');
				tt.className = 'action-type';
				tt.appendChild(document.createTextNode(asset.types[k].title));
				p.appendChild(tt);
				var c = 0;
				for (var i=0; i<asset.items.length; i++) {
					if (asset.items[i].enabled == false)
						continue;
					if (asset.items[i].type != asset.types[k].name)
						continue;
					if (asset.items[i].once && asset.items[i].count && !asset.once)
						continue;
					var n = document.createElement('button');
					n.type = 'button';
					n.value = asset.items[i].name;
					n.title = asset.items[i].tooltip;
					n.onmouseover = asset.hoverBegin;
					n.onmouseout = asset.hoverEnd;
					if (!asset.cost(asset.items[i],false))
						n.disabled = true;
					if (asset.items[i].name == asset.active.info) {
						var ii = document.getElementById('info');
						if (ii) {
							var ij = ii.cloneNode(false);
							ii.parentNode.replaceChild(ij,ii);
							ii = ij;
							var txt = asset.items[i].tooltip;
							var ct = '';
							for (var l=0; l<asset.items[i].cost.length; l++) {
								var r = resource.getItem(asset.items[i].cost[l].resource);
								var rt = '';
								if (r == null)
									continue;
								rt += "\n ";
								if (r.prefix == '') {
									rt += r.title+': ';
								}else{
									rt += r.prefix;
								}
								var cc = asset.calcCost(asset.items[i].cost[l],asset.items[i]);

								if (resource.test(r.name,cc)) {
									rt += cc.toFixed(2);
								}else{
									rt += '<span class="red">'+cc.toFixed(2)+'</span>';
								}

								ct += rt;
							}
							if (ct != '') {
								txt += "\nCost:"+ct;
							}
							ct = '';
							for (var l=0; l<asset.items[i].secgive.length; l++) {
								var rt = '';
								var r = resource.getItem(asset.items[i].secgive[l].resource);
								if (r == null)
									continue;
								rt += "\n ";
								rt += r.title+': ';
								if (asset.items[i].secgive[l].count > 0.0) {
									rt += asset.items[i].secgive[l].count.toFixed(2)+'/s ';
								}
								if (asset.items[i].secgive[l].inc > 0.0) {
									rt += asset.items[i].secgive[l].inc.toFixed(2)+'% Boost';
								}

								ct += rt;
							}
							if (ct != '') {
								txt += "\nGives:"+ct;
							}
							ii.innerHTML = txt;
							ct = '';
							for (var l=0; l<asset.items[i].sectake.length; l++) {
								var rt = '';
								var r = resource.getItem(asset.items[i].sectake[l].resource);
								if (r == null)
									continue;
								rt += "\n ";
								rt += r.title+': ';
								if (asset.items[i].sectake[l].count > 0.0) {
									rt += asset.items[i].sectake[l].count.toFixed(2)+'/s ';
								}

								ct += rt;
							}
							if (ct != '') {
								txt += "\nTakes:"+ct;
							}
							ii.innerHTML = txt;
						}else{
							tickLog.debug('no asset info display');
						}
					}
					if (asset.items[i].once) {
						n.appendChild(document.createTextNode(asset.items[i].title));
					}else{
						var txt = asset.items[i].title;
						if (asset.items[i].count > 0)
							txt += ' ('+parseInt(asset.items[i].count)+')';
						n.appendChild(document.createTextNode(txt));
					}
					n.onclick = asset.click;
					p.appendChild(n);
					c++;
				}
				tickLog.core(asset.types[k].name+'|'+c);
				if (!c)
					tt.style.display = 'none';
			}
		}
		if (!info)
			asset.active.info = '';
		asset.updateDisplay = false;
	},
	add:function(name,title,description,count,type,once,inc,enabled,cost,sectake,secgive,requires) {
		for (var i=0; i<asset.items.length; i++) {
			if (asset.items[i].name == name) {
				tickLog.debug('asset "'+name+'" already exists');
				return;
			}
		}
		asset.items.push({name:name,title:title,tooltip:description,enabled:enabled,count:count,type:type,once:once,inc:inc,cost:cost,sectake:sectake,secgive:secgive,rec:requires});
		tickLog.debug('added, assets: '+asset.items.length);
	},
	addType:function(name,title,tab) {
		for (var i=0; i<asset.types.length; i++) {
			if (asset.types[i].name == name) {
				tickLog.debug('asset type "'+name+'" already exists');
				return;
			}
		}
		asset.types.push({name:name,title:title,tab:tab});
		tickLog.debug('added, asset types: '+asset.types.length);
	},
	addTab:function(name,title) {
		for (var i=0; i<asset.tabs.length; i++) {
			if (asset.tabs[i].name == name) {
				tickLog.debug('asset tab "'+name+'" already exists');
				return;
			}
		}
		asset.tabs.push({name:name,title:title});
		tickLog.debug('added, asset tabs: '+asset.tabs.length);
	},
	enable:function(name) {
	},
	disable:function(name) {
	},
	activateTab:function(name) {
		for (var i=0; i<asset.tabs.length; i++) {
			if (asset.tabs[i].name == name) {
				tickLog.debug('activate tab "'+name+'"');
				asset.active.tab = name;
				return;
			}
		}
		tickLog.debug('unknown tab "'+name+'"');
	},
	calcCost:function(item,baseItem) {
		var count = 0;
		if (typeof baseItem.inc == 'boolean') {
			count = baseItem.count;
		}else{
			var i = resource.getItem(baseItem.inc.resource);
			if (i != null)
				count = i.count;
		}
		return item.count+((item.count*(item.inc/100.0))*count);
	},
	cost:function(item,take) {
		for (var i=0; i<item.cost.length; i++) {
			if (!resource.test(item.cost[i].resource,asset.calcCost(item.cost[i],item)))
				return false;
		}
		if (take) {
			for (var i=0; i<item.cost.length; i++) {
				if (!resource.decrement(item.cost[i].resource,asset.calcCost(item.cost[i],item)))
					return false;
			}
		}
		return true;
	},
	rec:function(item) {
		for (var i=0; i<item.rec.length; i++) {
			if (item.rec[i].cat == 'resource') {
				if (!resource.test(item.rec[i].name,item.rec[i].count))
					return false;
			}else if (item.rec[i].cat == 'asset') {
				if (!asset.test(item.rec[i].name,item.rec[i].type,item.rec[i].count))
					return false;
			}else{
				return false;
			}
		}
		return true;
	},
	test:function(name,type,count) {
		for (var i=0; i<asset.items.length; i++) {
			if (asset.items[i].name == name && asset.items[i].type == type) {
				if (!asset.items[i].enabled)
					return false;
				if (asset.items[i].count < count)
					return false;
				return true;
				break;
			}
		}
		return false;
	},
	getItem:function(name,type) {
		for (var i=0; i<asset.items.length; i++) {
			if (asset.items[i].name == name && asset.items[i].type == type) {
				if (!asset.items[i].enabled)
					return null;
				return asset.items[i];
				break;
			}
		}
		return null;
	},
	click:function(e) {
		for (var i=0; i<asset.items.length; i++) {
			if (asset.items[i].name == e.target.value) {
				if (!asset.cost(asset.items[i],true)) {
					tickLog.addError('can not afford '+asset.items[i].title+' yet');
					return;
				}
				if (typeof asset.items[i].inc == 'boolean') {
					asset.items[i].count++;
				}else{
					resource.increment(asset.items[i].inc.resource,asset.items[i].inc.count);
				}
				asset.updateDisplay = true;
				asset.display();
				return;
			}
		}
		tickLog.debug('unknown asset "'+e.target.value+'"');
	},
	hoverBegin:function(e) {
		for (var i=0; i<asset.items.length; i++) {
			if (asset.items[i].name == e.target.value) {
				if (!asset.items[i].enabled)
					return false
				asset.active.info = e.target.value;
				asset.updateDisplay = true;
				return false;
				break;
			}
		}
		return false;
	},
	hoverEnd:function(e) {
		if (e.target.value == asset.active.info) {
			asset.active.info = '';
			asset.updateDisplay = true;
		}
		return false;
	},
	clickTab:function(e) {
		for (var i=0; i<asset.tabs.length; i++) {
			if (asset.tabs[i].name == e.target.data) {
				tickLog.core('tab click: '+e.target.data);
				asset.activateTab(e.target.data);
				asset.updateDisplay = true;
				asset.display();
				return;
			}
		}
		tickLog.debug('unknown tab "'+e.target.data+'"');
	}
};

var tickLib = {
	init:function(args) {
		var steptime = 10;
		var calctime = 1;
		if (typeof args.steptime != 'undefined')
			steptime = args.steptime;
		if (typeof args.calctime != 'undefined')
			calctime = args.calctime;
		if (typeof args.debug != 'undefined') {
			if (args.debug)
				tickLog.debug = 1;
		}
		if (typeof args.displayonstep != 'undefined')
			resource.displayonstep = args.displayonstep;
		tickControl.init(steptime,calctime);
		tickLib.update();
		window.onhashchange = tickLib.parseHash;
		window.onresize = tickLib.update;
	},
	update:function() {
		tickLib.parseHash();
		tickLib.resize();
	},
	resize:function() {
		tickLog.length.max = (document.body.offsetHeight-60)/20;
	},
	parseHash:function() {
		var h = window.location.hash.substr(1);
		var ha = h.split('&');
		for (var i=0; i<ha.length; i++) {
			var v = ha[i].split('=');
			if (v.length == 1)
				v[1] = '1';

			switch (v[0]) {
			case 'debug':
				tickLog.state = parseInt(v[1]);
				if (tickLog.state > 1) {
					tickLog.debug('core enabled');
				}else if (tickLog.state > 0) {
					tickLog.debug('enabled');
				}else{
					tickLog.debug('disabled');
				}
				break;
			case 'displayonstep':
				resource.displayonstep = true;
				break;
			}
		}
	}
};
