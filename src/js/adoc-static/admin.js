document.observe("dom:loaded", initialisationPage);

function triggerEvent(element, eventName) {
    // safari, webkit, gecko
    if (document.createEvent)
    {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent(eventName, true, true);

        return element.dispatchEvent(evt);
    }

    // Internet Explorer
    if (element.fireEvent) {
        return element.fireEvent('on' + eventName);
    }

}

/**
 * ---------------------------------------------------------------------------
 * VARIABLES D'INITIALISATION
 * ---------------------------------------------------------------------------
 */
var typesFormule = $H(
    {
        'COT': $H({'AB': 'Abonnement', 'CA': 'Carnet de Ticket'}),
        'ENS': $H({'CO': 'Cours', 'ST': 'Stage'}),
        'ANI': $H({'AN': 'Animation'})
    }
);
var imgAttente = '<img src="img/ajax_loader.gif" name="img_attente" alt="Patientez..."/>';
var imgAttenteModal = '<img src="img/ajax_loader.gif" name="img_attente_modal" alt="Patientez..."/>';

// Permettra de convertir les caracteres accentue en caracteres non accentue
function enleverAccents(str)
{
 var rExps=[
 {re:/[\xC0-\xC6]/g, ch:'A'},
 {re:/[\xE0-\xE6]/g, ch:'a'},
 {re:/[\xC8-\xCB]/g, ch:'E'},
 {re:/[\xE8-\xEB]/g, ch:'e'},
 {re:/[\xCC-\xCF]/g, ch:'I'},
 {re:/[\xEC-\xEF]/g, ch:'i'},
 {re:/[\xD2-\xD6]/g, ch:'O'},
 {re:/[\xF2-\xF6]/g, ch:'o'},
 {re:/[\xD9-\xDC]/g, ch:'U'},
 {re:/[\xF9-\xFC]/g, ch:'u'},
 {re:/[\xD1]/g, ch:'N'},
 {re:/[\xF1]/g, ch:'n'} ];

 for(var i=0, len=rExps.length; i<len; i++)
  str=str.replace(rExps[i].re, rExps[i].ch);

 return str;
}

function dwrException(msg, exc) {
  alert(msg);
}

function dwrHandlerMessageReturn(data) {
  if (data != null) {
    if (data.errors != null && data.errors.length > 0) {
      var msg = "";
      data.errors.forEach(function(error) {
        msg += error + " ";
      });
      dwrException(msg, null);
    }
    if (data.values != null && data.values.success) {
      return data.values.success;
    }
  }
  return false;
}

/**
 * ---------------------------------------------------------------------------
 * initialisationPage Appelle les fonctions d'initialisation à chaque chaque
 * chargement de page
 * ---------------------------------------------------------------------------
 */
function initialisationPage() {
  dwr.engine.setErrorHandler(dwrException);

  handleUpload();

  handleMenu();
  initCheckbox(null);
  initSlider();
    insertCalendars(null);              // Insertion des calendrier sur les
                                    // input.date
    remplaceVirguleMontants();      // Remplacement de la virgule automatique
                                    // sur les inputs de type montant
    saisieEntier();
    checkUncheckAll();              // Cocher décocher tous
    initAutocompletion(null);           // Initialisation des input pour
                                    // l'autocompletion des membres
    initAutocompletionFamille();    // Initialisation des input pour
                                    // l'autocompletion des familles
    initAutocompletionMembreRappro();   // Initialisation des input pour
                                        // l'autocompletion des familles
    initAutoCompletionMembreDWR();
    initAutoCompletionPersonnePelDWR();
    initAutoCompletionFamilleDWR();
    initAutoCompletionClubDWR();
    initJAutoCompletion();
    customPagingDisplayTag();       // Création de la pagination du footer du displayTable
    initSubForm();
    initButtonEnableIf();
    initAccordions();

    dwr.engine.setTextHtmlHandler(function() {
          document.location.href = 'loginMembre.do';
        });

    scrollTop();

}

function initAutoCompletionForm(input) {
  var form = input.up("form");
  if (form != null) {
    form.setAttribute("novalidate", "novalidate");
  }
}

function initJAutoCompletion() {
  $$("[data-role='jautocomplete']").each(function (element) {
    initAutoCompletionForm(element);

    var type = element.readAttribute('jautocomplete-type');
    var minChars = element.readAttribute('jautocomplete-minchars')
    var lookupLimit = element.readAttribute('jautocomplete-limit');
    var triggerOnSelect = element.readAttribute('jautocomplete-trigger-onselect');

        var elementId = element.id;
        var valueElement = $( element.id + "_value");
        var nameElement = $(element.id + "_nom_value");

        element.observe('change', function(event) {
          if(event.keyCode != Event.KEY_RETURN) {
            valueElement.value = '';
          }
        });

        jQuery('#' + elementId).autocomplete({
          noCache: true,
          minChars: minChars,
          lookupLimit: lookupLimit,
          maxHeight: null,
          lookup: function (query, done) {
            switch(type) {
              case "eleve":
              MembreService.getListeMembreByNomOuPrenomApprox(query, query, function(data) {
                        var result = { 'suggestions' : data.map(item => { return {'data': item.idMembre, 'value': nameValueSelectorMembre(item) }} ) };
                        done(result);
                });
                  break;
              case "joueur":
                MembreService.getListeMembreByNomResaApprox(query, $('resaDateLong').value, function(data) {
                        var result = { 'suggestions' : data.map(item => { return {'data': item.idMembre, 'value': nameValueSelectorMembreResa(item) }} ) };
                        done(result);
                });
                  break;
              default:
                  console.log("unknow type '" + type + "'")
            }
          },
            onSelect: function (suggestion) {
                valueElement.value = suggestion.data;
                if (nameElement) {
                    nameElement.value = suggestion.data;
                }
                if (triggerOnSelect) {
                  eval(triggerOnSelect);
                }
            }

        });
  });
}

function initButtonEnableIf() {
  $$("[role*='enable-if-checked']").each(function(button) {
    var filterField = button.getAttribute("checkbox-filter-field");
    var filterValue = button.getAttribute("checkbox-filter-value");
    initButtonEnableIfHandleCheckbox(button, button.getAttribute('checkbox-selector'), true, filterField, filterValue, null);
    initButtonEnableIfHandleCheckbox(button, button.getAttribute('checkbox-all-selector'), false, filterField, filterValue, button.getAttribute('checkbox-selector'));
  });
}
function initButtonEnableIfHandleCheckbox(button, checkboxSelector, initButtonStyle, filterField, filterValue, eachCheckboxSelector) {
  var checkboxes = $$(checkboxSelector);
  var filterCheckboxes = $$(eachCheckboxSelector != null ? eachCheckboxSelector : checkboxSelector);
  var formuleCloseCheckboxes = $$(eachCheckboxSelector != null ? eachCheckboxSelector : checkboxSelector);
  if (initButtonStyle && nbCheckBoxesChecked(checkboxes) == 0) {
    button.addClassName("disabled");
    button.disabled = true;
  };

  checkboxes.each(function (checkbox) {
    checkbox.observe('click', function(event) {
      var enableButton = false;

      if (filterField == null)  {
        if (checkbox.checked) {
          enableButton = true;
        }
      } else {
        if (hasCheckBoxesCheckedWithFilterValue(filterCheckboxes, filterField, filterValue)) {
          enableButton = true;
        }
      }

      if (enableButton) {
        button.removeClassName("disabled");
        button.enable();
      } else if (!checkCheckBoxes(checkboxes)) {
        button.addClassName("disabled");
        button.disable();
      }

    });
  })
}

