---
layout: post
title: "linux下修改mysql 编码设置"
description: "linux下修改mysql 编码设置"
category: "mysql"
tags: [linux,mysql,编码,设置]
---
{% include JB/setup %}

#####在linux下使用mysql，默认安装的话，编码是latin1，在开发的时候会遇到中文乱码的情况。

可以先看下有哪些编码需要修改，mysql控制台下输入：

	SHOW VARIABLES LIKE 'character_set_%';

会输出

	+--------------------------+----------------------------+
	| Variable_name            | Value                      |
	+--------------------------+----------------------------+
	| character_set_client     | latin1                     |
	| character_set_connection | latin1                     |
	| character_set_database   | utf8                       |
	| character_set_filesystem | binary                     |
	| character_set_results    | latin1                     |
	| character_set_server     | latin1                     |
	| character_set_system     | utf8                       |
	| character_sets_dir       | /usr/share/mysql/charsets/ |
	+--------------------------+----------------------------+

除了*server、*database外，能能用这些指令来修改,如：

	SET character_set_client = utf8;

而server、database 可以修改/etc/mysql/my.cnf
在\[mysqld\]标签下添加

	character_set_server=utf8

重启
	
	sudo /etc/init.d/mysql restart
	
就好了