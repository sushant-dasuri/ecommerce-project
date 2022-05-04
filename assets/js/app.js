const _body = $('body');
const _preloader = $("#preloader");

$(window).on('load', function() {
    _preloader.delay(2000).fadeOut('slow', function(){
		_body.css({'overflow-y':'unset'});
	});
})