function isButtonDisabled(button) {
  return button.hasClassName('disabled');
}

function initSubForm() {
  $$("[role*='show-subform']").each(function(button) {
    var subformSelected = $(button.getAttribute('subform-id'));
    subformSelected.hide();
    button.observe('click', function(event) {
      if (!isButtonDisabled(button)) {
        $$("[role='subform']").each(function(subform) {
          if (subform.id != subformSelected.id) {
            subform.hide();
          }
        });
        if (subformSelected.visible()) {
          subformSelected.hide();
        } else {
          subformSelected.show();
          subformSelected.scrollTo();
        }
      }
    });
  });
}



function handleUpload() {
  $$('input[type="file"]').each(function(item){
    var prefixId = item.id;
     // recherche de la zone dans laquelle injecter le bouton de remplacement
     var $zone = $(prefixId + 'ReplaceArea');
     if($zone) {
       item.hide();
       $zone.insert(
        "<button id='fakeUploadButton' onclick='browseForUploadWithRealButton("+item.id+");' type='button' class='btn2 icon-copier' name='buttonAttestation' style='flex: 0 !important;' ><p id='" + prefixId + "NameOfUploadedFile'>Parcourir</p></button>"
       );
       item.addEventListener( 'change', function( e ){
        document.getElementById(prefixId + "NameOfUploadedFile").textContent = item.files[0].name;
       });
     }
  });
}

