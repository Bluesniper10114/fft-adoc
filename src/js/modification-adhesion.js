jQuery(function () {

    jQuery(".chosen-select").chosen({disable_search_threshold: 10});
    var radioValue = jQuery("input[name='tarif']:checked").val();
    var radioValue2 = jQuery("input[name='tarif1']:checked").val();
    var radioValue3 = jQuery("input[name='tarif2']:checked").val();

    if(radioValue == 45)  {
      jQuery('#montantTarif').val('40,00');
      jQuery('#reductionAffichee').val('5,00');
    } else {
      jQuery('#montantTarif').val('50,00');
      jQuery('#reductionAffichee').val(' ');
    }
    if(radioValue2 == 45)  {
      jQuery('#montantTarif1').val('40,00');
      jQuery('#reductionAffichee1').val('5,00');
    } else{
      jQuery('#montantTarif1').val('50,00');
      jQuery('#reductionAffichee1').val(' ');
    }
    if(radioValue3 == 45)  {
      jQuery('#montantTarif2').val('40,00');
      jQuery('#reductionAffichee2').val('5,00');
    } else{
      jQuery('#montantTarif2').val('50,00');
      jQuery('#reductionAffichee2').val(' ');
    }


    jQuery('input[type=radio][name=tarif]').change(function() {
      if (this.value == 45) {
        jQuery('#montantTarif').val('40,00');
        jQuery('#reductionAffichee').val('5,00');
        jQuery( ".infobullereduction2" ).show();
      }
      else if (this.value == 50) {
        jQuery('#montantTarif').val('50,00');
        jQuery('#reductionAffichee').val(' ');
        jQuery( ".infobullereduction2" ).hide();
        }
    });

    jQuery('input[type=radio][name=tarif1]').change(function() {
      if (this.value == 45) {
        jQuery('#montantTarif1').val('40,00');
        jQuery('#reductionAffichee1').val('5,00');
      }
      else if (this.value == 50) {
        jQuery('#montantTarif1').val('50,00');
        jQuery('#reductionAffichee1').val(' ');
        }
    });

    jQuery('input[type=radio][name=tarif2]').change(function() {
      if (this.value == 45) {
        jQuery('#montantTarif2').val('40,00');
        jQuery('#reductionAffichee2').val('5,00');
      }
      else if (this.value == 50) {
        jQuery('#montantTarif2').val('50,00');
        jQuery('#reductionAffichee2').val(' ');
        }
    });
    jQuery( ".tickets" ).hide();
    jQuery("select#choixFormuleTarif").change(function(){
      if (jQuery( "select#choixFormuleTarif option:checked" ).val() == 26403) {
        jQuery( ".tickets" ).fadeIn( "slow", function() {
          // Animation complete
        });
      }
    });

}());
