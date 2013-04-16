//The interval is being used. Alway one.
var CurrentInterval = {
		obj:new Object(),
		interval:new Number()
}
function Interval(obj_in){
	this.obj = obj_in;
	this.doInterval=function()
	{
		//Polimorphismus: Abstract method!
		//will be for example.
		//CurrentInterval.interval = window.setInterval("CurrentInterval.obj.setOpacityOut()", CurrentInterval.obj.fxTransition);
	}
}
//A colection of Interval actions.
//do interval is polimolphic, and this Method doInterval() may difers from each other.
//it is created, for example, when a fx is created.
function IntervalStates()
{
	//The interval must be started on executing when its state is ideln)
	//if the state is Running, the new interval will be added at the end of the Interval list <LoadedIntervals.index>
	//and will be started when posible.
	this.stateValue = 0;//0=Interval not Initialized, 1 = Interval Running, 2 = Interval Ideln 
}
var LoadedIntervals = {
		index:new Array(),
		CurrentIndex: -1,//default
		state:new IntervalStates(),
		resetIntervals: function()
		{
			this.index = new Array();
			this.CurrentIndex = -1;
			CurrentInterval.obj=new Object();
			CurrentInterval.interval=new Number();
		},
		execute:function()
		{
			if (this.state.stateValue==0)
			{
				this.state.stateValue = 2;
			}
			//The state is IDELN. Also, the Intervals can be started.
			//Otherwise, the Interval has also been added into the lis of intervals to be run,
			//and will be runned wenn posible.
			if (this.state.stateValue == 2)
			{
				if (this.index.length>0)
				{
					this.index[0].doInterval();
				}
			}
		},
		addInterval:function(obj_in)
		{
			var newInterval = new Interval(obj_in);
			this.index.push(newInterval);
		},
		ClearInterval:function()
		{
			window.clearInterval(CurrentInterval.interval);
			var NextExecute = this.CurrentIndex+1;
			if (this.index[NextExecute])
			{
				this.index[NextExecute].doInterval();
			}else{
				LoadedIntervals.state.stateValue = 2;
				this.resetIntervals();
			}
		},
		getNextInterval:function()
		{
			var nIntervalsToBeLoaded = this.index.length;
			if (this.index.length==0)
			{
				//there are no Intervals to be loaded.
				return false;
			}else
			{
				var LastIntervalIndex = nIntervalsToBeLoaded-1;
				var NextIntervalIndex = this.CurrentIndex+1;
				if (NextIntervalIndex<=LastIntervalIndex)
				{
					CurrentInterval.obj = this.index[NextIntervalIndex].obj;
					this.CurrentIndex = NextIntervalIndex;
					return CurrentInterval;
				}else{
					//No more intervals to do
					this.resetIntervals();
					return false;
				}
			} 
		}
}
var counter = 0;

