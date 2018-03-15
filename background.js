var _default_status='off';
var uStyleStorage;
var themeList={};
function clearChanges(){
	uStyleStorage={
		host:{},
		backgroundImage:{url:'',path:'',name:''},
		cssVar:{}
	};
	AutoSet.set=true;
}
browser.storage.local.get('uStyle/').then(
	function(items){
		uStyleStorage=items['uStyle/'];
		if(uStyleStorage==null)
			clearChanges();
	},
	function(){
		
	}
);
function autoset(){
	this.set=false;
	var z=this;
	function auto(){
		if(z.set){
			browser.storage.local.set({'uStyle/':uStyleStorage});
			z.set=false;
		}
	}
	setInterval(auto,1000);
}
var AutoSet=new autoset();
function themeParser(){
	var urls={},themes={},theme_nodes=document.getElementsByTagName('theme');
	var i=0;
	for(i=0;i<theme_nodes.length;i++){
		var _theme={vars:{}};
		_theme={vars:{},urls:[]};
		_theme.number=i;
		var css=theme_nodes[i].getElementsByTagName('csstext')[0];
		_theme.id=theme_nodes[i].getAttribute('id');
		_theme.default=theme_nodes[i].getAttribute('default');
		if(typeof(_theme.default)=='string')_theme.default=_theme.default.replace(/ /g,'').toLowerCase();
		if(css)_theme.cssText=css.innerHTML;
		var theme_urls=theme_nodes[i].getElementsByTagName('url');
		var j=0;
		for(j=0;j<theme_urls.length;j++){
			var domain=theme_urls[j].innerHTML;
			if(typeof(domain)=='string'&&domain!=''){
				if(!Array.isArray(urls[domain]))urls[domain]=[];
				urls[domain].push(_theme);
				_theme.urls.push(domain);
			}
		}
		var j1=0,j2=0,g=theme_nodes[i].getElementsByTagName('group');
		_theme.groups=[];
		for(j1=0;j1<g.length;j1++){
			var group={};
			group.attributes={
				title:g[j1].getAttribute('title')+'',
				name:g[j1].getAttribute('name')+''
			};
			var z=g[j1].getElementsByTagName('var');
			group.items=[]
			for(j2=0;j2<z.length;j2++){
				var z1={
					type:z[j2].getAttribute('type')+'',
					title:z[j2].getAttribute('title')+'',
					name:z[j2].getAttribute('name')+'',
					default_value:z[j2].getAttribute('default_value')+'',
				};
				_theme.vars[group.attributes.name.replace(/ /g,'').toLowerCase()+'.'+z1.name.replace(/ /g,'').toLowerCase()]=z1.default_value;
				group.items.push(z1);
			}
			_theme.groups[j1]=group;
			themes[_theme.id]=_theme;
		}
	}
	themeList.urls=urls;
	themeList.themes=themes;
}
function hostMatch(host1,host2){
	if(typeof(host1)!='string'||typeof(host2)!='string')return;
	var s1=host1.split('.');
	var s2=host2.split('.');
	var i=-1;
	if(s2.length>0)
		while(i<s2.length-1){
			i++;
			if((i>s1.length-1)&&s1[s1.length-1]=='*')
				return true;
			if(s1[i]!=s2[i]&&s1[i]!='*')
				return false;
		}
	return true;
}
function CSSParser(css,vars){
	var x;
	for(x in vars){
		var s1=css.indexOf('/*'+x+'*/');
		while(s1>=0){
			css=css.replace('/*'+x+'*/',vars[x]);
			s1=css.indexOf('/*'+x+'*/');
		}
	}
	return css;
}
function getThemesByHost(host){
	var x,themes={};
	for(x in themeList.themes){
		
		if(x=='default'){
			themes[x]=themeList.themes[x];
			themes[x].vars=getCssVarsByThemeId(x);
		}
		else{
			var i=0;
			if(typeof(themeList.themes[x])=='object'&&themeList.themes[x]!=null)
			if(Array.isArray(themeList.themes[x].urls)){
				for(i=0;i<themeList.themes[x].urls.length;i++){
					if(hostMatch(themeList.themes[x].urls[i],host)){
						themes[x]=themeList.themes[x];
						themes[x].vars=getCssVarsByThemeId(x);
						break;
					}
				}
			}
		}
	}
	return themes;
}
function getBackgroundImageName(){
	return uStyleStorage.backgroundImage.name;
}
function setBackgroundImageName(s){
	uStyleStorage.backgroundImage.name=s;
	sendBackgroundImageToAllTab();
	AutoSet.set=true;
}
function getBackgroundImage(){
	return uStyleStorage.backgroundImage;
}
function setBackgroundImage(s){
	if(typeof(s)=='object'&&String(s).indexOf('Object')>=0)
		uStyleStorage.backgroundImage=s;
	AutoSet.set=true;
}
function getStatusByHost(host){
	var _host= uStyleStorage.host[host];
	if(_host==null)return _default_status;
	else
		if(_host.status==null)return _default_status;
		else if(_host.status=='on'||_host.status=='off')
				return _host.status;
			else return _default_status;
}
function setStatusByHost(host,s){
	if(typeof(host)=='string'&&typeof(s)=='string'){
		if(uStyleStorage.host[host]==null)
			uStyleStorage.host[host]={};
		uStyleStorage.host[host].status=s;
		AutoSet.set=true;
	}
}
function getActiveThemeIdByHost(host){
	var activeThemeId;
	if(uStyleStorage.host[host])
		activeThemeId=uStyleStorage.host[host].activeThemeId;
	if(activeThemeId==null||themeList.themes[activeThemeId]==null){
		activeThemeId='default',themes=getThemesByHost(host);
		for(x in themes){
			if(typeof(themes[x])=='object'&&themes[x]!=null){
				if(x!='default'&&themes[x].default=='true'&&activeThemeId=='default')
					activeThemeId=x;
				if(activeThemeId!='default'&&x!='default'&&themes[x].default=='true'&&(themes[x].number>themes[activeThemeId].number))
					activeThemeId=x;
			}
		}
	}
	return activeThemeId;
}
function setActiveThemeIdByHost(host,theme_id){
	if(typeof(theme_id)=='string'&&typeof(host)=='string'){
		if(uStyleStorage.host[host]==null)
			uStyleStorage.host[host]={};
		uStyleStorage.host[host].activeThemeId=theme_id;
		AutoSet.set=true;
	}
	sendCssTextToActiveTab();
}
function getActiveCssTextByHost(host){
	var theme_id=getActiveThemeIdByHost(host);
	var css_text=getCssTextByThemeId(theme_id);
	return css_text;
}
function getCssTextByThemeId(theme_id){
	var css= themeList.themes[theme_id].cssText;
	var vars=getCssVarsByThemeId(theme_id);
	var css_text=CSSParser(css,vars);
	return css_text;
}
function getCssVarsByThemeId(theme_id){
	var vars= uStyleStorage.cssVar[theme_id];
	var default_vars=themeList.themes[theme_id].vars;
	var _vars={};
	if(vars==null)
		_vars=default_vars;
	else{
		var x;
		for(x in default_vars){
			if(vars[x]!=null)_vars[x]=vars[x];
			else _vars[x]=default_vars[x];
		}
	}
	return _vars;
}
function setCssVarsByThemeId(theme_id,vars){
	if(typeof(theme_id=='string')&&typeof(vars)=='object'&&vars!=null){
		uStyleStorage.cssVar[theme_id]=vars;
		AutoSet.set=true;
		sendCssTextToTabUseTheme(theme_id);
	}
}
function setBadgeText(){
	browser.tabs.query({active:true,currentWindow:true}).then(function(tab){
		if(tab.length<=0)return;
		var host=tab[0].url.split('/')[2];
		browser.storage.local.get(host).then(function(items){
			var s=getStatusByHost(host);
			//if(s==null)s='off';
			if(s=='on'){
				browser.browserAction.setIcon({path: 'icon.png'});
				//browser.browserAction.setBadgeText({text: 'On'});
			}
			if(s=='off'){
				browser.browserAction.setIcon({path: 'icon_off.png'});
				//browser.browserAction.setBadgeText({text: 'Off'});
			}
		});
	});
};
function getHostByUrl(url){
	if(url==null||url=='')return '';
	if(typeof(url)=='string'){
		if(url.indexOf('http://')!=0&&url.indexOf('https://')!=0)return '';
		var host=url.split('/')[2];
		if(host==null)host='';
		return host;
	}
}
function webload(){
	browser.runtime.onMessage.addListener(function(request,sender,response){
		if(sender.tab){
			var host=getHostByUrl(sender.tab.url);
			if(host!=''){
				var current_status=getStatusByHost(host);
				var cssText=getActiveCssTextByHost(host);
				var backgroundImage=getBackgroundImage();
				browser.tabs.sendMessage(sender.tab.id,{setStatus:current_status,cssText:cssText,backgroundImage:backgroundImage});
			}
		}
	});
}
function sendCssTextToActiveTab(){
	browser.tabs.query({active:true,currentWindow:true}).then(function(tabs){
		var css_text='';
		if(tabs.length<=0)return;
		var host=getHostByUrl(tabs[0].url);
		if(host!=''){
			css_text= getActiveCssTextByHost(host);
		}
		browser.tabs.sendMessage(tabs[0].id,{cssText:css_text});
	});
}
function sendCssTextToTabUseTheme(theme_id){
	browser.tabs.query({}).then(function(tabs){
		if(tabs.length<=0)return;
		var css_text=getCssTextByThemeId(theme_id);
		for(i=0;i<tabs.length;i++){
			var host=getHostByUrl(tabs[i].url);
			if(host!=''){
				var tab_theme_id=getActiveThemeIdByHost(host);
				if(tab_theme_id==theme_id){
					browser.tabs.sendMessage(tabs[i].id,{cssText:css_text});
				}
			}
		}
	});
}
function sendBackgroundImageToAllTab(){
	browser.tabs.query({}).then(function(tabs){
		var i;
		for(i=0;i<tabs.length;i++){
			browser.tabs.sendMessage(tabs[i].id,{backgroundImage:getBackgroundImage()});
		}
	});
}
browser.tabs.onActivated.addListener(function(activeInfo){
	setBadgeText();
});
browser.windows.onFocusChanged.addListener(function(id){
	setBadgeText();
});
browser.tabs.onUpdated.addListener(function(){
	  setBadgeText();
});
themeParser();
webload();
//-------------------------------------------------------------------------------------------------------------------------------------------------------