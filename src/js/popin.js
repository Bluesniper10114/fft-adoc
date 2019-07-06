function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
}

function showPopup() {
	setCookie('shown', 'true', 1);
	jQuery('#popin-modal .dialog__mask').addClass('dialog__mask--is-visible');
}

jQuery('#popin-modal .dialog__close, .popin-Fermer').on('click', function (e) {
	e.preventDefault();
	jQuery('html').css('overflow-y', 'unset');
	jQuery('#popin-modal .dialog__mask').removeClass('dialog__mask--is-visible');
});

jQuery('#popin-modal .dialog__mask').click(function (e) {
	jQuery('html').css('overflow-y', 'unset');
	jQuery('#popin-modal .dialog__mask').removeClass('dialog__mask--is-visible');
}).children().click(function (e) {
	e.stopPropagation();
});

(function(){
	var cookie = getCookie('shown');
	if (!cookie) {
		showPopup();
	}
}());