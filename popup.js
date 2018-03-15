var S=function(node,selector){
			var css=function(node,css){
				if(String(node).search(/html/i)>=0&&typeof(css)=='object'){
					for(x in css){
						var x1=x;
						var z=x1.indexOf('-');
						while(z>=0){
							var z1=x1.charAt(z+1);
							x1=x1.replace('-'+z1,z1.toUpperCase());
							z=x1.indexOf('-');
						}
						switch(x1){
							case 'animation':
								node.style.animation=css[x];
								node.style.WebkitAnimation=css[x];
							break;
							case 'animationDuration':
								node.style.animationDuration=css[x];
								node.style.WebkitAnimationDuration=css[x];
							break;
							case 'animationDelay':
								node.style.animationDelay=css[x];
								node.style.WebkitAnimationDelay=css[x];
							break;
							case 'transition':
								node.style.transition=css[x];
								if(css[x].indexOf('transform')>=0)
									css[x]=css[x].replace('transform','-webkit-transform');
								node.style.WebkitTransition=css[x];
							break;
							case 'transform':
								node.style.transform=css[x];
								node.style.WebkitTransform=css[x];
							break;
							case 'userSelect':
								node.style.WebkitUserSelect=css[x];
								node.style.MozUserSelect=css[x];
								node.style.msUserSelect=css[x];
								node.style.userSelect=css[x];
							break;
							case 'perspective':
								node.style.perspective=css[x];
								node.style.WebkitPerspective=css[x];
							break;
							default:
								node.style[x1]=css[x];
						}
					}
				}
			};
			var s=function(node,selector){
				var htmlcollection_array=[];
				this.add=function(node,selector){
					var _html=String(node).search(/html/i)>=0;
					var _collection=String(node).search(/collection/i)>=0;
					var _element=String(node).search(/element/i)>=0;
					var _nodelist=String(node).search(/nodelist/i)>=0;
					var isarray=Array.isArray(node);
					var isobject=typeof(node)=='object';
					var isstring=typeof(node)=='string';
					var nodes=[];
					if(isobject&&_html&&_element&&typeof(selector)=='string')
						nodes=node.querySelectorAll(selector);
					if(isstring&&selector==null)
						nodes=document.querySelectorAll(node);
					if(isobject&&_html&&_element&&selector==null)
						nodes.push(node);
					if(isobject&&((_html&&_collection)||_nodelist)&&selector==null)
						nodes=node;
					if(isarray)nodes=node;
					htmlcollection_array.push(nodes);
					return this;
				}
				this.add(node,selector);
				this.E=function(){
					var z=[];
					htmlcollection_array.forEach(function(nodes){
						var i;
						for(i=0;i<nodes.length;i++)
							z.push(nodes[i]);
					});
					return z;
				}
				this.action=function(f,delay){
					var fz=function(){
						htmlcollection_array.forEach(function(nodes){
							var i;
							for(i=0;i<nodes.length;i++)
								f(nodes[i],i);
						});
					};
					if(typeof(f)=='function')
						if(delay)
							setTimeout(fz,delay);
						else
							fz();
				}
				this.style=function(style,delay){
					this.action(function(node){
						css(node,style);
					},delay);
				}
				this.addclass=function(class_,delay){
					if(class_==null)return;
					var class_array;
					if(typeof(class_)=='string')class_array=class_.split(' ');
					this.action(function(node){
						class_array.forEach(function(_class){
							if(_class!='')node.classList.add(_class);
						});
					},delay);
					return this;
				}
				this.removeclass=function(class_,delay){
					if(class_==null)return;
					var class_array;
					if(typeof(class_)=='string')class_array=class_.split(' ');
					this.action(function(node){
						class_array.forEach(function(_class){
							if(_class!='')node.classList.remove(_class);
						});
					},delay);
					return this;
				}
				this.appendElement=function(nodename,f){
					this.action(function(node_){
						var _node=document.createElement(nodename);
						node_.appendChild(_node);
						if(typeof(f)=='function')
						f(_node);
					});
				}
				this.clicked=function(f,z){
					this.action(function(node_){
						node_.addEventListener('click',function(event){
							f(event,z);
						});
					});
				}
			}
			return new s(node,selector);
		};
