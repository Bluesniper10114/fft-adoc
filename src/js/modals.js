/* DIALOG */
/* --------------------------------------------------------------------------------- */
jQuery(function () {


	var $html = jQuery('html');
	var $dialog = jQuery('[data-toggle=modal]');
	// var $dialogMask = jQuery('.dialog__mask');
	// var $dialogBody = jQuery('.dialog__body');
	// var $dialogClose = jQuery('.dialog__close');

	$dialog.on('click', function (e) {
		var $this = jQuery(this);
		var target = $this.data('target');

		if (jQuery(target + ' .dialog__mask').length === 0) return;

		getDialog(target);

		e.preventDefault();
	});


	function getDialog(target) {
		jQuery(target + ' .dialog__mask').addClass('dialog__mask--is-visible');

		$html.css('overflow-y', 'hidden');
		initCloseDiag(target);

	}

	function initCloseDiag(target) {
		jQuery(target + ' .dialog__mask').click(function (e) {
			closeDialog(target);
		}).children().click(function (e) {
			e.stopPropagation();
		});

		jQuery(target + ' .dialog__close').on('click', function (e) {
			e.preventDefault();
			closeDialog(target);
		});

		jQuery(document).keyup(function (e) {
			if (e.keyCode === 27) closeDialog();
		});

	}

	function closeDialog(target) {
		$html.css('overflow-y', 'unset');
		jQuery(target + ' .dialog__mask').removeClass('dialog__mask--is-visible');
	}

	window.closeModal = closeDialog;
	window.openModal = getDialog;

});
