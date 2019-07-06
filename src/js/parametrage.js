function allTennisCheck(checkboxElem) {
  if (checkboxElem.checked) {
    jQuery('input[id^="chk1-"]').prop("checked", true);
  } else {
    jQuery('input[id^="chk1-"]').prop("checked", false);
  }
}

jQuery('input[id^="chk1-"]').change(function() {
  var ischecked= this.checked;
  if(!ischecked){
    jQuery('#chk1-All').prop("checked", false);
  } else {
    if (jQuery('input[id^="chk1-"]:checked').length == 12) {
      jQuery('#chk1-All').prop("checked", true);
    }
  }
});

function allPadelCheck(checkboxElem) {
  if (checkboxElem.checked) {
    jQuery('input[id^="chk2-"]').prop("checked", true);
  } else {
    jQuery('input[id^="chk2-"]').prop("checked", false);
  }
}

jQuery('input[id^="chk2-"]').change(function() {
  var ischecked= this.checked;
  if(!ischecked){
    jQuery('#chk2-All').prop("checked", false);
  } else {
    if (jQuery('input[id^="chk2-"]:checked').length == 12) {
      jQuery('#chk2-All').prop("checked", true);
    }
  }
});

function allBeachCheck(checkboxElem) {
  if (checkboxElem.checked) {
    jQuery('input[id^="chk3-"]').prop("checked", true);
  } else {
    jQuery('input[id^="chk3-"]').prop("checked", false);
  }
}

jQuery('input[id^="chk3-"]').change(function() {
  var ischecked= this.checked;
  if(!ischecked){
    jQuery('#chk3-All').prop("checked", false);
  } else {
    if (jQuery('input[id^="chk3-"]:checked').length == 12) {
      jQuery('#chk3-All').prop("checked", true);
    }
  }
});


jQuery('input.mandatory').change(function(event) {
  var $input = jQuery(event.target);
  if ($input.val()) {
    jQuery('small[data-for="' + $input.attr('name')+'"]').hide();
  }
  else {
    jQuery('small[data-for="' + $input.attr('name')+'"]').show();
  }
});
