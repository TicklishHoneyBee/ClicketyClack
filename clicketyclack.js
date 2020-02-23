
function onLoad() {
	//asset.add(name,title,description,count,type,once,inc,enabled,cost,sectake,secgive,requires)
	alert("ClicketyClack is in VERY early development;\nThere's not much here,\nthere are bugs,\nbalance is a bit off in places,\nand your game IS NOT SAVED anywhere, at all.\nYou have been warned.");
	tickLib.init({steptime:10,calctime:1,displayonstep:true});

// RESOURCES

	resource.add('bank','Bank','$',0,0,true,[]);
	resource.add('track','Track','',0,0,false,[]);
	resource.add('goods',"Freight Carried",'',0,0,false,[{cat:'asset',name:'wagon-1',type:'rollingstock',count:1}]);
	resource.add('pass',"Passengers Carried",'',0,0,false,[{cat:'asset',name:'coach-1',type:'rollingstock',count:1}]);

// ASSETS

	asset.addTab('railway','Railway');
	asset.addTab('research','Research');
	asset.activateTab('railway');

// STARTER MONEY

	asset.addType('prerail','Getting Started','railway');
	asset.add('piggyback','Give Piggy Back Ride',"Gotta start somewhere.\n +$0.10",0,'prerail',false,{resource:'bank',count:0.1,inc:0},true,[],[],[],[]);
	asset.add('push','Push Wagon',"Goes faster with a push.\n +$0.20",0,'prerail',false,{resource:'bank',count:0.2,inc:0},false,[],[],[],[{cat:'asset',name:'wagon-1',type:'rollingstock',count:1}]);

// ASSETS

	asset.addType('track','Track','railway');
	asset.add('track-1','Track',"Can't build a railway without rails!",0,'track',false,{resource:'track',count:1,inc:0},false,[{resource:'bank',count:1,inc:5}],[],[],[{cat:'resource',name:'bank',count:2}]);

	asset.addType('earthwork','Earthwork','railway');
	asset.add('cutting','Cutting',"Level track means faster trains.",0,'earthwork',false,true,false,[{resource:'bank',count:5,inc:10}],[],[{resource:'bank',count:0,inc:2}],[{cat:'asset',name:'r-cutting',type:'civileng',count:1}]);
	asset.add('embankment','Embankment',"Level track means faster trains.",0,'earthwork',false,true,false,[{resource:'bank',count:5,inc:10}],[],[{resource:'bank',count:0,inc:2}],[{cat:'asset',name:'r-embankment',type:'civileng',count:1}]);
	asset.add('tunnel','Tunnel',"Tunnel through mountains to get there faster.",0,'earthwork',false,true,false,[{resource:'bank',count:10,inc:10}],[{resource:'bank',count:0.01,inc:0}],[{resource:'bank',count:0,inc:7}],[{cat:'asset',name:'r-tunnel',type:'civileng',count:1}]);

	asset.addType('rollingstock','Rollingstock','railway');
	asset.add('wagon-1','Open Wagon',"A basic wagon for moving freight.",0,'rollingstock',false,true,false,[{resource:'bank',count:3,inc:10}],[],[{resource:'bank',count:0.01,inc:0},{resource:'goods',count:0.00001,inc:0}],[{cat:'resource',name:'track',count:5}]);
	asset.add('wagon-2','Van','A covered wagon that carries more freight.',0,'rollingstock',false,true,false,[{resource:'bank',count:5,inc:10}],[],[{resource:'bank',count:0.02,inc:0},{resource:'goods',count:0.00002,inc:0}],[{cat:'asset',name:'r-vans',type:'mecheng',count:1}]);
	asset.add('wagon-3','Sheep Wagon','A covered wagon that carries sheep.',0,'rollingstock',false,true,false,[{resource:'bank',count:5,inc:10}],[],[{resource:'bank',count:0.03,inc:0},{resource:'goods',count:0.00003,inc:0}],[{cat:'asset',name:'platform',type:'structures',count:2},{cat:'asset',name:'r-animal',type:'mecheng',count:1}]);

	asset.addType('locos','Locomotives','railway');
	asset.add('loco-1','Saddle Tank',"A small steam loco for pulling wagons",0,'locos',false,true,false,[{resource:'bank',count:20,inc:5}],[{resource:'bank',count:0.03,inc:0}],[{resource:'bank',count:0,inc:15}],[{cat:'asset',name:'r-iron',type:'trackwork',count:1}]);
	asset.add('loco-2','Small Tender Engine',"A larger steam loco for pulling wagons.",0,'locos',false,true,false,[{resource:'bank',count:30,inc:5}],[{resource:'bank',count:0.02,inc:0}],[{resource:'bank',count:0,inc:20}],[{cat:'asset',name:'r-tender',type:'mecheng',count:1}]);

	asset.addType('structures','Structures','railway');
	asset.add('platform','Platform',"Makes loading and unloading of rollingstock quicker and easier.",0,'structures',false,true,false,[{resource:'bank',count:5,inc:10}],[],[{resource:'bank',count:0,inc:2}],[{cat:'asset',name:'r-civileng',type:'research',count:1}]);
	asset.add('hut',"Platelayers' Hut","Platelayers repair and lay new track.",0,'structures',false,true,false,[{resource:'bank',count:10,inc:10}],[],[{resource:'track',count:0.001,inc:0}],[{cat:'asset',name:'platform',type:'structures',count:10}]);
	asset.add('bridge','Bridge',"Cross over rivers and valleys to get there faster.",0,'structures',false,true,false,[{resource:'bank',count:10,inc:10}],[{resource:'bank',count:0.01,inc:0}],[{resource:'bank',count:0,inc:7}],[{cat:'asset',name:'r-bridge',type:'civileng',count:1}]);
	asset.add('groundframe',"Ground Frame","A simple lever frame for controlling track and signals.",0,'structures',false,true,false,[{resource:'bank',count:10,inc:10}],[],[{resource:'bank',count:0,inc:10}],[{cat:'asset',name:'signal',type:'research',count:1}]);
	asset.add('signalbox',"Signal Box","Better than a Ground Frame, includes Token and Block Instruments.",0,'structures',false,true,false,[{resource:'bank',count:10,inc:20}],[],[{resource:'bank',count:0,inc:10}],[{cat:'asset',name:'token',type:'research',count:1},{cat:'asset',name:'groundframe',type:'structures',count:10}]);

// RESEARCH

	asset.addType('research','Research','research');
	asset.add('r-civileng','Civil Engineering',"Unlocks buildings and track upgrades.",0,'research',true,true,false,[{resource:'bank',count:10,inc:0}],[],[],[{cat:'resource',name:'track',count:10},{cat:'asset',name:'wagon-1',type:'rollingstock',count:3}]);
	asset.add('r-mecheng','Mechanical Engineering',"Unlocks Locomotive and rollingstock upgrades.",0,'research',true,true,false,[{resource:'bank',count:40,inc:0}],[],[],[{cat:'resource',name:'track',count:20},{cat:'asset',name:'wagon-1',type:'rollingstock',count:10},{cat:'asset',name:'loco-1',type:'locos',count:2}]);
	asset.add('safeworking','Safeworking',"Find ways to safely run more trains.",0,'research',true,true,false,[{resource:'bank',count:40,inc:0}],[],[],[{cat:'asset',name:'wagon-1',type:'rollingstock',count:10},{cat:'asset',name:'loco-1',type:'locos',count:2}]);
	asset.add('signal','Signalling',"STAHP!!!.",0,'research',true,true,false,[{resource:'bank',count:50,inc:0}],[],[],[{cat:'asset',name:'safeworking',type:'research',count:1}]);
	asset.add('token','Tokens',"Token working helps prevent collisions.",0,'research',true,true,false,[{resource:'bank',count:60,inc:0}],[],[],[{cat:'asset',name:'signal',type:'research',count:1}]);

	asset.addType('trackwork','Trackwork','research');
	asset.add('r-iron','Iron Rails',"Strong rails that can support a locomotive.",0,'trackwork',true,true,false,[{resource:'bank',count:20,inc:0}],[],[],[{cat:'resource',name:'track',count:20},{cat:'asset',name:'wagon-1',type:'rollingstock',count:10},{cat:'asset',name:'r-civileng',type:'research',count:1}]);
	asset.add('r-ballast','Ballast',"Gives a smoother ride suitable for passengers and animals.",0,'trackwork',true,true,false,[{resource:'bank',count:50,inc:0}],[],[],[{cat:'resource',name:'track',count:50},{cat:'asset',name:'wagon-1',type:'rollingstock',count:10},{cat:'asset',name:'r-iron',type:'trackwork',count:1}]);

	asset.addType('civileng','Civil Engineering','research');
	asset.add('r-cutting','Cuttings',"Why go round a hill when you can go through it?",0,'civileng',true,true,false,[{resource:'bank',count:20,inc:0}],[],[],[{cat:'resource',name:'track',count:30},{cat:'asset',name:'r-civileng',type:'research',count:1}]);
	asset.add('r-tunnel','Tunnels',"Go through mountains too!",0,'civileng',true,true,false,[{resource:'bank',count:20,inc:0}],[],[],[{cat:'resource',name:'track',count:40},{cat:'asset',name:'cutting',type:'earthwork',count:1}]);
	asset.add('r-embankment','Embankments',"Lift the tracks clear of low ground.",0,'civileng',true,true,false,[{resource:'bank',count:20,inc:0}],[],[],[{cat:'resource',name:'track',count:30},{cat:'asset',name:'r-cutting',type:'civileng',count:1}]);
	asset.add('r-bridge','Bridges',"Lay track over rivers and deep valleys.",0,'civileng',true,true,false,[{resource:'bank',count:20,inc:0}],[],[],[{cat:'resource',name:'track',count:40},{cat:'asset',name:'embankment',type:'earthwork',count:1}]);

	asset.addType('mecheng','Mechanical Engineering','research');
	asset.add('r-vans','Vans','Covered wagons that carry more freight.',0,'mecheng',true,true,false,[{resource:'bank',count:30,inc:0}],[],[],[{cat:'resource',name:'track',count:20},{cat:'asset',name:'wagon-1',type:'rollingstock',count:20},{cat:'asset',name:'r-mecheng',type:'research',count:1}]);
	asset.add('r-animal','Animal Vans','Covered wagons that carry animals.',0,'mecheng',true,true,false,[{resource:'bank',count:30,inc:0}],[],[],[{cat:'resource',name:'track',count:60},{cat:'asset',name:'wagon-2',type:'rollingstock',count:5},{cat:'asset',name:'r-mecheng',type:'research',count:1},{cat:'asset',name:'r-ballast',type:'trackwork',count:1}]);
	asset.add('r-tender','Tender Locos',"Loco's with more coal and water storage don't have to stop as often.",0,'mecheng',true,true,false,[{resource:'bank',count:50,inc:0}],[],[],[{cat:'asset',name:'r-animal',type:'mecheng',count:1}]);

// EVENTS

	events.add('investor','Investor',
		function(r) {
			if ((r%100) != 0)
				return false;
			if (events.getBoostCount('investor') > 0)
				return false
			var t = resource.getItem('bank');
			if (t == null || t.base <0.1)
				return false;

			return true;
		},
		function() {
			var t = resource.getItem('bank');

			var base = Math.ceil(t.count*0.1);
			var boost = base*10.0;
			if (boost > 50)
				boost = 50;
			if (base < 1)
				return;
			if (base > (t.base*11))
				base = t.base*9;
			tickLog.addLog('An Investor has given you $'+base.toFixed(2)+' in return for '+boost.toFixed(1)+'% of your income for 10 seconds.');
			resource.increment('bank',base);
			events.addBoost('investor',10000,'bank',0,-boost);
		}
	);
	events.add('accident','Accident',
		function(r) {
			if ((r%10) != 0)
				return false;
			if (events.getBoostCount('accident') > 0)
				return false;
			var t = resource.getItem('track');
			if (t == null)
				return false;
			var wc = 0;
			var w = asset.getItem('wagon-1','rollingstock');
			if (w == null || w.count < 4)
				return false;
			wc += w.count;
			w = asset.getItem('wagon-2','rollingstock');
			if (w != null)
				wc += w.count;
			w = asset.getItem('wagon-3','rollingstock');
			if (w != null)
				wc += w.count;

			var tc = t.count;
			var tt = asset.getItem('safeworking','research');
			if (tt == null || tt.count > 0)
				tc *= 2;
			tt = asset.getItem('token','research');
			if (tt == null || tt.count > 0)
				tc *= 2;
			tt = asset.getItem('signal','research');
			if (tt == null || tt.count > 0)
				tc *= 2;

			if (tc < wc)
				return true;

			tc *= 5;

			tc -= wc;
			if (tc < 0)
				return true;

			if ((r%tc) == 0)
				return true;

			return false;
		},
		function() {
			var t = resource.getItem('track');
			if (t == null)
				return;
			var wc = 0;
			var w = asset.getItem('wagon-1','rollingstock');
			if (w == null || w.count < 4)
				return;
			wc += w.count;
			w = asset.getItem('wagon-2','rollingstock');
			if (w != null)
				wc += w.count;
			w = asset.getItem('wagon-3','rollingstock');
			if (w != null)
				wc += w.count;

			var bust = 0;
			var cost = 0;

			var tc = t.count;
			var tt = asset.getItem('safeworking','research');
			if (tt == null || tt.count > 0)
				tc *= 2;
			tt = asset.getItem('token','research');
			if (tt == null || tt.count > 0)
				tc *= 2;
			tt = asset.getItem('signal','research');
			if (tt == null || tt.count > 0)
				tc *= 2;

			if (tc < wc)
				bust += tickLib.randRange(1,(wc-tc));

			tc *= 5;

			tc -= wc;

			cost = tickLib.randRange(1,(tc/wc)*0.2);

			var txt = 'An accident has occurred! Cost: $'+cost;
			if (bust > 0)
				txt += ' plus '+bust+' Rollingstock destroyed';
			txt += '.';

			tickLog.addLog(txt);
			w = resource.getItem('bank');
			if (w != null && w.count < cost)
				cost = w.count;
			resource.decrement('bank',cost);
			if (bust < 1)
				return;

			w = asset.getItem('wagon-3','rollingstock');
			if (w != null && w.count > 0) {
				if (w.count < bust) {
					bust -= w.count;
					asset.decrement('wagon-3','rollingstock',w.count);
				}else{
					asset.decrement('wagon-3','rollingstock',bust);
					return;
				}
			}

			w = asset.getItem('wagon-2','rollingstock');
			if (w != null && w.count > 0) {
				if (w.count < bust) {
					bust -= w.count;
					asset.decrement('wagon-2','rollingstock',w.count);
				}else{
					asset.decrement('wagon-2','rollingstock',bust);
					return;
				}
			}

			w = asset.getItem('wagon-1','rollingstock');
			if (w != null && w.count > 0) {
				if (w.count < bust) {
					bust -= w.count;
					asset.decrement('wagon-1','rollingstock',w.count);
				}else{
					asset.decrement('wagon-1','rollingstock',bust);
					return;
				}
			}
		}
	);

	tickControl.start();
}
