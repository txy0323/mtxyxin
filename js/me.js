$(function () {
	$("#loginout").on("click", function(){
		// 读取cookie 中保存的用户名信息
          $.cookie.json = true;
        var user = $.cookie("user") || '';  
        if(user === '') {
          console.log("aa");
        } else {
          $.cookie("user", user, {expires:-1, path:"/"});
          window.location.href = "/web/index.html";	
 		}
	})

});
	