function Fx(oHTMLElementIn,bWidth,bHeight) 
{
	this.div = oHTMLElementIn;
//	this.fxHeight = oHTMLElementIn.offsetHeight;
	this.fxHeight = null;
	this.setFxHeight=function(childNodeIn)
	{
		if (childNodeIn==undefined)
		{
			var childNodeIn = this.div;
		}
/*		if (childNodeIn.offsetHeight)
		{
			this.fxHeight += childNodeIn.offsetHeight;
		}
*/
		if (childNodeIn.childNodes.length>0)
		{
			
			for (var x=0;x<childNodeIn.childNodes.length;x++)
			{
				if (childNodeIn.childNodes[x].nodeType==1)
				{
					this.fxHeight += childNodeIn.childNodes[x].offsetHeight;
					//this.setFxHeight(childNodeIn.childNodes[x]);
				}else if(childNodeIn.childNodes[x].nodeType==1){
					
				}
			}
		}
		this.fxHeight += 5;
	},
	//this.setFxHeight();
	//this.fxHeight = oHTMLElementIn.offsetHeight;
	//this.fxWidth = oHTMLElementIn.offsetWidth;
	this.fxWidth = null;
	this.fxIntervalHeight = 0.0;
	this.fxExpandHeight = oHTMLElementIn.offsetHeight;
	this.fxTimeToExpand= 500;
	this.fxTimeToFade = 250;
	this.fxTransition = 0.0; //trans
	this.fxDuration = 0.0;
	this.fxTransitionStartedTime = 0.0;
	this.fxTimeToEndTransition = 0.0;
	this.div.FadeLevel = 1;
	this.div.FadeIntensity = 0.05;
	this.div.ExpandMinValue =  1;//px
	this.div.fxCurrentHeight = -2;//undefined
	this.ExpandFactor = 1;
	this.fxFinishTime = 0.0; 
	this.fxStartTime =0.0;
	this.fxMinimalHeight=0;
	this.div.style.height = oHTMLElementIn.offsetHeight;
	this.initFx = function(bWidth,bHeight)
	{
		this.div.style.overflow="";
		this.div.style.opacity="";
		this.div.style.MozOpacity="";
		this.div.style.KhtmlOpacity="";
		this.div.style.filter="";
		this.div.style.height="";
		this.div.style.width="";
		
		this.fxWidth =  getHTMLElementWidth(this.div)+50;//+25 bug. todo
		this.fxHeight = getHTMLElementHeight(this.div);
		if (bWidth){
			this.div.style.width = this.fxWidth.toString()+"px";
			//this.div.style.width = "224"+"px";
		}
		if(bHeight)
		{
			this.div.style.height = this.fxHeight.toString()+"px";
		}
	},
	this.initFx(bWidth,bHeight);
	this.setOpacityOut = function()
	{
		var nNow = this.getCurrentDateMs();
		if (nNow < this.fxTimeToEndTransition)
		{
			this.div.FadeLevel -= this.div.FadeIntensity;
			this.div.setOpacity();
	//		document.getElementById("tra_cont_txt").innerHTML +="<br/>"+this.div.FadeLevel;
		}else{
			this.div.FadeLevel = 0;
			this.div.setOpacity();
			LoadedIntervals.ClearInterval();
		}
	},
	this.setOpacityIn = function()
	{
		var nNow = this.getCurrentDateMs();
		if (nNow < this.fxTimeToEndTransition)
		{
			
			this.div.FadeLevel += this.div.FadeIntensity;
			this.div.setOpacity();
			//document.getElementById("tra_cont_txt").innerHTML +="<br/>"+this.div.FadeLevel;
		}else{
			this.div.FadeLevel = 1;
			this.div.setOpacity(this.ExpandHeight);
			LoadedIntervals.ClearInterval();
		}
	},
	this.expandThis= function()
	{
		var nNow = this.getCurrentDateMs();
		//if ((this.div.fxCurrentHeight <= this.fxExpandHeight)&&(this.div.fxCurrentHeight >= 0))
		//if (((this.div.fxCurrentHeight+this.fxMinimalHeight) <= this.fxExpandHeight)&&(this.div.fxCurrentHeight >= 0))
		if ((this.div.fxCurrentHeight <= this.fxHeight)&&(this.div.fxCurrentHeight >= this.fxMinimalHeight))
		{
			this.div.fxCurrentHeight += this.div.ExpandMinValue*this.ExpandFactor;
			this.div.setHeight();
			var restTime = this.fxFinishTime-nNow;
			this.fxDuration = (restTime==0)?this.fxTransition:restTime;
			this.fxTransition = 33;
			var restHeight  = (this.div.ExpandMinValue*this.fxDuration)/this.fxTransition;
			this.fxIntervalHeight = restHeight;
			this.div.ExpandMinValue = (this.fxTransition*this.fxIntervalHeight)/this.fxDuration;
			if (isNaN(this.div.ExpandMinValue))
			{
				alert("isNaN");
			}
		}else{
			this.ExpandFactor = (this.ExpandFactor==1)?-1:1;
			this.div.setHeight();
			this.div.fxCurrentHeight = Number(this.div.style.height.split("px")[0]);
		//	alert(this.div.fxCurrentHeight);
			//reset
			//this.fxTimeToExpand = 1000;
			this.fxIntervalHeight = this.fxTimeToExpand;
			//this.div.style.overflow="show";
			LoadedIntervals.ClearInterval();
		}
	},
	this.div.setOpacity = function () 
	{
		this.style.opacity = this.FadeLevel;
		this.style.MozOpacity = this.FadeLevel;
		this.style.KhtmlOpacity = this.FadeLevel;
		this.style.filter = "alpha(opacity=" + (this.FadeLevel * 100) + ");";
	},
	this.div.setHeight = function () 
	{
		var thisHeight = this.fxCurrentHeight;
		var rest = thisHeight-this.fx.fxHeight;
		if (rest>0)
		{
			thisHeight -=rest;
		}else if (this.fxCurrentHeight<this.fx.fxMinimalHeight){
			thisHeight = this.fx.fxMinimalHeight;
		}
		//this.fxCurrentHeight = thisHeight;
		/*if (thisHeight<this.fx.fxMinimalHeight)
		{
			thisHeight = this.fx.fxMinimalHeight;
		}*/
		this.style.height = thisHeight.toString()+"px";
	},
	this.getCurrentDateMs = function()
	{
		//Resturns the current date in miliseconds
		var CurrentDate = new Date();
		var CurrentDateMs = CurrentDate.getTime();
		return CurrentDateMs;
	}
	this.setFxTransitionStartedTime = function()
	{
		//Resturns the current date in miliseconds
		this.fxTransitionStartedTime = this.getCurrentDateMs();
	},
	this.setFxTimeToEndTransition = function()
	{
		this.fxTimeToEndTransition = this.fxTransitionStartedTime+this.fxDuration;
	},
	this.initFadeParams=function(){
		this.fxDuration = this.fxTimeToFade;
		this.setFxTransitionStartedTime();
		this.setFxTimeToEndTransition();
		this.fxTransition = this.fxDuration*this.div.FadeIntensity;
	},
	this.setfxFinishTime=function()
	{
		this.fxFinishTime = this.getCurrentDateMs()+this.fxTimeToExpand;
	},
	this.setfxStartTime=function()
	{
		this.fxStartTime = this.getCurrentDateMs();
	},
	this.initExpandParams=function()
	{
		this.fxDuration = this.fxTimeToExpand;
		this.fxTransition = 33;
		this.div.ExpandMinValue = (this.fxTransition*this.fxIntervalHeight)/this.fxDuration;
	},
	this.fadeOut = function()
	{
		LoadedIntervals.addInterval(this);
		var thisLength = LoadedIntervals.index.length;
		var LastInterval = ((thisLength > 0)? thisLength-1:0); 
		LoadedIntervals.index[LastInterval].doInterval = function()
		{
			LoadedIntervals.state.stateValue = 1;
			var thisInterval = LoadedIntervals.getNextInterval();
			if (thisInterval)
			{
				thisInterval.obj.initFadeParams();
				//thisInterval.obj.div.FadeLevel = 1;
				CurrentInterval.interval = window.setInterval('CurrentInterval.obj.setOpacityOut()', CurrentInterval.obj.fxTransition);
			}
		}
		LoadedIntervals.execute();
	},
	this.fadeIn = function()
	{
		LoadedIntervals.addInterval(this);
		var thisLength = LoadedIntervals.index.length;
		var LastInterval = (thisLength > 0? thisLength-1:0);
		LoadedIntervals.index[LastInterval].doInterval=function()
		{
			LoadedIntervals.state.stateValue = 1;
			var thisInterval = LoadedIntervals.getNextInterval();
			if (thisInterval)
			{
				thisInterval.obj.initFadeParams();
				//thisInterval.obj.div.FadeLevel = 0;
				CurrentInterval.interval = window.setInterval('CurrentInterval.obj.setOpacityIn()', CurrentInterval.obj.fxTransition);
			}
		}
		LoadedIntervals.execute();
	},
	this.expand = function(nMinimalHeight)
	{
	//	this.fxHeight = 0;
		//var nheight = getHTMLElementHeight(this.div);
		//alert(nheight);
		this.div.style.overflow = "hidden";
		if (nMinimalHeight==undefined)
		{
			this.fxMinimalHeight = 0;
		}else
		{
			this.fxMinimalHeight = nMinimalHeight;
		}
		if ((this.div.fxCurrentHeight ==-2)||(this.div.fxCurrentHeight >this.fxHeight))
		{
			this.div.fxCurrentHeight = this.fxHeight;
			if (this.div.fxCurrentHeight <this.fxHeight)
			{
				this.ExpandFactor = 1; 
			}else
			{
				this.ExpandFactor = -1;
			}
		}
		/*if (this.div.fxCurrentHeight ==-2)//undefined
		{
			this.div.style.height
			if (this.fxMinimalHeight>0)
			{
				this.div.fxCurrentHeight = this.fxMinimalHeight;
			}else
			{			
				this.div.fxCurrentHeight = this.fxHeight;
			}
		}*/
		//this.div.fxCurrentHeight = this.fxHeight;//this.offsetHeight
		
		/*if (this.fxExpandHeight <this.fxHeight)//it will always once happen
		{
			this.fxExpandHeight += (this.div.offsetHeight-this.fxHeight);
		}*/		
		/*if (this.div.fxCurrentHeight <this.fxHeight)
		{
			this.ExpandFactor = 1; 
		}else
		{
			this.ExpandFactor = -1;
		}*/
		LoadedIntervals.addInterval(this);
		var thisLength = LoadedIntervals.index.length;
		var LastInterval = (thisLength > 0? thisLength-1:0);
		LoadedIntervals.index[LastInterval].doInterval=function()
		{
			LoadedIntervals.state.stateValue = 1;
			var thisInterval = LoadedIntervals.getNextInterval();
			if (thisInterval)
			{
				//thisInterval.obj.fxIntervalHeight = thisInterval.obj.fxExpandHeight;
				thisInterval.obj.fxIntervalHeight = thisInterval.obj.fxHeight;
				thisInterval.obj.setfxFinishTime();
				thisInterval.obj.setfxStartTime();
				thisInterval.obj.initExpandParams();
				CurrentInterval.interval = window.setInterval('CurrentInterval.obj.expandThis()', CurrentInterval.obj.fxTransition);
			}
		};
		LoadedIntervals.execute();
	};
}
//var objEfects = new Efects();
//var NewElement = document.createElement("Efects");

/*function checkEfect()
{
	var ThisDIV = document.getElementById("tra_head_logo");
	ThisDIV.fx.fadeIn();
}
*/
function LoadFadeIn()
{
	LoadedIntervals.execute();
}
function WebFadeIn()
{
	var CurrentDIVNodes = document.documentElement.getElementsByTagName("div");
	
	for (var b=0;b<CurrentDIVNodes.length;b++)
	{
		CurrentDIVNodes[b].fx.fadeIn();
	}
}