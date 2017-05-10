$(function(){

			$.cookie.json = true;
	        var numproducts = JSON.parse($.cookie("numproducts"));

	        console.log(numproducts);

	        $.each(numproducts, function(index, element){				
				console.log($(".pro_sg_price").children().eq(0).text());
				
			// 名字
				$(".show_cs").children().eq(0).children().eq(1).text(element.name);
			// 图片
				$("#image0").prop("src",element.large1);
				$("#image1").prop("src",element.large2);
				$("#image2").prop("src",element.large3);
			//现价
				$(".pro_sg_price").children().eq(0).text("￥" + element.price)
			//市价
				$(".pro_sg_price").children().eq(1).text("￥" + element.marketprice);
			//商品品牌
				$(".show_cs").children().eq(1).children().eq(1).text(element.brand);
			//商品功效
				$(".show_cs").children().eq(4).children().eq(1).text(element.effect);
			//商品包装
				$(".show_cs").children().eq(5).children().eq(1).text(element.pack);
			//商品产地
				$(".show_cs").children().eq(6).children().eq(1).text(element.country);
			//保质期
				$(".show_cs").children().eq(7).children().eq(1).text(element.deadline);
			//折扣
				$("#discount").text(element.discount + "折");
			//已售
				$(".sg_pro_num").children().eq(0).text("已售：" + element.buy);
			//商品描述
				$("#introduce").text(element.introduce);
			});	
			
			//跳转购物车
	        $(".bt_nav_3").click(function () {
	            window.location.href = "/web/html/cart.html";
	        });
			
			
			//添加购物车
			$(".bt_nav_4").on("click", function(){
				$.each(numproducts, function(index, element){	
					var _num = element.num;
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