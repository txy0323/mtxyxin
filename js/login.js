$(function() {
	// 读取cookie 中保存的用户名信息
		$.cookie.json = true;
		var _users = $.cookie("user") || '';
		//将用户名信息填到表单里 
		console.log(_users);
		if(_users !== ""){
			$("#loginModel_UserName").val(_users); 
		} else {
			$("#loginModel_UserName").val("");	
		}						        
	$(".r_load_btn").on("click", function(){
		var user = $("#loginModel_UserName").val(),
			pword = $("#loginModel_Password").val();
			console.log(user,pword)
		$.ajax({
			type: "POST",
			url: "../php/login.php",
			data: "username=" + user + "&password=" + pword,    				
			success: function(data){
				console.log(data);
		    	if (data === "0"){
		    		$("#info").html("用户名或密码错误");
		    		return false;
		    	} else {		
					$.cookie.json = true;
    				$.ajax({
						url: "/web/php/cart.php",
						type: "get",
						data: {action:"search", username:user},
						dataType: "json",
						success:function(data){	
							var remen = $("#remain").prop("checked");
								if(remen){
									$.cookie("user", user, {expires:7, path:"/"});						
							    } else {
									$.cookie("user", user, {expires:-1, path:"/"});
								}					
							$.cookie("user", user, {expires:7, path:"/"});
							$.cookie("products",data,{expires:7, path:"/"});
							window.location.href = "/web/index.html";					
						}
					});		    				
		    	}
			}
		});
	});
});