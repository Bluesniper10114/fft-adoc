if (document.getElementById('vdm_yes') != null && document.getElementById('vdm_no') != null) {
	var vmd_yes = document.getElementById('vdm_yes').checked;
	var vmd_no = document.getElementById('vdm_yes').checked;
	
	var preshop = document.getElementById('preshop');
	
	if (!vmd_yes && !vmd_no) preshop.style.visibility = 'hidden';
	if (vmd_yes) preshop.style.visibility = 'visible';
	if (vmd_no) preshop.style.visibility = 'hidden';
	
	jQuery('#vdm_yes').change(function () {
		preshop.style.visibility = 'visible';
	});
	
	jQuery('#vdm_no').change(function () {
		preshop.style.visibility = 'hidden';
	});
}