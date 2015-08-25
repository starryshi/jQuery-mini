function myAddEvent(obj, type, fn) {
	if (obj.attachEvent) {
		// obj.attachEvent('on' + type, fn);//bug: 会把this变成window
		obj.attachEvent('on' + type, function() {
			fn.call(obj);
		});
	} else {
		obj.addEventListener(type, fn, false);
	}
}

function getByClass(oParent, sClass) {
	var aEle = oParent.getElementsByTagName('*');
	var aResult = [];
	var i = 0;
	for (var i = 0; i < aEle.length; i++) {
		if (aEle[i].className == sClass) {
			aResult.push(aEle[i]);
		}
	}
	return aResult;
}

//获取样式
function getSyle(obj, attr) {
	if (obj.currentSyle) {
		return obj.currentSyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
}
// $:
// $(function(){}) 函数——事件绑定
// $('') 字符串——选择器
// $(obj) 对象
function VQuery(vArg) { //构造函数

	this.elements = []; // 用来保存选中的元素

	switch (typeof vArg) {
		case 'function':
			// window.onload = vArg;
			myAddEvent(window, 'load', vArg);
			break;
		case 'string':
			switch (vArg.charAt(0)) {
				case '#': //ID选择器
					var obj = document.getElementById(vArg.substring(1));
					this.elements.push(obj);
					break;
				case '.': //class
					this.elements = getByClass(document, vArg.substring(1));
					break;
				default: //tagName
					this.elements = document.getElementsByTagName(vArg);
			}
			break;
		case 'object':
			this.elements.push(vArg);

	}
}

VQuery.prototype.click = function(fn) {
	var i = 0;
	for (i = 0; i < this.elements.length; i++) {
		myAddEvent(this.elements[i], 'click', fn);
	}
};

VQuery.prototype.show = function() {
	var i = 0;
	for (i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'block';
	}
};

VQuery.prototype.hide = function() {
	var i = 0;
	for (i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'none';
	}
};

VQuery.prototype.hover = function(fnOver, fnOut) {
	var i = 0;
	for (i = 0; i < this.elements.length; i++) {
		myAddEvent(this.elements[i], 'mouseover', fnOver);
		myAddEvent(this.elements[i], 'mouseout', fnOut);
	}
};

//css() 1.设置样式；2.获取样式(第一个匹配的元素)
VQuery.prototype.css = function(attr, value) {
	if (arguments.length == 2) {
		var i = 0;
		for (i = 0; i < this.elements.length; i++) {
			this.elements[i].style[attr] = value;
		}
	} else {
		// return this.elements[0].style[attr];//只能是行间样式
		return getSyle(this.elements[0], attr);
	}
};

//获取属性
VQuery.prototype.attr = function(attr, value) {
	if (arguments.length == 2) {
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i][attr] = value;
		}
	} else {
		return this.elements[0][attr];
	}
};

VQuery.prototype.toggle = function() {

	var i = 0;
	var _arguments = arguments;
	for (i = 0; i < this.elements.length; i++) {
		addToggle(this.elements[i]);
	}

	function addToggle(obj) {
		var count = 0;
		myAddEvent(obj, 'click', function() {
			_arguments[count % _arguments.length].call(obj);
			count++;
		});
	}

};

VQuery.prototype.eq = function(n) {
	return $(this.elements[n]);
}

function appendArr(arr1, arr2) {
	for (var i = 0; i < arr2.length; i++) {
		arr1.push(arr2[i]);
	}
}
VQuery.prototype.find = function(str) {
	var aResult = [];
	for (i = 0; i < this.elements.length; i++) {
		switch (str.charAt(0)) {
			case '.': //class
				var aEle = getByClass(this.elements[i], str.substring(1)); //HTMLCollection不同于数组
				//aResult = aResult.concat(aEle);
				appendArr(aResult,aEle);
				break;
			default: //tagName
				var aEle = this.elements[i].getElementsByTagName(str);
				//aResult = aResult.concat(aEle);
				appendArr(aResult,aEle);



		}
	}
	//return aResult;  不能直接返回一个数组，否则不能使用.CSS()等jQuery方法
	var newVquery = $();
	newVquery.elements = aResult;
	return newVquery;

}

function getIndex(obj){
	var aBrother = obj.parentNode.children;
	for(var i=0 ;i<aBrother.length;i++){
		if(aBrother[i] == obj){
			return i;
		}
	}
}

VQuery.prototype.index = function(){
	return getIndex(this.elements[0]);

}

function $(vArg) { //$函数
	return new VQuery(vArg);
}