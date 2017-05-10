<?php
	header("Access-Control-Allow-Origin:*");
	header("Content-type:text/html;charset-utf-8");
	
	$connection = mysql_connect("bdm264098114.my3w.com", "bdm264098114", "Bleach10fandui");
	
	$num = $_POST["id"];
	
	// 设置读写 mysql 编码
	mysql_query("set character set 'utf8'");//读库 
	mysql_query("set names 'utf8'");//写库 

	mysql_select_db("bdm264098114_db");

	$sql = "SELECT id, num, name, introduce, marketprice, price, alt, url, large1, large2, large3, buy, brand, country, effect, pack, deadline, size, discount FROM mquality WHERE num = '$num'";

	$result = mysql_query($sql, $connection);


	$arr = array();
	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
		$arr[] = $row;
	}

	echo json_encode($arr);

	mysql_close($connection);
?>