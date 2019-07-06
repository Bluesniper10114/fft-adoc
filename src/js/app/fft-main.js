import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios'
import draggable from 'vuedraggable'
import { fft_helpers } from './mixins/fft_helpers'
import FftFormules from './components/fft-formules.vue';

Vue.use(Vuex);

var store = new Vuex.Store({
  state: {
    date: new Date(),
    appView: {
    },
    popup: {
      type: 'none',
      id: null,
    },
  },
  mutations: {
    changeDate: function (value) {
      state.dateFilter = value;
    },
    setPopup: function (state, [popupType, elementId]) {
      state.popup.type = popupType;
      if (elementId) { state.popup.id = elementId };
    },
    setImage: function (state, data) {
      state.cropImgSrc = data;
    }
  },
  actions: {

  }
});

// Vue.config.productionTip = !(process.env.NODE_ENV === 'production');
Vue.config.productionTip = true;

var fft_parametrage_formules = new Vue({
  el: "#vueAppContainer",
  mixins: [fft_helpers],
  props: {},
  store,
  data: {
    forceRefresh: false,
    scheduleString: undefined,
    scheduleJson: {},
    clubhouseNoCheckbox: undefined,
    barNoCheckbox: undefined,
    restaurantNoCheckbox: undefined,
    openImagePicker: false,
    favorisOnly: false,
  },
  watch: {
    scheduleJson: function (receivedJson) {
      this.scheduleJson = receivedJson;
      this.serializeSchedule(this.scheduleJson);
      this.$forceUpdate();
    }
  },
  mounted() {
  },
  methods: {
    serializeSchedule(scheduleJson) {
      if (document.getElementById('scheduleString')) {
        document.getElementById('scheduleString').value = JSON.stringify(scheduleJson);
      }
      this.$forceUpdate();
    },
    checkboxYesChanged(event, itemKey) {
      if (!this.scheduleJson) {
        this.scheduleJson = {};
      }
      if (!this.scheduleJson[itemKey]) {
        this.$set(this.scheduleJson, itemKey, {
          "lundi": [],
          "mardi": [],
          "mercredi": [],
          "jeudi": [],
          "vendredi": [],
          "samedi": [],
          "dimanche": [],
        });
      }
    },
    checkboxNoChanged(event, itemKey) {
      const self = this;
      event.preventDefault();
      event.stopPropagation();
      if (event.target && event.target.checked) {
        if (this.hasHoraires(itemKey)) {
          FFTDialog2.confirm('<h3>Attention les horaires d\'ouverture du ' + (itemKey == "clubhouse" ?  "club house" : itemKey)
                           + ' vont être supprim&eacute;es</h3>', {
                            okLabel: 'Confirmer',
                            okStyleClass: 'btn',
                            onOk: function (a) {
                              event.target.checked = true;
                              // yesCheckbox.checked = false;
                              const sup_club = jQuery('.sup-club , .clubhouse-visible');
                              for (let el of sup_club) {
                                el.style.display = 'none';
                              }
                              self.$delete(self.scheduleJson, itemKey, undefined);
                            }
                          });
        } else {
              self.$nextTick(jQuery.proxy(function () {
                  event.target.checked = true;
                  self.$delete(self.scheduleJson, itemKey, undefined);
              }, self));
        }
      }
      return false;
    },
    hasHoraires(itemKey) {
      var hasHoraires = false;
      if (this.scheduleJson[itemKey]
        && (this.scheduleJson[itemKey].lundi.length > 0
            || this.scheduleJson[itemKey].mardi.length > 0
            || this.scheduleJson[itemKey].mercredi.length > 0
            || this.scheduleJson[itemKey].jeudi.length > 0
            || this.scheduleJson[itemKey].vendredi.length > 0
            || this.scheduleJson[itemKey].samedi.length > 0
            || this.scheduleJson[itemKey].dimanche.length > 0)) {
        hasHoraires = true;
      }
      return hasHoraires;
    },
    openImageModal() {
      this.openImagePicker = Date.now();
    },
    clearImage() {
      console.log("clear image function called", this.$store);
      this.$store.commit('setImage', null);
    }
  },
  computed: {
    popup() {
      return this.$store.state.popup;
    },

    view() {
      return this.$store.state.appView;
    },
  },
  components: {
    'fft-formules': FftFormules,
  },
});
