function rcmenu(){

	$('.rc-list').toggle();

$(".rc-list #nav ul ").css({display: "none"}); // Opera Fix
$(".rc-list #nav li").hover(function(){
		$(this).find('ul:first').css({visibility: "visible",display: "none"}).show(400);
		},function(){
		$(this).find('ul:first').css({visibility: "hidden"});
		});
}

 
 $(document).ready(function(){					
	rcmenu();
});