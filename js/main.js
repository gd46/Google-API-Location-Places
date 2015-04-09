$( document ).ready(function() {
    
    $('#test').click(function() {
    	$('#locations-list').toggleClass("active");
    	if($('#locations-list').hasClass('active')){
    		$('#locations-list').animate({
		  		'right': '0px'
		  }, 4000);
    	} else{
    		$('#locations-list').animate({
		  		'right': '-480px'
		  	}, 4000);
    	}
	});

});