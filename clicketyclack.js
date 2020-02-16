
function onLoad() {
	tickLib.init({steptime:10,calctime:1,displayonstep:true});
	resource.add('bank','Bank','$',0,0,true,[]);
	resource.add('track','Track','',0,0,false,[]);

	asset.addTab('railway','Railway');
	asset.addTab('research','Research');
	asset.activateTab('railway');

	asset.addType('prerail','Getting Started','railway');
	asset.add('piggyback','Give Piggy Back Ride',"Gotta start somewhere.\n +$0.10",0,'prerail',false,{resource:'bank',count:0.1,inc:0},true,[],[],[],[]);
	asset.add('push','Push Wagon',"Goes faster with a push.\n +$0.25",0,'prerail',false,{resource:'bank',count:0.25,inc:0},false,[],[],[],[{cat:'asset',name:'wagon-1',type:'rollingstock',count:1}]);

	asset.addType('track','Track','railway');
	asset.add('track-1','Track',"Can't build a railway without rails!",0,'track',false,{resource:'track',count:1,inc:0},false,[{resource:'bank',count:1,inc:5}],[],[],[{cat:'resource',name:'bank',count:2}]);

	asset.addType('rollingstock','Rollingstock','railway');
	asset.add('wagon-1','Open Wagon',"A basic wagon for moving freight.",0,'rollingstock',false,true,false,[{resource:'bank',count:3,inc:5}],[],[{resource:'bank',count:0.01,inc:0}],[{cat:'resource',name:'track',count:5}]);

	asset.addType('locos','Locomotives','railway');

	asset.addType('structures','Structures','railway');
	asset.add('platform','Platform',"Makes loading and unloading of rollingstock quicker and easier.",0,'structures',false,true,false,[{resource:'bank',count:5,inc:5}],[],[{resource:'bank',count:0,inc:5}],[{cat:'asset',name:'r-civileng',type:'research',count:1}]);

	asset.addType('research','Research','research');
	asset.add('r-civileng','Civil Engineering',"Unlocks buildings and track upgrades.",0,'research',true,true,false,[{resource:'bank',count:10,inc:0}],[],[],[{cat:'resource',name:'track',count:10},{cat:'asset',name:'wagon-1',type:'rollingstock',count:3}]);
	asset.add('r-mecheng','Mechanic Engineering',"Unlocks Locomotive and rollingstock upgrades.",0,'research',true,true,false,[{resource:'bank',count:100,inc:0}],[],[],[{cat:'resource',name:'track',count:20},{cat:'asset',name:'wagon-1',type:'rollingstock',count:10}]);

	asset.addType('trackwork','Trackwork','research');
	asset.add('r-iron','Iron Rails',"Strong rails that can support a locomotive.",0,'trackwork',true,true,false,[{resource:'bank',count:20,inc:0}],[],[],[{cat:'resource',name:'track',count:20},{cat:'asset',name:'wagon-1',type:'rollingstock',count:10},{cat:'asset',name:'r-civileng',type:'research',count:1}]);
	asset.add('r-ballast','Ballast',"Gives a smoother ride suitable for passengers",0,'trackwork',true,true,false,[{resource:'bank',count:100,inc:0}],[],[],[{cat:'resource',name:'track',count:50},{cat:'asset',name:'wagon-1',type:'rollingstock',count:10},{cat:'asset',name:'r-iron',type:'trackwork',count:1}]);

	asset.addType('civileng','Civil Engineering','research');
	asset.add('r-cutting','Cuttings',"Why go round a hill when you can go through it?",0,'civileng',true,true,false,[{resource:'bank',count:20,inc:0}],[],[],[{cat:'resource',name:'track',count:20},{cat:'asset',name:'r-civileng',type:'research',count:1}]);
	asset.add('r-tunnel','Tunnels',"Go through mountains too!",0,'civileng',true,true,false,[{resource:'bank',count:20,inc:0}],[],[],[{cat:'asset',name:'r-cutting',type:'civileng',count:1}]);
	asset.add('r-embankment','Embankments',"Lift the tracks clear of low ground.",0,'civileng',true,true,false,[{resource:'bank',count:20,inc:0}],[],[],[{cat:'resource',name:'track',count:20},{cat:'asset',name:'r-cutting',type:'civileng',count:1}]);
	asset.add('r-bridge','Bridges',"Lay track over rivers and deep valleys.",0,'civileng',true,true,false,[{resource:'bank',count:20,inc:0}],[],[],[{cat:'resource',name:'track',count:20},{cat:'asset',name:'r-embankment',type:'civileng',count:1}]);

	asset.addType('mecheng','Mechanical Engineering','research');

	tickControl.start();
}
