$(function() { 
    	var un = false,
    		pw = false,
    		em = false,
    		checkp = false;
    		
    		// 验证用户名是否为空
    		$("#UserName").on("blur", function(){
    			var userid = $("#UserName").val();
    			if (userid === ""){
    				$(".one").css({"color":"#ec3461"});
    				$(".one").html("用户名不能为空");
    				$("#UserName").focus();
    			} else if (!userid.match(/^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,19}$/)) {
    				$(".one").css({"color":"red"});
    				$(".one").html("用户名格式不正确");
    				$("#UserName").focus();
    			} else {
    				$(".one").html("用户名可用");
    				$(".one").css({"color":"green"});
    				un = true;
    			}
    		});
    		
    		
    		// 验证邮箱是否符合格式    			
    		$("#eMail").on("blur", function(){
    			var email = $("#eMail").val();
    			if (email === "") {
    				$(".two").css({"color":"#ec3461"});
    				$(".two").html("邮箱不可为空");  
    				$("#eMail").focus();
    			} else if (!email.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {
    				$(".two").css({"color":"red"});
    				$(".two").html("邮箱格式不正确");
    				$("#eMail").focus();
    			} else {
    				$(".two").html("邮箱可用");
    				$(".two").css({"color":"green"});
    				em = true;
    			}
    		});


    		// 验证密码是否为空
    		$("#passWord").on("blur", function(){
    			var pword = $("#passWord").val();
    			if (pword === ""){
    				$(".three").css({"color":"#ec3461"});
    				$(".three").html("密码不能为空");		
    				$("#passWord").focus();
    			} else if(!pword.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/)){
    				$(".three").html("密码格式不正确");
    				$(".three").css({"color":"red"});
    				$("#passWord").focus();
    			} else {
    				$(".three").html("密码可用");
    				$(".three").css({"color":"green"});
    				pw = true;
    			}
    		});
    			

			// 验证两次密码是否一致
			$("#repeatPassWord").on("blur", function(){
    			if ($("#passWord").val() !== $("#repeatPassWord").val()){
    				$(".four").css({"color":"#ec3461"});
    				$(".four").html("两次输入密码不一致,请重新输入");
    				$("#repeatPassWord").focus();
    			} else {
    				$(".four").html("密码正确");
    				$(".four").css({"color":"green"});
    				checkp = true;
    			}
    		});
	


		// 写入数据
    			$("#r_load_btn").on("click", function(){
    				console.log(un,pw,em,checkp)
	    			if(un === true && pw === true && em === true && checkp === true){
	    				$.ajax({
						   type: "POST",
						   url: "../php/insert.php",
						   data: "username=" + $("#UserName").val() + "&password=" + $("#passWord").val() + "&email=" + $("#eMail").val(),
						   success: function(data){
						     	$("#info").html(data);
						     	window.location.href = "/web/html/login.html";
		  					}
						});
	    			}else{
	    				$(".check").css({"display":"block"});
	    			}
    			});		
    });
    		
