---
layout: post
title: "knockoutJS 绑定时设定作用范围"
description: "knockoutJS 绑定时设定作用范围"
category: knockoutJS
tags: [JS]
---
{% include JB/setup %}

####从AngularJS中看到可以设定的脚本作用域

从AngularJS中看到可以设定的脚本作用域，
这种功能在有的时候把功能模块化添加的时候用处很大，
那knockoutJS里能不能呢，从官方文档上一直没有读到相关的地方啊。

然后今天在逛stackoverflow的时候发现了解决办法。

原来 **ko.applyBindingsf**方法是可以接受两个参数的，
第一个参数就是viewModel了，第二个是作为作用范围root节点的DOM元素。

然后就可以这样写了

	<div id="one">
	  <input data-bind="value: name" />
	</div>
	
	<div id="two">
	  <input data-bind="value: name" />
	</div>
	
	<script type="text/javascript">
	  var viewModelA = {
	     name: ko.observable("Bob")
	  };
	  var viewModelB = {
	     name: ko.observable("Ted")
	  };
	 
	  ko.applyBindings(viewModelA, document.getElementById("one"));
	  ko.applyBindings(viewModelB, document.getElementById("two"));
	</script>	


原帖地址 <http://stackoverflow.com/questions/7342814/knockoutjs-ko-applybindings-to-partial-view?answertab=votes#tab-top>