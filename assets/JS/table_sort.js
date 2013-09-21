document.write("<script language='javascript' src='https://rawgithub.com/imbolo/jsTools/master/compatibility/ArraySort.js' ></script>");
/**
* 传入Table，为其绑定点击排序事件
**/
function enhanceTable(table) {
	var theadArr = [];
	var sortFlat = false;
	var theadNode = table.tHead.rows[0].cells;
	//先储存到一个array中， 方便后面去排序
	for (var i=0; i<theadNode.length; i++) {
		theadArr.push(theadNode[i]);
	} 
	//table thead 的点击回调函数
	function onClickTHead(event) {
		sortTable(table, theadArr.indexOf(event.target), sortFlat);
		sortFlat = !sortFlat;
	}
	//排序Table函数
	function sortTable(table, indexOfColumn, isAsc) {
		var arrTableRows;
		try {
			arrTableRows = Array.prototype.slice.call(table.tBodies[0].rows);
		} catch (ex) {
			arrTableRows = []
			for(var i=0; i<table.tBodies[0].rows.length; i++) {
				arrTableRows.push( table.tBodies[0].rows[i] );
			}
		}
		
		
		//简单起见，排序规则就是字符串比较，一般情况够用了
		arrTableRows.sort( function (a, b) {
			return isAsc==true? 
			 (a.cells[indexOfColumn].innerHTML > b.cells[indexOfColumn].innerHTML) :
			 (a.cells[indexOfColumn].innerHTML < b.cells[indexOfColumn].innerHTML);
		});
		//最小化现场更新
		var markUp = "";
		for(var i=0; i<arrTableRows.length; i++) {
			markUp += "<tr>";
			markUp += arrTableRows[i].innerHTML
			markUp += "</tr>";
		}
		table.tBodies[0].innerHTML = markUp;
		
		return arrTableRows;
	}
	table.tHead.addEventListener("click", onClickTHead);
}
