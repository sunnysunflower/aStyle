var bg_page=browser.runtime.getBackgroundPage().then(function(bg){
	//bg.setBackgroundImageName('zvhs');
	var active_node;
	function appendElement(z1,z2){
		var z=document.createElement(z2);
		z1.appendChild(z);
		return z;
	}
	function deleteBackgroundImage(){
		var _delete_button=appendElement(document.body,'span');
		_delete_button.textContent='Delete Background Image';
		_delete_button.classList.add('delete-button');
		_delete_button.addEventListener('click',function(){
			bg.setBackgroundImageName('');
			active_node.style.outline='';
		});
	}
	function clearChanges(){
		var _clear_button=appendElement(document.body,'span');
		_clear_button.textContent='Clear Changes';
		_clear_button.classList.add('clear-button');
		_clear_button.addEventListener('click',function(){
			bg.clearChanges();
		});
	}
	deleteBackgroundImage();
	clearChanges();
	var image_informations=[
			{
				name:'background-1',
				filename:'pexels-photo-268533.jpeg'
			},
			{
				name:'background-2',
				filename:'pexels-photo-355465.jpeg'
			},
			{
				name:'background-3',
				filename:'pexels-photo-255463.jpeg'
			},
			{
				name:'background-4',
				filename:'pexels-photo-129441.jpeg'
			},
			{
				name:'background-5',
				filename:'pexels-photo-248797.jpeg'
			}
		];
	function gallery(){
		var _active_name=bg.getBackgroundImageName();
		var _gallery=appendElement(document.body,'div');
		image_informations.forEach(function(info){
			var _image_outer=appendElement(_gallery,'div');
			_image_outer.classList.add('image-outer');
			_image=appendElement(_image_outer,'img');
			_image.src='images/'+info.filename;
			if(_active_name==info.name){
				_image_outer.style.outline='5px solid red';
				active_node=_image_outer;
			}
			_image.addEventListener('click',function(){
				if(active_node)
					active_node.style.outline='';
				_image_outer.style.outline='5px solid red';
				bg.setBackgroundImageName(info.name);
				active_node=_image_outer;
			});
		});
	}
	gallery();
});