var	_node=function(node){
				var s=function(){
					var size=function(z){
						var s;
						switch(node.nodeName){
							case 'BODY':
								s=document.documentElement[z];
							break;
							default:
								s=node[z];
						}
						return s;
					};
					this.clientHeight=function(){
						return size('clientHeight');
					};
					this.scrollHeight=function(){
						return size('scrollHeight');
					};
					this.clientWidth=function(){
						return size('clientWidth');
					};
					this.scrollWidth=function(){
						return size('scrollWidth');
					};
					this.scroll=function(type,s){
						var p;
						switch(type){
							case 'top':
								p='scrollTop';
							break;
							case 'left':
								p='scrollLeft';
							break;
						}
						if(s!=null&&typeof(s)=='number'){
							switch(node.nodeName){
								case 'BODY':
									document.documentElement[p]=s;
									document.body[p]=s;
								break;
								default:
									node[p]=s;
							}
							return;
						}
						var scroll_=0;
						switch(node.nodeName){
							case 'BODY':
								if(document.documentElement[p]>0)scroll_=document.documentElement[p];
								if(document.body[p]>0)scroll_=document.body[p];
							break;
							default:
								scroll_=node[p];
						}
						return scroll_;
					};
					this.scrollTop=function(s){
						return this.scroll('top',s);
					};
					this.scrollLeft=function(s){
						return this.scroll('left',s);
					};
					this.offset=function(z,offsetP){
						var offset=0,node_=node;
						do{
							if(node_==null||node_.offsetParent==null)break;
							offset+=node_['offset'+z]+node_.offsetParent['client'+z];
							node_=node_.offsetParent;
						}while(!(node_===offsetP||node_===document.body))
						return offset;
					};
					this.offsetTop=function(P){
						return this.offset('Top',P);
					};
					this.offsetLeft=function(P){
						return this.offset('Left',P);
					};
					this.subtree=function(_node){
						while(!(_node===node)&&_node){
							_node=_node.parentElement;
						}
						if(_node)return true;
						else return false;
					};
				};
				return new s();
			};
