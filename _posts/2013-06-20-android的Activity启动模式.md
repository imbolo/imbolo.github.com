---
layout: post
title: "【转】Activity启动模式 "
description: "android中Activity启动模式有四种"
category: "android"
tags: [android]
---



【转自】[http://www.cnblogs.com/fanchangfa/archive/2012/08/25/2657012.html](http://www.cnblogs.com/fanchangfa/archive/2012/08/25/2657012.html)

1. standard 模式启动模式	
	每次激活Activity时都会创建Activity，并放入任务栈中。    
2. singleTop        
	如果在任务的栈顶正好存在该Activity的实例， 就重用该实例，否者就会创建新的实例并放入栈顶(即使栈中已经存在该Activity实例，只要不在栈顶，都会创建实例)。    
3. singleTask	
	如果在栈中已经有该Activity的实例，就重用该实例(会调用实例的onNewIntent())。重用时，会让该实例回到栈顶，因此在它上面的实例将会被移除栈。如果栈中不存在该实例，将会创建新的实例放入栈中。     
4. singleInstance	
	在一个新栈中创建该Activity实例，并让多个应用共享改栈中的该Activity实例。一旦改模式的Activity的实例存在于某个栈中，任何应用再激活改Activity时都会重用该栈中的实例，其效果相当于多个应用程序共享一个应用，不管谁激活该Activity都会进入同一个应用中。

