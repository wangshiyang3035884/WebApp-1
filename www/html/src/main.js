/**
 * baofeng.index
 * Created by lijinpeng on 2014/10/21.
 */
$(document).ready(function(){
	baofeng.utils.provide("baofeng.main");	
	$(document).bind('touchmove', function (event) {
		event.preventDefault();
	});	 	
	baofeng.main = function(){
		var viewlist = $('*[data-view]'),mainview = $('#main_view');
		function tapactivityanimation(event){
			var type = event.target.getAttribute("data-type");
			switch(type){
				case "superiors":
					baofeng.utils.setStyle(mainview[0], {"transform": "translateX(0)"});
					baofeng.utils.setStyle(this, {"transform": "translateX(100%)"});			  
				  break;
				default:
			}
			event.preventDefault();			
		}
		function tapmainanimation(event){
			var index = event.target.getAttribute("data-index");
			if(index){
				baofeng.utils.setStyle(mainview[0], {"transform": "translateX(-100%)"});
				baofeng.utils.setStyle(viewlist[index], {"transform": "translateX(0)"});
			}
			event.preventDefault();			
		}
		mainview.bind("tap",tapmainanimation);	
		for(var i=0,l=viewlist.length;i<l;i++){
			$(viewlist[i]).bind("tap",tapactivityanimation);	
		}				 			
	};
	baofeng.main();
}); 