function status_setting(current_status,bg_page,host){
	var status_button=document.getElementById('set_status');
	if(status_button==null)return;
	function sendStatusToActiveTab(s){
		browser.tabs.query({active:true,currentWindow:true}).then(function(tab){
			browser.tabs.sendMessage(tab[0].id,{setStatus:s});
		});
	}
	function set(s){
		bg_page.setStatusByHost(host,s);
		sendStatusToActiveTab(s);
		switch(s){
			case 'on':
				current_status='on';
				//browser.browserAction.setBadgeText({text: 'On'});
				browser.browserAction.setIcon({path: 'icon.png'});
				status_button.textContent='On';
				status_button.classList.add('on');
				status_button.classList.remove('off');
			break;
			case 'off':
				current_status='off';
				//browser.browserAction.setBadgeText({text: 'Off'});
				browser.browserAction.setIcon({path: 'icon_off.png'});
				status_button.textContent='Off';
				status_button.classList.add('off');
				status_button.classList.remove('on');
			break;
		}
	}
	set(current_status);
	status_button.addEventListener('click',function(){
		switch(current_status){
			case 'on':
				set('off');
			break;
			case 'off':
				set('on');
			break;
		}
	});
}
var gallery=function(){
	S('#free-theme').action(function(node){
		node.addEventListener('click',function(){
			browser.tabs.create({url:browser.runtime.getURL('backgroundimageoption.html')});
		});
	});
};
function colorPicker(width,height){
	var colorPicker=this;
	var colorPickerNode;
	S('body').appendElement('div',function(node){
		colorPickerNode=node;
		node.classList.add('color-picker-node');
	});
	var color_line_node,color_table_node;
	S(colorPickerNode).appendElement('div',function(node){
		node.classList.add('color-choice-outer');
		node.innerHTML='<span class="color-choice"></span>';
	});
	S(colorPickerNode).appendElement('div',function(node){
		node.classList.add('color-line-outer');
		node.innerHTML='<canvas width="'+width+'" height="20">Your browser does not support the HTML5 canvas tag.</canvas>';
	});
	S(colorPickerNode).appendElement('div',function(node){
		node.classList.add('color-table-outer');
		node.innerHTML='<canvas width="'+width+'" height="'+height+'">Your browser does not support the HTML5 canvas tag.</canvas>';
	});
	var c = colorPickerNode.querySelector('.color-line-outer canvas');
	var ctx = c.getContext("2d");
	function drawline(width,height){
		var colors=[[165,82,255],[255,0,255],[255,82,165],[255,0,0],[255,165,82],[255,255,0],[165,255,82],[0,255,0],[82,255,165],[0,255,255],[82,165,255],[0,0,255]];
		//var colors=[[255,0,255],[127,82,165],[255,0,0],[127,165,82],[255,255,0],[165,127,82],[0,255,0],[82,127,165],[0,255,255],[82,165,127],[0,0,255]];
		var color_list=[];
		var color_tables=[];
		var color=function(index){
			var r=width/(colors.length-1);
			index1=Math.floor(index/r);
			index2=index1+1;
			var r1=index-index1*r;
			var _color=[];
			var i=0;
			for(i=0;i<3;i++)
				_color[i]=Math.round((r1/r)*(colors[index2][i]-colors[index1][i])+colors[index1][i]);
			color_list.push(_color);
			return 'rgb('+_color.toString()+')';
		};
		var i=0;
		for(i=0;i<width;i++){
			color(i);
			//color_tables.push(colorValueTable(120,120,color_list[i]));
		}
		for(i=0;i<width;i++){
			ctx.beginPath();
			ctx.moveTo(i, 0);
			ctx.lineWidth=1;
			ctx.lineTo(i, height);
			ctx.strokeStyle='rgb('+color_list[i]+')';
			ctx.stroke();
		}
		var current_table=0;
		location_(document.querySelector('.color-line-outer canvas'),function(x,y){
			if(x>=0&&x<width&&y>=0&&y<=20){
				colorTable(200,200,colorValueTable(200,200,color_list[x]));
				current_table=x;
				color_choice(color_list[x]);
			}
		});
		
	};
	function colorValueTable(width,height,color){
		var i=0,j=0;
		var color_table=[];
		color_table[0]=[];
		for(i=0;i<width;i++){
			let _color=[];
			_color[0]=Math.round(color[0]*i/(width-1));
			_color[1]=Math.round(color[1]*i/(width-1));
			_color[2]=Math.round(color[2]*i/(width-1));
			color_table[0][i]=_color;
		}
		for(j=1;j<height;j++){
			color_table[j]=[];
			for(i=0;i<width;i++){
				let _color=[];
				_color[0]=Math.round(color_table[0][i][0]+(255-color_table[0][i][0])*j/(height-1));
				_color[1]=Math.round(color_table[0][i][1]+(255-color_table[0][i][1])*j/(height-1));
				_color[2]=Math.round(color_table[0][i][2]+(255-color_table[0][i][2])*j/(height-1));
				color_table[j][i]=_color;
			}
		}
		return color_table;
	};
	var color_table_value;
	function colorTable(width,height,color_table){
		color_table_value=color_table;
		var c = colorPickerNode.querySelector(".color-table-outer canvas");
		var ctx = c.getContext("2d");
		var i=0,j=0;
		for(j=0;j<height;j++){
			for(i=0;i<width;i++){
				ctx.beginPath();
				ctx.moveTo(i, j);
				ctx.lineWidth=1;
				ctx.lineTo(i+1, j+1);
				ctx.strokeStyle='rgb('+color_table[j][i].toString()+')';
				ctx.stroke();
			}
		}
	};
	var opacityNode;
	function add_opacity(){
		S(colorPickerNode).appendElement('div',function(node){
			node.textContent='Opacity';
		});
		S(colorPickerNode).appendElement('input',function(node){
			opacityNode=node;
			node.classList.add('opacity');
			node.type='range';
			node.step='0.01';
			node.min='0';
			node.max='1';
			node.value='1';
			S(node).style({width:String(width-10)+'px',marginBottom:'5px'});
			node.addEventListener('change',set_color);
		});
	}
	add_opacity();
	var current_color_value;
	function color_choice(value){
		if(colorPickerNode.style.visibility=='visible'){
			current_color_value=value;
			if(Array.isArray(value)){
				set_color(value);
			}
		}
	};
	function set_color(){
		var value=current_color_value;
		if(value){
			var color_value='rgba('+value.toString()+','+opacityNode.value+')'
			colorPickerNode.querySelector('.color-choice').style.background=color_value;
			targetButton.style.background=color_value;
			filter_callback().set(color_value);
		}
	};
	location_(colorPickerNode.querySelector('.color-table-outer canvas'),function(x,y){
			if(x>=0&&x<200&&y>=0&&y<200&&Array.isArray(color_table_value)){
				color_choice(color_table_value[y][x]);
			}
		});
	function location_(targetNode,callback,_e){
		if(_e!='mousemove'&&_e!='click')_e='click';
		colorPickerNode.addEventListener(_e,function(event){
			var position=window.getComputedStyle(colorPickerNode, null).getPropertyValue("position");
			if(position!='fixed'){
				var offset_top=_node(targetNode).offsetTop(document.body);
				var offset_left=_node(targetNode).offsetLeft(document.body);
				var offsetTop=event.pageY-offset_top;
				var offsetLeft=event.pageX-offset_left;
				callback(offsetLeft,offsetTop);
			}
			else{
				var left=window.getComputedStyle(colorPickerNode, null).getPropertyValue("left");
				var top=window.getComputedStyle(colorPickerNode, null).getPropertyValue("top");
				var margintop=window.getComputedStyle(colorPickerNode, null).getPropertyValue("margin-top");
				var marginleft=window.getComputedStyle(colorPickerNode, null).getPropertyValue("margin-left");
				var bordertop=window.getComputedStyle(colorPickerNode, null).getPropertyValue("border-top-width");
				var borderleft=window.getComputedStyle(colorPickerNode, null).getPropertyValue("border-left-width");
				var offset_top=targetNode.offsetTop+Number(top.replace('px',''))+Number(margintop.replace('px',''))+Number(bordertop.replace('px',''));
				var offset_left=targetNode.offsetLeft+Number(left.replace('px',''))+Number(marginleft.replace('px',''))+Number(bordertop.replace('px',''));
				var offsetTop=event.clientY-offset_top;
				var offsetLeft=event.clientX-offset_left;
				callback(offsetLeft,offsetTop);
			}
		});
	};
	this.show=function(style_value){
		S(colorPickerNode).style(style_value);
	};
	this.hide=function(){
		colorPickerNode.style.visibility='hidden';
	};
	var addList=[];
	this.add=function(node,callback){
		node.classList.add('color-picker-button');
		addList.push({node:node,callback:callback});
	};
	function filter_callback(){
		var i=0;
		for(i=0;i<addList.length;i++){
			if(addList[i].node===targetButton){
				return addList[i].callback;
			}
		}
		return {get:function(){},set:function(){}};
	};
	drawline(200,20);
	var targetButton;
	function get_color(s){
		if(typeof(s)!='string')return;
		var z1=s.indexOf('(');
		var z2=s.indexOf(')');
		var s2=[];
		if(z2>z1+1){
			var s1=s.slice(z1+1,z2).split(',');
			var i=0;
			for(i=0;i<s1.length;i++)
				s2[i]=Number(s1[i]);
			s2[0]=(s2[0]>255||s2[0]<0||s2[0]==null)?0:s2[0];
			s2[1]=(s2[1]>255||s2[1]<0||s2[1]==null)?0:s2[1];
			s2[2]=(s2[2]>255||s2[2]<0||s2[2]==null)?0:s2[2];
			s2[3]=(s2[3]>255||s2[3]<0||s2[3]==null)?1:s2[3];
			
		}
		return s2;
	};
	document.body.addEventListener('click',function(event){
		if(event.target.classList.contains('color-picker-button')){
			targetButton=event.target;
			var opacity=get_color(event.target.style.background)[3];
			opacityNode.value=opacity;
			var x=0,y;
			if(window.innerWidth-event.clientX-25>colorPickerNode.offsetWidth)
				x=event.clientX;
			else if(colorPickerNode.offsetWidth<event.clientX)
				x=event.clientX-colorPickerNode.offsetWidth;
				else
					x=window.innerWidth-colorPickerNode.offsetWidth-20;
			if(window.innerHeight-event.clientY<colorPickerNode.offsetHeight)
				y=window.innerHeight-colorPickerNode.offsetHeight-10;
			else y=event.clientY;
			ColorPicker.show({
				position:'fixed',
				top:y+'px',
				left:x+'px',
				visibility:'visible'
			});
		}
		else if(!_node(colorPickerNode).subtree(event.target))
			colorPickerNode.style.visibility='hidden';
	});
};
function customize(themes,active_theme_id,bg_page,host){
	if(themes==null||typeof(themes)!='object')return;
	function appendElement(z1,z2){
		var z=document.createElement(z2);
		z1.appendChild(z);
		return z;
	}
	function panel(){
		function addTheme(theme){
			function setCssVar(s){
				bg_page.setCssVarsByThemeId(theme.id,theme.vars);
			}
			function addGroup(group){
				function addVar(vr){
					var s=group.attributes.name.replace(/ /g,'').toLowerCase()+'.'+vr.name.replace(/ /g,'').toLowerCase();
					var _var_outer=appendElement(_vars,'div');
					var _title=appendElement(_var_outer,'span');
					var _var=appendElement(_var_outer,'span');
					_var_outer.classList.add('vars-outer');
					_title.classList.add('var-title');
					_title.textContent=vr.title;
					if(vr.type=='color'){
						_var.style.background=theme.vars[s];
						ColorPicker.add(_var,{set:function(value){
							theme.vars[s]=value;
							setCssVar();
							console.log(theme.vars);
						}});
					}
				}
				var _group=appendElement(_theme,'div');
				var _title=appendElement(_group,'div');
				var _vars=appendElement(_group,'div');
				_title.textContent=group.attributes.title;
				_group.classList.add('group');
				_title.classList.add('title');
				S(_vars).style({
					overflow:'hidden',
					height:'0px',
					transition:'height 0.2s'
				});
				_vars.setAttribute('data-vars','');
				if(Array.isArray(group.items))
					group.items.forEach(addVar);
				_title.addEventListener('click',function(event){
					S(_theme,'[data-vars]').style({height:'0px'});
					_vars.style.height=_vars.scrollHeight+'px';
				});
			}
			var _id=appendElement(_select,'option');
			_id.value=theme.id;
			_id.textContent=theme.id;
			if(theme.id==active_theme_id)_id.selected=true;
			var _theme=appendElement(_themes,'div');
			theme.groups.forEach(addGroup);
			theme_list[theme.id]=_theme;
		}
		function _display(){
			for(x in theme_list){
				theme_list[x].style.display='none';
			}
			theme_list[_select.value].style.display='block';
		}
		function setActiveTheme(){
			bg_page.setActiveThemeIdByHost(host,_select.value);
		}
		var theme_list={};
		var _panel=appendElement(document.body,'div');
		_panel.classList.add('panel');
		var _select=appendElement(_panel,'select');
		var _themes=appendElement(_panel,'div');
		for(var x in themes)
			addTheme(themes[x]);
		_select.addEventListener('change',function(){
			_display();
			setActiveTheme();
		});
		_display();
	}
	panel();
	console.log(themes);
}
var ColorPicker;
function getHostByUrl(url){
	if(url==null||url=='')return '';
	if(typeof(url)=='string'){
		if(url.indexOf('http://')!=0&&url.indexOf('https://')!=0)return '';
		var host=url.split('/')[2];
		if(host==null)host='';
		return host;
	}
}
function _panel(){
	browser.runtime.getBackgroundPage().then(function(bg){
		browser.tabs.query({active:true,currentWindow:true}).then(function(tabs){
			if(tabs.length>=0){
				var host=getHostByUrl(tabs[0].url);
				if(host!=''){
					var current_status=bg.getStatusByHost(host);
					var themes=bg.getThemesByHost(host);
					var active_theme_id=bg.getActiveThemeIdByHost(host);
					customize(themes,active_theme_id,bg,host);
					status_setting(current_status,bg,host);
				}
			}
		});
	});
}
document.addEventListener('DOMContentLoaded', function () {
	gallery();
	ColorPicker=new colorPicker(200,200);
	ColorPicker.hide();
	_panel();
});