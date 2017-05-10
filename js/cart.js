$(function () {
        		// 读取登陆者的信息
         			$.cookie.json = true;
         			var user = $.cookie("user") || '';
					
					//读取数据库中用户购物车信息
					$.cookie.json = true;
					$.ajax({
						url: "../php/cart.php",
						type: "get",
						data: {action:"search", username:user},
						dataType: "json",
						success:function(data){						
							$.cookie("products",data,{expires:7, path:"/"});
						}
					});
					
					//读取cookie中保存的products 
					var products = $.cookie("products") || [];
					console.log(products);
					
			
			        if(user === '') {
			          alert("未登录，请登录查看");
			          window.location.href = "/web/index.html";	
			        } else {
			          // 判断购物车是否为空
						if (products.length == 0) {
							alert("购物车为空，请选购商品");
							$(".empty").css({"display":"block"});
							$(".content").css({"display":"none"});
						} else{
						//不为空
						// 显示购物车中的商品信息
						$.each(products, function(index, element){	
							console.log(products);					
							var html = $(".clearfix:last").clone(true).data("product",element);	
							console.log(element.name)
							//图片
							html.children().eq(0).children().eq(1).children().eq(0).children().eq(0).prop("src",element.url);					
							//商品名字
							html.children().eq(0).children().eq(1).children().eq(1).children().eq(0).children().eq(0).text(element.name);
							//商品价格
							html.children().eq(0).children().eq(1).children().eq(1).children().eq(1).children().eq(0).children().text(element.price);
							//小计
							html.children().eq(0).children().eq(1).children().eq(1).children().eq(1).children().eq(1).text((element.price.substr(0,element.price.length) * element.amount).toFixed(2));
							//数量
							html.find(".cart_shop_quantity").val(element.amount);
							html.appendTo(".cart_list");	
							});
							//移除第一个节点
							$(".cart_list").children().eq(0).remove();
						}  
			 		}

				
					
				
			// 删除单行选购的商品:事件委派
			$(".cart_pro_del").on("click", function(){
				if (confirm("是否移除当前商品？")){
					var $row = $(this).parents(".clearfix");
					// 获取数组中要删除的元素
					var product = $row.data("product");
					// 从服务器保存的数据中删除
					$.ajax({
						url: "/web/php/cart.php",
						type: "get",
						data: {action:"delete", username:user, num:product.num}
					});
					/* 从 cookie 中删除 */
					// 找出数组中删除元素的索引
					var index = $.inArray(product, products);
					// 从数组中删除元素
					products.splice(index, 1);
					// 覆盖保存回 cookie 中
					$.cookie("products", products, {expires:7, path:"/"});

					// 从页面 DOM 结构中移除
					$row.remove();
					
					//更新合计
					calcTotal();
				}
			});
			
			
			//默认全选 
			$(".cart_shop_tit :checkbox").prop("checked", "checked");
				var _status = $(".cart_shop_tit :checkbox").prop("checked");
				// 设置所有商品的复选框选中状态与“全选”一致
				$(".cart_shop_choose :checkbox").prop("checked", _status);
				calcTotal();
			
			// 全选
			$(".cart_shop_tit :checkbox").on("click", function(){
				// 获取 “全选” 复选框的选中状态
				var status = $(this).prop("checked");
				// 设置所有商品的复选框选中状态与“全选”一致
				$(".cart_shop_choose :checkbox").prop("checked", status);
				// 计算商品总金额
				calcTotal();
			});
			
			//设置有一个未选中则全选不选中
			$(".cart_shop_choose :checkbox").on("click", function() {
				$(".cart_shop_tit :checkbox").prop("checked", "");
				calcTotal();
			});
		
			
		//合计函数
			function calcTotal() {
				// 获取 cart_body 中所有被选中的复选框
				var $ckbox = $(".cart_shop_choose :checkbox:checked");
				// 累加每个选中复选框所在行中的小计
				var sum = 0;
				$ckbox.each(function(index, element){
					sum += parseFloat($(element).parents(".clearfix").find(".sum").text())	
				});		
				$("#sum").text(sum.toFixed(2));
			}

		
		// 加数量
			$(".clearfix").on("click", ".cart_shop_num_add", function(){
				var $amount = $(this).prev();
				// 获取加之前的数量
				var _amount = parseInt($amount.val());
				// 将加数量后的值放回文本框中
				$amount.val(++_amount);
				// 获取当前行中缓存的商品对象
				var product = $(this).parents(".clearfix").data("product");
				// 修改商品对象的数量
				product.amount = _amount;
				// 将 cookie 中该商品数量修改
				$.cookie("products", products, {expires:7, path:"/"});

				// 将服务器中当前修改数量的商品同步更新
				$.get("/web/php/cart.php", {action:"update", username:user, num:product.num, amount:_amount});

				// 更新小计
					var tol = (product.price.substr(0,product.price.length) * _amount).toFixed(2); 
					$(this).parents(".clearfix").find(".sum").text(tol);
				//更新合计
					calcTotal();
			});

		
		// 减数量
			$(".clearfix").on("click", ".cart_shop_num_dec", function(){
				var $amount = $(this).next();
				// 获取减之前的数量
				var _amount = parseInt($amount.val());
				if (_amount <= 1)
					return;
				// 将减数量后的值放回文本框中
				$amount.val(--_amount);
				// 获取当前行中缓存的商品对象
				var product = $(this).parents(".clearfix").data("product");
				// 修改商品对象的数量
				product.amount = _amount;
				// 将 cookie 中该商品数量修改
				$.cookie("products", products, {expires:7, path:"/"});

				// 更新小计
					var tol = (product.price.substr(0,product.price.length) * _amount).toFixed(2); 
					$(this).parents(".clearfix").find(".sum").text(tol);
				// 更新合计
					calcTotal();
			});
			
		// 输入数量
			var beforeAmount = 0;
			$(".clearfix").on("blur", ".cart_shop_quantity", function(){
				// 获取输入的数量值
				var _amount = $(this).val();
				// 验证数量值是否合法
				if (/^[1-9]\d*$/.test(_amount)){
					var product = $(this).parents(".clearfix").data("product");
					product.amount = _amount;
					$.cookie("products", products, {expires:7, path:"/"});
					// 更新小计
					var tol = (product.price.substr(0,product.price.length) * _amount).toFixed(2); 
					$(this).parents(".clearfix").find(".sum").text(tol);
					// 更新合计
					calcTotal();
				} else {
					$(this).val(beforeAmount);
				}
			}).on("focus", ".cart_shop_number .cart_shop_quantity", function(){
				beforeAmount = $(this).val();
			});

        });
	