function scrollTop() {
  if ($("top-link")) {
    $("top-link").observe('click', function(event) {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
  }
}

function browseForUploadWithRealButton(id){
  document.getElementById(id.id).click();
}

function handleMenu() {
  var menuStorageKey = "CURRENT_MENU_ID";

  $$("#fft-profile-nav").each(function(item) {
    item.observe('mouseover', function(event) {
      $$("select:focus").each(function (select) {
        select.blur();
      });
    });
  });

  $$("li.submenu a ").each(function(item) {
    var menu = item.up("li.submenu");
    item.observe('click', function(event) {
      sessionStorage.setItem(menuStorageKey, menu.id);
    });
  });
  $$("li.home ").each(function(menu) {
    menu.observe('click', function(event) {
      sessionStorage.setItem(menuStorageKey, menu.id);
    });
  });

  if (window.location.href.indexOf("/accueil.do") >= 0) {
    sessionStorage.setItem(menuStorageKey, "submenu_home");
  }

  var currentMenuId = sessionStorage.getItem(menuStorageKey);
  if (currentMenuId != null && $(currentMenuId) != null) {
    $(currentMenuId).addClassName("current");
  }

}

var COUNTER_ID = 1;

function generateId(prefix) {
  var id = prefix + "_" + COUNTER_ID;
  COUNTER_ID = COUNTER_ID + 1;
  return id;
}

function initCheckbox(prefix) {
    $$((prefix != null ? prefix : '' ) + 'input[type=checkbox]').each(function (checkbox) {
      if (checkbox.hasClassName('radio')) {
        return;
      }

      var id = null;
      if (checkbox.id != null && checkbox.id != "") {
        id = checkbox.id;
      } else {
        id = generateId("chk");
        checkbox.id = id;
      }
      if ($$("label[for='"+id+"']") == null || $$("label[for='"+id+"']").length == 0) {
        $(checkbox).insert({ after: "<label for='" + id + "'></label>" });
      }

    });

}

function initSlider() {
  // Sliders
  $$("div[role='slider']").each(function(sliderElement) {
    var numberElement = $(sliderElement.getAttribute('slider-number-id'));
      noUiSlider.create(sliderElement, {
          start: numberElement.value != null && numberElement.value != '' ? numberElement.value : sliderElement.getAttribute('slider-start'),
          range: {
            'min': parseInt(sliderElement.getAttribute('slider-min')),
            'max': parseInt(sliderElement.getAttribute('slider-max'))
          }
        });

      sliderElement.noUiSlider.on('update', function(values, handle) {
        numberElement.value = parseInt(values[handle]);
        });

      numberElement.on('change', function() {
        sliderElement.noUiSlider.set([this.value, null]);
      });

  });

  var slider2 = $$("div[role='slider2']");

  $$("div[role='slider2']").each(function(sliderElement) {
    var minNumberElement = $(sliderElement.getAttribute('slider-min-number-id'));
    var maxNumberElement = $(sliderElement.getAttribute('slider-max-number-id'));
      noUiSlider.create(sliderElement, {
          start: [
            minNumberElement.value != null && minNumberElement.value != '' ? minNumberElement.value : sliderElement.getAttribute('slider-min-start'),
            maxNumberElement.value != null && maxNumberElement.value != '' ? maxNumberElement.value : sliderElement.getAttribute('slider-max-start')
          ],
          connect: true,
        tooltips: true,
          range: {
            'min': parseInt(sliderElement.getAttribute('slider-min')),
            'max': parseInt(sliderElement.getAttribute('slider-max'))
          },
          format: {
            to: function(value) {
              return parseInt(value);
            },
            from: function(value) {
              return parseInt(value);
            }
          }
      });

      sliderElement.noUiSlider.on('update', function(values, handle) {
        minNumberElement.value = values[0];
        maxNumberElement.value = values[1];
      });

  });
}

function initAccordions() {
    var items = $$('div[class~="accordion"]');

    for ( var index = 0; index < items.length; index++) {
        var element = items[index];
        new Accordion(element.getAttribute("id"), 1);
    }
}

/**
 * ---------------------------------------------------------------------------
 * Gestion des erreurs d'appel de requête Ajax. On affiche ici une popup
 * d'alerte indiquant qu'une erreur est survenue.
 * ---------------------------------------------------------------------------
 */
Ajax.Responders.register({
    onException: function() {  },
    onFailure: function() {  },
    onComplete : removeImagesAttente
});

/**
 * Ouverture d'un modal via ajax
 * @param pElement Element sur lequel a été déclenché l'ouverture (this)
 * @param pModalUrl Url
 * @param pModalOptions Options de la modale
 */
function openAjaxModal(pElement, pModalUrl, pModalOptions) {
    new Ajax.Request(pModalUrl, {
          method:'post',
          encoding: 'ISO-8859-1',
          onSuccess: function(pResponse) {
              var sessiontimeOut = pResponse.getHeader("SessionTimeOut");
              if (sessiontimeOut != null && sessiontimeOut == "true") {
                  alert("Votre session a expiré. Veuillez vous reconnecter.");
                  window.location.reload();
                  return ;
              }

              var html = pResponse.responseText || "Aucune réponse";
              var v = FFTDialog.alert(html, pModalOptions);
              v.setSize(v.getSize().width, v.getSize().height);
          },
          onFailure: function() { alert('Une erreur est survenue.'); }
    });
}


/**
 * ---------------------------------------------------------------------------
 * removeImagesAttente : retire les images de chargement lors d'appel à des
 * requêtes Ajax
 * ---------------------------------------------------------------------------
 */
function removeImagesAttente() {
    $$('img[name="img_attente"]').each(function(item){item.remove();});
    $$('img[name="img_attente_modal"]').each(function(item){item.remove();});
}

function initAutoCompletionMembreDWR() {

    var itemsTab = $$('input[class~="autocompletion_membreDWR"]');

    for ( var index = 0; index < itemsTab.length; index++) {
        var element = itemsTab[index];
        initAutoCompletionForm(element);
        doAutoComplete(element);
    }
}

function doAutoComplete(elem){

    elem.observe('keyup', function(event){
        if(event.keyCode != Event.KEY_RETURN) {
            $(elem.id+'_value').value = '';
        }
    });

    new Autocompleter.DWR(elem.id, "autocomplete_choices_"+elem.id,
            updateListMembre,
            { valueSelector: nameValueSelectorMembre,
              minChars: 2,
              choices: 100,
              partialSearch: true,
              indicator: 'indicator_'+elem.id,
              afterUpdateElement: function(input , li , selectedObj)
                {
                    $(elem.id+'_value').value = (selectedObj.idMembre);

                    if($(elem.id+'_nom_value') != null){
                        $(elem.id+'_nom_value').value = (selectedObj.nom);
                    }

                    if(typeof(callbackAutocomplete)=='function')
                    {
                        callbackAutocomplete(input, li, selectedObj);
                    }
            }
    });
}

function updateListMembre(autocompleter, token) {
    MembreService.getListeMembreByNomApprox(token, function(data) {
        autocompleter.setChoices(data);
    });
}

function nameValueSelectorMembre(tag) {
    var codeCiv = tag.codeCivilite;

    if (codeCiv == 'M') {
        tag.codeCivilite = 'H';
    } else if (codeCiv == 'MLLE') {
        tag.codeCivilite = 'F';
    } else if (codeCiv == 'MME') {
        tag.codeCivilite = 'F';
    }

    return tag.nom + ' ' + tag.prenom + ' (' + tag.dateFormat + ' - ' + tag.codeCivilite + ' - ' + tag.numLicence + ' - ' + tag.idMillesime + ')';
}

function nameValueSelectorMembreResa(tag) {
    var retVal = tag.nom + " " + tag.prenom + " (";

    retVal = retVal + tag.anneeNaissance;
    retVal = retVal + " - " + tag.numLicence;
    retVal = retVal + " - " + tag.idMillesime;

    if (tag.classementActuel && tag.classementActuel.label) {
        retVal = retVal + " - " + tag.classementActuel.label;
    }

    retVal = retVal + ")";

    return retVal;
}

function initAutoCompletionPersonnePelDWR() {

    var itemsTab = $$('input[class~="autocompletion_personnePelDWR"]');

    for ( var index = 0; index < itemsTab.length; index++) {
        var elem = itemsTab[index];
        initAutoCompletionForm(elem);
        elem.observe('keyup', function(event){
            if(event.keyCode != Event.KEY_RETURN) {
                $(elem.id+'_value').value = '';
            }
        });

        new Autocompleter.DWR(elem.id, "autocomplete_choices_"+elem.id,
            function (autocompleter, token) { PaiementEnLigneService.findPersonnes(token, function(data) { autocompleter.setChoices(data); })},
                {
              valueSelector: function(tag) { return tag.nom + ' ' + tag.prenom; },
                  minChars: 2,
                  choices: 100,
                  indicator: 'indicator_'+elem.id,
                  afterUpdateElement: function(input , li , selectedObj)
                    {
                        $(elem.id+'_value').value = (selectedObj.idPersonne);

                        if($(elem.id+'_nom_value') != null){
                            $(elem.id+'_nom_value').value = (selectedObj.nom + ' ' + selectedObj.prenom);
                        }

                        if(typeof(callbackAutocomplete)=='function')
                        {
                            callbackAutocomplete(input, li, selectedObj);
                        }
                }
        });
    }
}




function handleAutoCompletionFamilleDWR(pItem, pForceEmpty) {
    if (pItem.hasClassName("color")) {
        var idValue = $(pItem.id+'_value').value;

        if (idValue != '' && !pForceEmpty) {
            $(pItem.id).setStyle({backgroundColor: "#C3FDB8"});
        } else if (idValue == '' && pForceEmpty) {
            $(pItem.id).setStyle({backgroundColor: "#ffffff"});
        }
    }
}

function initAutoCompletionFamilleDWR() {
    var item = $$('input[class~="autocompletion_familleDWR"]').first();

    if (item) {

        item.observe('keydown', function(event)
                {
                    if(event.keyCode != Event.KEY_RETURN) {
                        // La touche 'entrée' valide la sélection
                        $(item.id+'_value').value = '';
                        handleAutoCompletionFamilleDWR(item, true);
                    }
                }
            );
        item.observe('change', function(event)
                {
            handleAutoCompletionFamilleDWR(item, false);
                }
            );
        new Autocompleter.DWR(item.id, "autocomplete_choices_"+item.id,
                        updateListFamille,
                        { valueSelector: nameValueSelectorFamille,
                          minChars: 2,
                          selector: dwrAutocompleteSelector,
                          choices: 100,
                          partialSearch: true,
                          indicator: 'indicator_'+item.id,
                          afterUpdateElement: function(input , li , selectedObj)
                            {
                                $(item.id+'_value').value = (selectedObj.idFamille);

                                if($(item.id+'_nom_value') != null){
                                    $(item.id+'_nom_value').value = (selectedObj.nom);
                                }

                                handleAutoCompletionFamilleDWR(item, false);

                                if(typeof(callbackAutocomplete)=='function')
                                {
                                    callbackAutocomplete(input, li, selectedObj);
                                }
                        }
        });
        handleAutoCompletionFamilleDWR(item, false);
    }
}


function updateListFamille(autocompleter, token) {

    MembreService.getListeFamilleByNomApprox(token, function(data) {
          autocompleter.setChoices(data);
       });
    }

function nameValueSelectorFamille(tag){
       return tag.nom;
}


function initAutoCompletionClubDWR() {
    var item = $$('input[class~="autocompletion_clubDWR"]').first();

    if (item) {
        initAutoCompletionForm(item);
        item.observe('keydown', function(event) {
          if(event.keyCode != Event.KEY_RETURN) {
            // La touche 'entrée' valide la sélection
                $(item.id+'_value').value = '';
            }
        });
        item.observe('change', function(event) {});
        new Autocompleter.DWR(item.id, "autocomplete_choices_"+item.id,
            updateListClub,
                {
              valueSelector: nameValueSelectorClub,
                    minChars: 4,
                    selector: dwrAutocompleteSelector,
                    choices: 100,
                    partialSearch: true,
                    indicator: 'indicator_'+item.id,
                    afterUpdateElement: function(input , li , selectedObj) {
                      $(item.id+'_value').value = (selectedObj.value);
                        if($(item.id+'_nom_value') != null){
                          $(item.id+'_nom_value').value = (selectedObj.label);
                        }
                        if(typeof(callbackAutocomplete)=='function') {
                          callbackAutocomplete(input, li, selectedObj);
                        }
                    }
                }
       );
    }
}

function updateListClub(autocompleter, token) {
  GestionAccesService.findClubs(token, function(data) {
      autocompleter.setChoices(data);
    });
}

function nameValueSelectorClub(tag) {
  return tag.label;
}

/**
 * ---------------------------------------------------------------------------
 * initAutocompletion : initialise l'autocomplétion des MEMBRES du club
 * ---------------------------------------------------------------------------
 */
function initAutocompletion(prefix)
{
    $$((prefix != null ? prefix : '' ) + 'input[class~="autocompletion_membre"]').each(function(item)
        {
          initAutoCompletionForm(item);

            item.observe('keydown', function(event)
                {
                    if(event.keyCode != Event.KEY_RETURN)   // La touche
                                                            // 'entrée' valide
                                                            // la sélection
                        $('id_'+item.id).value = '';
                }
            );

            new Ajax.Autocompleter(item.id,
                                    "autocomplete_choices_"+item.id,
                                    base_url+"/selectMembre.do",
                                    {
                                        paramName: "value",
                                        minChars: 2,
                                        choices: 100,
                                        afterUpdateElement: function(input , li)
                                        {
                                            $('id_'+item.id).value = (li.id);
                                            if(typeof(callbackAutocomplete)=='function')
                                            {
                                                callbackAutocomplete(item, li.id);
                                            }
                                        },
                                        indicator: 'indicator_'+item.id
                                    }
            );
        }
    );
}

/**
 * ---------------------------------------------------------------------------
 * initAutocompletion : initialise l'autocomplétion des MEMBRES du club pour
 * rapprochement
 * ---------------------------------------------------------------------------
 */
function initAutocompletionMembreRappro()
{
    $$('input[class~="autocompletion_membre_rappro"]').each(function(item)
        {
          initAutoCompletionForm(item);

            item.observe('keydown', function(event)
                {
                    if(event.keyCode != Event.KEY_RETURN)   // La touche
                                                            // 'entrée' valide
                                                            // la sélection
                        $('id_'+item.id).value = '';
                }
            );

            new Ajax.Autocompleter(item.id,
                                    "autocomplete_choices_"+item.id,
                                    base_url+"/selectMembreRappro.do",
                                    {
                                        paramName: "value",
                                        minChars: 2,
                                        choices: 100,
                                        afterUpdateElement: function(input , li)
                                        {
                                            $('id_'+item.id).value = (li.id);
                                            if(typeof(callbackAutocomplete)=='function')
                                            {
                                                callbackAutocomplete(item, li.id);
                                            }
                                        },
                                        indicator: 'indicator_'+item.id
                                    }
            );
        }
    );
}

/**
 * ---------------------------------------------------------------------------
 * initAutocompletion : initialise l'autocomplétion des FAMILLES du club
 * ---------------------------------------------------------------------------
 */
function initAutocompletionFamille()
{
    $$('input[class~="autocompletion_famille"]').each(function(item)
        {
        initAutoCompletionForm(item);

            item.observe('keydown', function(event)
                {
                    if(event.keyCode != Event.KEY_RETURN) // La touche
                                                            // 'entrée' valide
                                                            // la sélection
                        $('id_'+item.id).value = '';
                }
            );

            new Ajax.Autocompleter(item.id,
                                    "autocomplete_choices_"+item.id,
                                    base_url+"/selectFamille.do",
                                    {
                                        paramName: "value",
                                        minChars: 2,
                                        choices: 100,
                                        afterUpdateElement: function(input , li)
                                        {
                                            $('id_'+item.id).value = (li.id);
                                            if(typeof(callbackAutocomplete)=='function')
                                            {
                                                callbackAutocomplete(item, li.id);
                                            }
                                        },
                                        indicator: 'indicator_'+item.id
                                    }
            );
        }
    );
}

/**
 * ---------------------------------------------------------------------------
 * changeTimeByIncrement : Permet de lier 2 select d'heures à partir d'un
 * incrément
 *
 * @param increment
 *            valeur de l'incrément en minutes
 * @param selectDebut
 *            id du select de l'heure de début
 * @param selectFin
 *            id du select de l'heure de fin
 *            ---------------------------------------------------------------------------
 */
function changeTimeByIncrement(increment, selectDebut, selectFin, timeZoneOffset)
{
    // Heure de debut min
    var debut = new Date(parseInt(selectDebut.value));
    var minutesDebut = debut.getHours()*60 + debut.getMinutes();

    // Heure de fin max
    var minutesFin = 23*60 + 59;

    var j = 0;
    var compteur_minutes = parseInt(minutesDebut);

    var offset =  -1 * parseInt(timeZoneOffset);
    selectFin.innerHTML = "";
    while(compteur_minutes <= minutesFin)
    {
        heures = str_pad(Math.floor(compteur_minutes/60), 2, "0", "left");
        min_restant = str_pad((compteur_minutes%60), 2, "0", "left");
        selectFin.options[j] = new Option(heures + ":" + min_restant, (compteur_minutes*60*1000) + offset);
        compteur_minutes = parseInt(compteur_minutes)+parseInt(increment);
        j++;
    }
}

/**
 * ---------------------------------------------------------------------------
 * selectDependants : Permet de gérer la dépendance entre deux select
 *
 * @param selectChange
 *            element select sur lequel le "onchange" est observé
 * @param selectToChange
 *            element select pour lequel on veut changer les options
 * @param hashValues
 *            hash définissant les dépendance entre les options du 1er select et
 *            celles du second Voir exemple de "typeFormule plus haut" pour la
 *            construction du hash
 *            ---------------------------------------------------------------------------
 */
function selectDependants(selectChange, selectToChange, hashValues)
{
    var i=0;
    selectToChange.innerHTML = '';
    hashValues.get(selectChange.value).each(function(item)
        {
            selectToChange.options[i] = new Option(item.value,item.key);
            i++;
        }
    );
}

/**
 * ---------------------------------------------------------------------------
 * checkUncheckAll : fonction sélectionnant toutes/aucune case à cocher dans les
 * listes de l'application (appelée au chargement des pages pour la
 * réinitialisation des listes)
 * ---------------------------------------------------------------------------
 */
function checkUncheckAll()
{
    if($$('input[name="tab"]').size() != 0)
    {
        fe = $$('tr[class="entete"]').first();
        var nbDisabled = 0;
        var disabled = "";
        /* Case 'ALL' désactivée ? */
        nbDisabled = $$('input:disabled[name="tab"]').length;
        if (nbDisabled == $$('input[name="tab"]').length)
        {
            disabled = "disabled=\"disabled\"";
        }
        /* Case 'ALL' cochée ? */
        nbCochees = $$('input:checked[name="tab"]').length;
        var checked = "";
        if (nbCochees == $$('input[name="tab"]').length)
        {
            checked = "checked";
        }
        if (fe != null) {
            fe.childElements().last().innerHTML = "<input type=\"checkbox\" name=\"check_uncheck_all\" title=\"Cocher Tous\" id=\"check_uncheck_all\" "+disabled+" "+checked+"/>";
        }
        // On observe le click sur "cocher/décocher tous"
        if ($('check_uncheck_all') != null) {
          $('check_uncheck_all').observe('click', function(){cocherDecocher($('check_uncheck_all'));});
        }

        // On observe le click sur "chaque checkbox associée"
        $$('input[name="tab"]').each(function(item)
            {
                item.observe('click', function(){cocherDecocher(item);});
            }
        );
    }

    checkUncheckAllCheckbox();
}

function checkUncheckAllCheckbox() {
  $$("[role='check_uncheck_all']").each(function (checkUncheckElement) {
    var checkboxType = checkUncheckElement.readAttribute('data-checkbox-type');
    var allCheckboxes = $$("input[checkbox-type='" + checkboxType + "']");
    checkUncheckElement.observe('click', function() {
      var check = false;
      if (checkUncheckElement.checked) {
        checkUncheckElement.title = "Décocher Tous";
        check = true;
      } else {
        checkUncheckElement.title = "Cocher Tous";
        check = false;
      }
      allCheckboxes.each(function (oneCheckbox) {
        oneCheckbox.checked = check;
      });
    });

    allCheckboxes.each(function (oneCheckbox) {
      oneCheckbox.observe('click', function() {
        var isCheckUncheckElementChecked = checkUncheckElement.checked;
        var nbChecked = 0;
        allCheckboxes.each(function (oneCheckbox) {
          nbChecked = nbChecked + (oneCheckbox.checked ? 1 : 0);
        });
        if (isCheckUncheckElementChecked && nbChecked != allCheckboxes.length) {
          checkUncheckElement.title = "Cocher Tous";
          checkUncheckElement.checked = false;
        } else if (!isCheckUncheckElementChecked && nbChecked == allCheckboxes.length) {
          checkUncheckElement.title = "Décocher Tous";
          checkUncheckElement.checked = true;
        }
      });
    });
  });

}

/**
 * ---------------------------------------------------------------------------
 * cocherDecocher : fonction qui gère la sélection d'une checkbox d'une liste
 * ---------------------------------------------------------------------------
 */
function cocherDecocher(checkbox_cliquee)
{
    // Si on clique sur "cocher/décocher tous"
    if(checkbox_cliquee.id == 'check_uncheck_all')
    {
        var status = false;
        var title = "Cocher Tous";
        if(checkbox_cliquee.checked)
        {
            status = true;
            var title = "décocher Tous";
        }

        checkbox_cliquee.title = title;
        $$('input:enabled[name="tab"]').each(function(item)
            {
                item.checked = status ;
            }
        );
    }
    // SI on clique sur une des checkbox associée
    else
    {
      if ($('check_uncheck_all') != null) {
          var flag = true;
          tabElts = $$('input[name="tab"]');
          for (i=0; i<tabElts.length; i++)
          {
              if (tabElts[i].checked != flag)
              {
                  $('check_uncheck_all').checked = false ;
                  $('check_uncheck_all').title = "Cocher Tous";
                  return;
              }
          }
          $('check_uncheck_all').title = "décocher Tous";
          $('check_uncheck_all').checked = true ;
      }
    }
}

function toutCocher(checkbox_cliquee) {
  checkbox_cliquee.checked = true;
  cocherDecocher(checkbox_cliquee);
}

/**
 * ---------------------------------------------------------------------------
 * verifForm : comme on le voit : NE SERT A RIEN MAIS : /!\ EST ENCORE APPELEE
 * PAR CERTAINES PAGES : DONC ATTENTION /!\
 * ---------------------------------------------------------------------------
 */
function verifForm(){
    return true;
}

//A quick test of the setGlobalVars method - remember, the "lang" attribute will NOT work when passed to this method
//datePickerController.setGlobalVars({"split":["-dd","-mm"]});


/*

        The following functions updates a span with an "English-ised" version of the
        currently selected date for the last datePicker on the page.

        NOTE: These functions are not needed, they are only present to show you how you
        might use callback functions to use the selected date in other ways!

*/
function createSpanElement(argObj) {
        // Make sure the span doesn't exist already
        if(document.getElementById("EnglishDate-" + argObj.id)) return;

        // create the span node dynamically...
        var spn = document.createElement('span');
            p   = document.getElementById(argObj.id).parentNode;

        spn.id = "EnglishDate-" + argObj.id;
        p.parentNode.appendChild(spn);

        // Remove the bottom margin on the input's wrapper paragraph
        p.style.marginBottom = "0";

        // Add a whitespace character to the span
        spn.appendChild(document.createTextNode(String.fromCharCode(160)));
};

/**
 * ---------------------------------------------------------------------------
 * insertCalendars : insère les images de calendriers à coté des champs
 * "input.date"
 * ---------------------------------------------------------------------------
 */
function insertCalendars(prefix)
{
    $$((prefix != null ? prefix : '' ) + 'input.date').each(function(item)
        {
            if (item.readOnly == false) {
                var id = item.id;

                var formElementsObj = { };
                formElementsObj[id] = "%d/%m/%Y";

                var opts = {

                        formElements:formElementsObj,
                        // The ID of the associated form element
                        id:item.id,
                        // The date format to use
                        format:"d-sl-m-sl-Y",
                        // Days to highlight (starts on Monday)
                        highlightDays:[0,0,0,0,0,1,1],
                        // Days of the week to disable (starts on Monday)
                        disabledDays:[0,0,0,0,0,0,0],
                        // Dates to disable (YYYYMMDD format, "*" wildcards excepted)
                        disabledDates:{},
                        // Date to always enable
                        enabledDates:{},
                        // Don't fade in the datepicker
                        // NOTE: Only relevant if "staticPos" is set to false
                        noFadeEffect:false,
                        // Is it inline or popup
                        staticPos:false,
                        // Do we hide the associated form element on create
                        hideInput:false,
                        // Do we hide the today button
                        noToday:true,
                        // Do we show weeks along the left hand side
                        showWeeks:true,
                        // Is it drag disabled
                        // NOTE: Only relevant if "staticPos" is set to false
                        dragDisabled:true,
                        // Positioned the datepicker within a wrapper div of your choice (requires the ID of the wrapper element)
                        // NOTE: Only relevant if "staticPos" is set to true
                        positioned:"",
                        // Do we fill the entire grid with dates
                        fillGrid:true,
                        // Do we constrain dates not within the current month so that they cannot be selected
                        constrainSelection:true,
                        // Do we show toDay
                        noToday:false,
                        // Callback Object
                        callbacks:{"create":[createSpanElement], "dateselect":[]},
                        // Do we create the button within a wrapper element of your choice (requires the ID of the wrapper element)
                        // NOTE: Only relevant if staticPos is set to false
                        buttonWrapper:"",
                        // Do we start the cursor on a specific date (YYYYMMDD format string)
                        cursorDate:""
                      };
                      datePickerController.createDatePicker(opts);
            }
        }
    );
    $$((prefix != null ? prefix : '' ) + 'a.date-picker').each(function(item) {
      item.update("Trouvé");
        var id = item.getAttribute("target-id");

        var formElementsObj = { };
        formElementsObj[id] = "%d/%m/%Y";

        var opts = {

                formElements:formElementsObj,
                // The ID of the associated form element
                id:item.id,
                // The date format to use
                format:"d-sl-m-sl-Y",
                // Days to highlight (starts on Monday)
                highlightDays:[0,0,0,0,0,1,1],
                // Days of the week to disable (starts on Monday)
                disabledDays:[0,0,0,0,0,0,0],
                // Dates to disable (YYYYMMDD format, "*" wildcards excepted)
                disabledDates:{},
                // Date to always enable
                enabledDates:{},
                // Don't fade in the datepicker
                // NOTE: Only relevant if "staticPos" is set to false
                noFadeEffect:false,
                // Is it inline or popup
                staticPos:false,
                // Do we hide the associated form element on create
                hideInput:false,
                // Do we hide the today button
                noToday:true,
                // Do we show weeks along the left hand side
                showWeeks:true,
                // Is it drag disabled
                // NOTE: Only relevant if "staticPos" is set to false
                dragDisabled:true,
                // Positioned the datepicker within a wrapper div of your choice (requires the ID of the wrapper element)
                // NOTE: Only relevant if "staticPos" is set to true
                positioned:"",
                // Do we fill the entire grid with dates
                fillGrid:true,
                // Do we constrain dates not within the current month so that they cannot be selected
                constrainSelection:true,
                // Do we show toDay
                noToday:false,
                // Callback Object
                callbacks:{"create":[createSpanElement], "dateselect":[]},
                // Do we create the button within a wrapper element of your choice (requires the ID of the wrapper element)
                // NOTE: Only relevant if staticPos is set to false
                buttonWrapper:"",
                // Do we start the cursor on a specific date (YYYYMMDD format string)
                cursorDate:""
              };
              datePickerController.createDatePicker(opts);
    });

}

/**
 * ---------------------------------------------------------------------------
 * chiffres : filtre les caractères possibles dans les champs montant (chiffre,
 * point, retour arrière)
 *
 * @param e :
 *            event envoyé via le keypress
 *            ---------------------------------------------------------------------------
 */
function filtreChiffresMontant(e)
{
    if (window.event) // IE
    {
        var keyNum = e.keyCode;
    }
    else if (e.which) // Netscape/Firefox/Opera
    {
        var keyNum = e.which;
    }
    if (typeof(keyNum) == 'undefined')
    {
        return true;
    }
    var detected = arguments.callee.keyCodes.find(function(keyCode)
    {
        return keyNum == keyCode;
    });
    if (!detected)
    {
        e.stop();
    }
}
/* Liste des touches autorisées dans les champs montant */
filtreChiffresMontant.keyCodes =
[
    Event.KEY_BACKSPACE,
    Event.KEY_TAB,
    Event.KEY_RETURN,
    Event.KEY_ESC,
    Event.KEY_LEFT,
    Event.KEY_UP,
    Event.KEY_RIGHT,
    Event.KEY_DOWN,
    Event.KEY_DELETE,
    Event.KEY_HOME,
    Event.KEY_END,
    Event.KEY_PAGEUP,
    Event.KEY_PAGEDOWN,
    Event.KEY_INSERT,
    '0'.charCodeAt(0),
    '1'.charCodeAt(0),
    '2'.charCodeAt(0),
    '3'.charCodeAt(0),
    '4'.charCodeAt(0),
    '5'.charCodeAt(0),
    '6'.charCodeAt(0),
    '7'.charCodeAt(0),
    '8'.charCodeAt(0),
    '9'.charCodeAt(0),
    '.'.charCodeAt(0)
];

/**
 * ---------------------------------------------------------------------------
 * remplaceVirguleMontants : remplace la virgule des champs de montant par un
 * point
 * ---------------------------------------------------------------------------
 */
function remplaceVirguleMontants()
{
    $$('input.montant').each(function(item)
        {
            remplaceVirgule(item); // Au cas où une virgule serait dans le
                                    // champ
            item.observe('keypress', filtreChiffresMontant);
        }
    );
}

/**
 * ---------------------------------------------------------------------------
 * remplaceVirgule : remplace la virgule par un point lors de la saisie de
 * nombre flottant
 *
 * @param element :
 *            élément dans lequel on effectue le remplacement
 *            ---------------------------------------------------------------------------
 */
function remplaceVirgule(element)
{
    element.value = element.value.replace(/,/g, '.');
}

/**
 * ---------------------------------------------------------------------------
 * remplacePoint : remplace le point par une virgule lors de la saisie de nombre
 * flottant
 *
 * @param element :
 *            élément dans lequel on effectue le remplacement
 *            ---------------------------------------------------------------------------
 */
function remplacePoint(element)
{
    element.value = element.value.replace(/./g, ',');
}

function saisieEntier() {
    $$('input.entier').each(function(item) {
      item.observe('keyup', function() {
          if (item.value != null && item.value != "") {
            var newValue = "";
            for (var i = 0; i < item.value.length; i ++) {
              if (regIsNumber(item.value.substring(i, i + 1))) {
                newValue = newValue + item.value.substring(i, i + 1);
              }
            }
            item.value = newValue;
          }
      });
    });
}

/**
 * ---------------------------------------------------------------------------
 * str_pad :
 *
 * @param string :
 * @param strlength :
 * @param string_pad :
 * @param pad_type :
 *            ---------------------------------------------------------------------------
 */
function str_pad(string, strlength, string_pad, pad_type)
{
    var t = String(string);
    diff = parseInt(strlength) - t.length;
    if(diff>0)
    {
        str = string_pad.times(diff);
        if(pad_type == "right")
        {
            return t+str;
        }
        else
        {
            return str+t;
        }
    }
    return string;
}

/**
 * ---------------------------------------------------------------------------
 * trim : fonction retirant les espaces de début et fin de chaine
 *
 * @param myString :
 *            une chaine de caractères
 *            ---------------------------------------------------------------------------
 */
function trim(myString)
{
    return myString.replace(/^\s+/g, '').replace(/\s+$/g, '');
}

/**
 * ---------------------------------------------------------------------------
 * showLigne : fonction
 *
 * @param element :
 *            ---------------------------------------------------------------------------
 */
function showLigne(element)
{
    element.ancestors()[1].show();
}

/**
 * ---------------------------------------------------------------------------
 * hideLigne : fonction
 *
 * @param element :
 *            ---------------------------------------------------------------------------
 */
function hideLigne(element)
{
    element.ancestors()[1].hide();
    element.value ="";
}

/**
 * Création de la pagination du footer du displayTable
 */
function customPagingDisplayTag()
{
  replaceDisplayTagExportLinks();
  replaceDisplayTagTotalElements();

    if($('pagination') != null && $('export') != null) {

        var pagination  = "<div class='pagelinks'>" + $('pagination').innerHTML + "</div>";
        new Insertion.Before('export', pagination);
    }
}

function replaceDisplayTagExportLinks() {
  $$('div[class~="export-table"]').each(function(element, index) {
    $$("div.table-export-place").each(function(place, indexPlace) {
      if (indexPlace == ( (index + 1) * 2 - 2) || indexPlace == ((index + 1) * 2 - 1)) {
        place.update(element.innerHTML);
        if (indexPlace == ((index + 1) * 2 - 1)) {
          element.remove();
        }
      }
    });
  });
}

function replaceDisplayTagTotalElements() {
  $$('div[class~="pagebanner"]').each(function(element, index) {
    $$("div.table-size-place").each(function(place, indexPlace) {
      if (indexPlace == index) {
        place.update(element.outerHTML);
        element.remove();
      }
    });
  });
}

/**
 * Retourne true si la valeur est un entier
 * @param fData
 * @returns {Boolean}
 */
function regIsNumber(pData)
{
    var isInteger_re     = /^\s*(\+|-)?\d+\s*$/;
    return String(pData).search (isInteger_re) != -1;
}


/**
 *
 * @param pGroupeNumber
 */
function openCloseGrp(pGroupeNumber) {
    // lien qui permet de plier ou déplier le groupe
    var link = $('grp' + pGroupeNumber);

    var show = false;
    if (link.hasClassName('down')) {
        show = false;
        link.removeClassName('down');
        link.addClassName('up');
    } else {
        show = true;
        link.removeClassName('up');
        link.addClassName('down');
    }

    // boucle sur les lignes du groupe
    $$('tr[class~="grp' + pGroupeNumber + '"]').each(function(pItem) {
        if (show) {
            pItem.show();
            var subItem = pItem.select('a[class~="up"]').first();
            if (subItem) {
                subItem.removeClassName('up');
                subItem.addClassName('down');
            }
        } else {
            pItem.hide();
        }
    });

}

/**
 * Ouverture d'une modal contenant le détail de la transaction.
 *
 * @param pElement Element ayant déclenche l'ouverture de la modal
 * @param pId Id de la transaction
 * @param pId Id Paybox
 */
function paiementEnLigneTransactionModal(pElement, pId, pNumeroEcheance ,pDataUpdate) {
    if ($("refreshPage") != null) {
      $("idTransactionModal").value = pId;
    }
    var url = "paiementEnLigneTransactionModal.do?method=read&id=" + pId + "&numeroEcheance=" + pNumeroEcheance;

    // on retire la marque sur l'élément précédement ouvert
    $$('a[class~="paiementEnLigneTransactionModalCurrent"]').each(function(pItem) {
        pItem.removeClassName('paiementEnLigneTransactionModalCurrent');
    });

    // on marque le lien de sorte à pouvoir retrouver l'élément ouvert
    pElement.addClassName("paiementEnLigneTransactionModalCurrent");

    var opts = {
        parent: $("fft-main"),
        width: "1150px",
            okLabel: "Fermer",
            ok:function(win) {
                if (pDataUpdate) {
                    alert("Les données ont pû être modifiées (suite à un remboursement ou une annulation). Vous devriez rafraichir la page.");
                }
                return true;
            }
        };

    openAjaxModal(pElement, url, opts);

}

function paiementEnLigneConsulter(pId,boutonConsulter) {
    boutonConsulter.disable();
    PaiementEnLigneService.consulter(pId, function(pData) {
        if ($("refreshPage") != null) {
          $("idTransactionModal").value = pId;
         }
        // on récupère l'élément ouvert pour le recharger
        FFTDialog.closeAll();
        $$('a[class~="paiementEnLigneTransactionModalCurrent"]').each(function(pItem) {
            paiementEnLigneTransactionModal(pItem, pId);
            return;
        });
    });
}
function paiementEnLigneBackOffice() {
  location.reload(true);
  return ;
}

function paiementEnLigneAnnuler(pId, boutonAnnuler) {
    html = "Attention, vous vous apprêtez à annuler la transaction.";

  FFTDialog.confirm(
    html,
    {
      zIndex:1001,
      width: 400,
      okStyleClass: "btn",
      okLabel: "OK",
      cancelLabel: "Annuler",
      onOk:function(win) {
        boutonAnnuler.disable();
          PaiementEnLigneService.annuler(pId, function(pData) {
              if ($("refreshPage") != null) {
                $("idTransactionModal").value = pId;
              }
              // on récupère l'élément ouvert pour le recharger
              FFTDialog.closeAll();
              $$('a[class~="paiementEnLigneTransactionModalCurrent"]').each(function(pItem) {
                  paiementEnLigneTransactionModal(pItem, pId, true);
                  return;
              });

          });
      },
      onCancel:function(win) {
        Windows.closeAll();
      }
    }
  );
}


function paiementEnLigneResilier(pId, pReference, boutonAnnuler) {
    if (!confirm("Attention, vous vous apprêtez à résiliser les échéances à venir.")) {
        return false;
    }
    boutonAnnuler.disable();
    PaiementEnLigneService.resilier(pReference, function(pData) {
        if ($("refreshPage") != null) {
          $("idTransactionModal").value = pId;
        }
        // on récupère l'élément ouvert pour le recharger
        FFTDialog.closeAll();
        $$('a[class~="paiementEnLigneTransactionModalCurrent"]').each(function(pItem) {
            paiementEnLigneTransactionModal(pItem, pId, true);
            return;
        });

    });
}


function paiementEnLigneRembourser(pId, boutonRembourser) {
    var montant = trim($('montantRemboursement').value);
    if (!regIsNumber(montant)) {
      var html = "Le montant indiqué ' " + montant + " ' ne correspond pas à un montant valide (en centimes)<br><br>";

      FFTDialog.confirm(
      html,
      {
        zIndex:1001,
        width: 600,
        cancelStyleClass: "btn",
        cancelLabel: "OK",
        onCancel:function(win) {
          Windows.close();
          return false;
        }
      }
    );
    } else {
      var html = "Vous vous apprêtez à rembourser " + montant + " centimes";

      FFTDialog.confirm(
      html,
      {
        zIndex:1001,
        width: 400,
        okStyleClass: "btn",
        okLabel: "OK",
        cancelLabel: "Annuler",
        onOk:function(win) {
          boutonRembourser.disable();

            PaiementEnLigneService.rembourser(pId, montant, function(pData) {
              if ($("refreshPage") != null) {
                $("idTransactionModal").value = pId;
              }
              // on récupère l'élément ouvert pour le recharger
              FFTDialog.closeAll();
              $$('a[class~="paiementEnLigneTransactionModalCurrent"]').each(function(pItem) {
                paiementEnLigneTransactionModal(pItem, pId, true);
                return;
              });

            });
        },
        onCancel:function(win) {
          Windows.closeAll();
          return false;
        }
      }
      );
    }
}

/**
 * Remplace toutes les occurences dans une chaine de caract?res.
 *
 * @param pString Chaine
 * @param pFind Occurences à remplacer
 * @param pReplace Remplacer par
 * @returns Chaine
 */
function replaceAll(pString, pFind, pReplace) {
    return pString.replace(new RegExp(pFind, 'g'), pReplace);
}

/**
 * Format un chiffre.
 *
 * @param pNumber Chiffre
 * @param pPrecison Pr?cision
 * @returns Chiffre formatt?
 */
function formatNumber(pNumber, pPrecison) {
    var n = Number(pNumber);

    if (n == null || isNaN(n)) {
        n = Number(0);
    }

    return n.toFixed(pPrecison);
}

/**
 * Format un chiffre (avec séparateur ",").
 *
 * @param pNumber Chiffre
 * @param pPrecison Précision
 * @returns Chiffre formatté
 */
function formatNumberToString(pNumber, pPrecison) {
    var number = formatNumber(pNumber, pPrecison);
    var retVal = "";

    if (number != null) {
        retVal = number.toString();
        retVal = retVal.replace(".", ",");
    }

    return retVal;
}

/**
 * Format un chiffre en monnaie (avec séparateur "," et symbole euro).
 *
 * @param pNumber Chiffre
 * @param pPrecison Précision
 * @returns Chiffre formatté
 */
function formatNumberToMoney(pNumber, pPrecison) {
    return formatNumberToString(pNumber, pPrecison) + " &#8364;";
}


function dispatch(pForm, pDispatch) {
    pForm.elements["method"].value = pDispatch;
    pForm.submit();
    return false;
}

function submitDefault(pForm) {
    pForm.submit();
    return false;
}

//fonction qui retourne false si aucune case n'a été cochée
function checkCheckBoxes(pField) {
    if (pField) {
        if (pField.length) {
            for (var i = 0 ; i < pField.length ; i++) {
                if (pField[i].checked) {
                    return true;
                }
            }
        } else {
            return pField.checked;
        }
    } else {
        return false;
    }
}

//fonction qui retourne le nombre de checkbox cochées
function nbCheckBoxesChecked(pField) {
    var nb = 0;

    if (pField) {
        if (pField.length) {
            for (var i = 0 ; i < pField.length ; i++) {
                if (pField[i].checked) {
                    nb = nb + 1;
                }
            }
        } else {
            if (pField.checked) {
                nb = nb + 1;
            }
        }
    }

    return nb;
}

//fonction qui retourne le nombre de checkbox cochées
function hasCheckBoxesCheckedWithFilterValue(pField, pDataName, pDataValue) {
  if (pField) {
      if (pField.length) {
          for (var i = 0 ; i < pField.length ; i++) {
              if (pField[i].checked && pField[i].getAttribute(pDataName) == pDataValue) {
                  return true;
              }
          }
      } else {
          if (pField.checked && pField.getAttribute(pDataName) == pDataValue) {
            return true;
          }
      }
  }

  return false;
}

// remplacer le selector de l'autocomplete (dwr retourne déjà la liste filtrée, il suffit alors d'en afficher le résultat, aucun filtre supplémentaire n'est nécessaire)
function dwrAutocompleteSelector(autocompleteInstance) {
    var ret       = []; // Beginning matches
    var entry     = autocompleteInstance.getToken();
    var valueSelector = autocompleteInstance.options.valueSelector;

    for (var i = 0; i < autocompleteInstance.options.array.length && ret.length < autocompleteInstance.options.choices ; i++) {
        var elem = valueSelector(autocompleteInstance.options.array[i]);
        ret.push("<li><strong>" + elem.substr(0, entry.length) + "</strong>" + elem.substr(entry.length) + "</li>");
    }

    return "<ul>" + ret.join('') + "</ul>";
}


function reservationSurchargeable(pForm, pSurchargeable) {
    if (pSurchargeable.checked == true) {
        $('conditionDispoLine').show();
    } else {
        $('conditionDispoLine').hide();
    }
}



function setDefaultOptionIfExists(pSelectId, pData, pValue) {
    for ( var i = 0; i < pData.length; i++) {
        if (pValue == pData.key) {
            $(pSelectId).value = pValue;
            break;
        }
    }
}

function getDate(formatDate) {
    var date = null;
    if (formatDate != "") {
        date = moment(formatDate, 'DD/MM/YYYY', true);
    }
    return date;
}

function getValidDate(formatDate) {
    var date = getDate(formatDate);
    if (date == "Invalid date") {
        date = null;
    }
    return date;
}

function getMessageSize(editor) {
  var size = 0;
  var data = editor.getData();
  if (data != null) {
    size += data.length;
  }
  return size;
}

function checkMessageSize(editor, maxSize) {
  if (getMessageSize(editor) > maxSize) {
    alert("La taille du message ne peut pas dépasser 1600 caractères (dans la source)");
    return false;
  } else {
    return true;
  }
}

function computeChars(editor, maxSize, freeCharsId) {
  var freeChars = maxSize - getMessageSize(editor, maxSize);
  $(freeCharsId).update(freeChars);
  if (freeChars <= 0) {
    $(freeCharsId).addClassName('alert');
  } else {
    $(freeCharsId).removeClassName('alert');
  }
}

function buildToolTipMrt(period, parametrage) {
  var html = "<div class='timelineTooltip'>";
  html += "<center>Occurence du <u>" + period.occurFrom + "</u>";
  if (period.occurFrom != period.occurTo) {
    html += " au <u>" + period.occurTo + "</u>";
  }
  html += "</center><hr/>";
  html += "<ul>";
  html += "<li>Du <b>" + parametrage.dateDebut + "</b> au <b>" + parametrage.dateFin + "</b></li>";
  html += "<li>" + parametrage.courtsLabel + "</li>";
  html += "<li>" + parametrage.jours + "</li>";
  html += "<li>De <b>" + parametrage.heureDebut + "</b> &agrave; <b>" + parametrage.heureFin + "</b></li>";
  html += "<li>Pour <b>" + parametrage.prix + "&euro;</b></li>";
  if (parametrage.delaiDispoInHours != null && parametrage.delaiDispoInHours != "") {
    html += "<li>Réservation dynamique (délai de " + parametrage.delaiDispoInHours + ")</li>";
  }
  html += "</ul></div>";

  return html;
}


function doReservation(form, params) {
  window.location.href = form.action + '' + params;
  return false;
}




function parseBoolean(value) {
  if (value === true || value === false) {
    return value;
  } else if ("true" == value) {
    return true;
  } else if ("false" == value) {
    return false;
  } else {
    return null;
  }
}

function enableRadio(element) {
  element.enable();
  if (element.next("label") != null) { element.next("label").removeClassName("disabled"); }
}

function disableRadio(element) {
  element.disable();
  if (element.next("label") != null) { element.next("label").addClassName("disabled"); }
}


function getURLParameter(param) {
    var pageURL = window.location.search.substring(1);
    var URLVariables = pageURL.split('&');
    for (var i = 0; i < URLVariables.length; i++) {
        var parameterName = URLVariables[i].split('=');
        if (parameterName[0] == param) {
          return parameterName[1];
        }
    }
    return "";
}

function getBaseUrlFromHref(href) {
    var pos = href.indexOf("?");
    if (pos > 0) {
      return href.substring(0, pos);
    }
    return href;
}

function getQueryStringFromHref(href) {
    var pos = href.indexOf("?");
    if (pos > 0) {
      return href.substring(pos + 1);
    }
    return null;
}

function selectUnselectRadio(element, selectedSelector, emptySelector) {
  if ($(selectedSelector).value == element.value) {
    $(emptySelector).click();
    $(selectedSelector).value = '';
  } else {
    $(selectedSelector).value = element.value;
  }
}



