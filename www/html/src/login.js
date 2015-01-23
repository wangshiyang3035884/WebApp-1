/**
 * baofeng.index
 * Created by lijinpeng on 2014/10/21.
 */
$(document).ready(function(){
	baofeng.utils.provide("baofeng.login");
	$(document).bind('touchmove', function (event) {
		event.preventDefault();
	}); 	
	baofeng.login = function(){
		var bool=true,loginview = $('.login'),landedview = $('.landed');
		function tapanimation(event){
			var loginx = "0px",landedx ="100%";
			if(bool){
				loginx = "-100%";
				landedx = "0px";
			}
			baofeng.utils.setStyle(loginview[0], {"transform": "translateX("+loginx+")"});
			baofeng.utils.setStyle(landedview[0], {"transform": "translateX("+landedx+")"});			
			bool=!bool;
		}
		loginview.bind("tap",tapanimation);	
		landedview.bind("tap",tapanimation);
		event.preventDefault();
	};
	baofeng.login();
}); 
