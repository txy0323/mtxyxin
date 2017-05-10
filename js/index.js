$(function() {
 
	//用户名
        // 读取cookie 中保存的用户名信息
          $.cookie.json = true;
          var user = $.cookie("user") || '';  
        if(user === '') {
          $(".peo-self span").text("登录");
        } else {
          // 修改登录字符
          $(".peo-self span").css({"display":"none"});
          $(".peo").css({"display":"block"});
 		}
 
    //跳转详情页
		$(".m-sale-box").on("click", ".link", function(){
  			var $cells = $(this).parents(".prd-into-box").children(),
  				_num = $cells.eq(0).text().trim();
  			console.log(_num);
  			
  			$.cookie("id", _num, {expires:7, path:"/"});
  			
			$.ajax({
				type: "POST",
				url: "/web/php/detail.php",
				data: "id=" + _num,   
				success:function(data){
					console.log(data);
					$.cookie("numproducts", data, {expires:7, path:"/"});
					window.location.href = "html/detail.html";
				}
			});
		});  
		
		
		//添加购物车
			$("#today-ul").on("click", ".Q-buy-btn" ,function(){
				var _num = $(this).prevAll(".num").text().trim();
  				console.log(_num);
				//读取数据库中商品信息
				$.ajax({
					type: "POST",
					url: "/web/php/indexpro.php",
					data: "id=" + _num,   
					success:function(data){
						console.log(data);
						$.cookie("numpro", data, {expires:7, path:"/"});
					}
				});
				
				$.cookie.json = true;
	       		var numpro = JSON.parse($.cookie("numpro"));
				console.log(numpro)
				
				$.each(numpro, function(index, element){	
					var _num = element.num;
					console.log(element.large1)
				// 创建对象
	      			var product = {
	      				url : element.large1,
	      				name : element.name,
						price : element.price,
						marketprice : element.marketprice,
						num : _num,
						amount:1					
					};
					
				// 从cokkie中读取数组结构
				$.cookie.json = true;
				var user = $.cookie("user") || "";
				var products = $.cookie("products") || [];
				console.log(typeof products);
				
					// 如果没有，添加
					var i = index(_num, products);
					if( i === -1){
						products.push(product);						
						 // 同步保存新选购商品
						$.getJSON("/web/php/cart.php", {action:"add", url:element.large1, name:element.name, price:element.price, marketprice:element.marketprice, num:_num, amount:1, username:user});
					} else{
						products[i].amount++;
						// 修改数量
						$.getJSON("/web/php/cart.php", {action:"update", num:_num, amount:products[i].amount, username:user});
					}
					// 将数组保存回 cookie 中			
					$.cookie("products", products, {expires:7, path:"/"});
					alert("添加成功");
					$.cookie("numpro", numpro, {expires:-1, path:"/"});
					console.log("aaa");
	      		
				// 查找 num对应商品在 products 数组中的索引
					function index(_num, products) {
						var index = -1;
						$.each(products, function(i){
							if (_num === this.num) { // _id 商品已被选购
								index = i;
								return false;
							}
						});
		
						return index;
					}
				});
			});
	});