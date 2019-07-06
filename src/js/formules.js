(function(){
	jQuery('.tablinks').on('click', function (e) {
		e.preventDefault();
		var tabID = jQuery(this).children("a").attr('tab-content');

		var i, tabcontent, tablinks;
		tabcontent = document.getElementsByClassName("fft-tab-content");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].className = "fft-tab-content";
		}
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].className = "tablinks";
		}
		document.getElementById(tabID).className += " active";
		e.currentTarget.className += " current";
	});

// BLocking columns
	var $window = jQuery(window);
	var $colRight = jQuery('.content-right');
	$window.scroll(function(){
	    if ($window.scrollTop() >= 400) {
	        $colRight.attr('style', 'position:fixed;top: 0;; left:50%;');

	    }
	    else {
	        $colRight.attr('style', 'position:static');
	    }
	});

	var acc = document.getElementsByClassName("action");
	var i;

	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function() {
			this.classList.toggle("active");
			var panel = this.nextElementSibling;
			if (panel.style.display === "block") {
				panel.style.display = "none";
			} else {
				panel.style.display = "block";
			}
		});
	}
}());
