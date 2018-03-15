var webstyle=function(){
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
				};
				return new s();
			};
	var style={};
	var _before='auto-webstyle-';
	var auto=function(){
		var mutation=function(){
				// Select the node that will be observed for mutations
				var targetNode = document;

				// Options for the observer (which mutations to observe)
				var config = { attributes: true, childList: true, subtree:true };

				// Callback function to execute when mutations are observed
				var callback = function(mutationsList) {
					for(var mutation of mutationsList) {
						if (mutation.type == 'childList') {
							S(mutation.addedNodes).action(function(node){
								if(node.nodeType==1){
									background_none(node);
								}
							});
						}
						else if (mutation.type == 'attributes') {
							S(mutation.target).action(function(node){
								if(node.nodeType==1){
									//background_none(node);
								}
							});
						}
					}
				};

				// Create an observer instance linked to the callback function
				var observer = new MutationObserver(callback);

				// Start observing the target node for configured mutations
				observer.observe(targetNode, config);


			};
		var background_none=function(input){
			var none=function(node){
				if(typeof(node)=='object'&&String(node).search(/element/i)>=0){
					var computerStyle=window.getComputedStyle(node,null);
					if(computerStyle){
						var position=computerStyle.getPropertyValue('position');
						var display=computerStyle.getPropertyValue('display');
						var visible=computerStyle.getPropertyValue('visible');
						var z=node.offsetHeight*node.offsetWidth;
						var background_image=computerStyle.getPropertyValue('background-image');
						if(position!='absolute'&&position!='fixed'&&background_image=='none'){
							S(node).action(function(node){
								node.setAttribute(_before+'background-none','true');
							});
						}
						if((position=='absolute'||position=='fixed')&&(display=='none'||visible=='hidden')&&node.getElementsByTagName('a').length>0)
							S(node).action(function(node){
								node.setAttribute(_before+'toggle','');
							});
					}
				}
			};
			if(input)none(input);
			else{
				S(document.getElementsByTagName('a')).action(function(node){
					node.setAttribute(_before+'background-none','true');
				});
				S(document.getElementsByTagName('td')).action(function(node){
					node.setAttribute(_before+'background-none','true');
				});
				S('body *').action(none);
			}
		};
		var content=function(){
			var nodelist=[],i=0;
			var pushlist=function(list){
				var _html=String(list).search(/html/i)>=0;
				var _collection=String(list).search(/collection/i)>=0;
				var _element=String(list).search(/element/i)>=0;
				var _nodelist=String(list).search(/nodelist/i)>=0;
				if((_html&&_collection)||_nodelist){
					var i;
					for(i=0;i<list.length;i++)
						nodelist.push(list[i]);
				}
			};
			pushlist(document.body.children);
			while(i<nodelist.length){
				var node=nodelist[i];
				var computerStyle=window.getComputedStyle(node,null);
				var flag=false;
				if(computerStyle){
					var position=computerStyle.getPropertyValue('position');
					if(node.offsetWidth*node.offsetHeight>160000&&position!='absolute'&&position!='fixed'){
						node.setAttribute(_before+'content','');
						flag=true;
					}
				}
				if(!flag)pushlist(node.children);
				i++;
			}
		};
		var SideBar=function(){
			var nodelist=[],i=0;
			var pushlist=function(list){
				var _html=String(list).search(/html/i)>=0;
				var _collection=String(list).search(/collection/i)>=0;
				var _element=String(list).search(/element/i)>=0;
				var _nodelist=String(list).search(/nodelist/i)>=0;
				if((_html&&_collection)||_nodelist){
					var i;
					for(i=0;i<list.length;i++)
						nodelist.push(list[i]);
				}
			};
			pushlist(document.body.children);
			while(i<nodelist.length){
				var a=nodelist[i].getElementsByTagName('a').length;
				var h=nodelist[i].offsetHeight;
				var w=nodelist[i].offsetWidth;
				var z=h*w;
				var flag=false;
				var offsetleft=_node(nodelist[i]).offsetLeft(document.body);
				var textlength=nodelist[i].textContent.replace(/ /,'').replace(/\n/,'').length;
				if(a>0&&h>400&&w<400&&w>100&&offsetleft<400&&textlength>0){
					nodelist[i].setAttribute(_before+'left-sidebar','');
					flag=true;
				}
				if(a>0&&h>400&&w<400&&w>100&&offsetleft>800&&textlength>0){
					nodelist[i].setAttribute(_before+'right-sidebar','');
					flag=true;
				}
				var post=function(n){
					var j,count=0;
					var width_array=[];
					for(j=0;j<n.length;j++){
						var a=n[j].getElementsByTagName('a').length;
						var h=n[j].offsetHeight;
						var w=n[j].offsetWidth;
						width_array.push(w);
						var z=h*w;
						if(h>35&&z<500000&&z>20000&&a>0)
							count++;
					}
					width_array.sort(function(z1,z2){return z1-z2;});
					var sw=Math.abs(width_array[width_array.length-1]-width_array[0]);
					if(n.length>1&&Math.abs(count-n.length)<2&&count>0&&sw<10){
						flag=true;
						nodelist[i].setAttribute(_before+'post-list','');
					}
				};
				//post(nodelist[i].children);
				if(!flag)pushlist(nodelist[i].children);
				i++;
			}
		};
		var post=function(){
			S(document.getElementsByTagName('a')).action(function(node){
				var post=function(n){
					var j,count=0;
					var width_array=[];
					for(j=0;j<n.length;j++){
						var a=n[j].getElementsByTagName('a').length;
						var h=n[j].offsetHeight;
						var w=n[j].offsetWidth;
						width_array.push(w);
						var z=h*w;
						if(h>50&&z<500000&&z>20000&&a>0)
							count++;
					}
					width_array.sort(function(z1,z2){return z1-z2;});
					var sw=Math.abs(width_array[width_array.length-1]-width_array[0]);
					if(n.length>1&&Math.abs(count-n.length)<1&&count>0&&sw<10){
						flag=true;
						_node.setAttribute(_before+'post-list','');
						S(_node.getElementsByTagName('a')).action(function(node){
							node.setAttribute(_before+'post-list-inner','');
						});
						return 'break';
					}
				};
				if(node.getAttribute(_before+'post-list-inner')==null){
					var _node=node.parentElement;
					var flag='';
					while(_node.tagName!='BODY'&&flag!='break'){
						flag=post(_node.children);
						_node=_node.parentElement;
					}
				}
			});
		};
		var menu=function(){
			
		};
		background_none();
		content();
	};
	function appendElement(z1,z2){
		var z=document.createElement(z2);
		z1.appendChild(z);
		return z;
	}
	function editor(){
		var current_status;
		var backgroundImage;
		var cssText;
		var style=appendElement(document.body,'style');
		function set(){
			switch(current_status){
				case 'on':
					style.textContent=cssText;
					document.body.setAttribute('data-background-image-name',backgroundImage.name);
				break;
				case 'off':
					style.textContent='';
					document.body.setAttribute('data-background-image-name','');
				break;
			}
		}
		browser.runtime.onMessage.addListener(function(request,sender,response){
			if(request.setStatus)current_status=request.setStatus;
			if(request.backgroundImage)backgroundImage=request.backgroundImage;
			if(request.cssText)cssText=request.cssText;
			set();
		});
	}
	window.addEventListener('load',function(){
		auto();
	});
	editor();
	browser.runtime.sendMessage('self_status?');
};
webstyle();