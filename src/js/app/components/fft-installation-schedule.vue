<template>
    <div class="schedule-modal">
        <div class="item">
            <label>HORAIRES D’OUVERTURE</label>
            <div class="item-div">
                <table class="table fft-form-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>LUNDI</th>
                            <th>MARDI</th>
                            <th>MERCREDI</th>
                            <th>JEUDI</th>
                            <th>VENDREDI</th>
                            <th>SAMEDI</th>
                            <th>DIMANCHE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(items, index) in scheduleJson" v-bind:id="index + '-row'" :key="index">
                            <td>
                                <p class="title mb-10">{{ index === 'clubhouse' ? 'club house' : index }}</p>
                                <p>
                                    <a class="btn2" href="#" data-toggle="modal" @click="showModal(index)">Ajouter un horaire</a>
                                </p>
                            </td>
                            <td v-for="(data, dayName) in items" :key="dayName">
                                <h4 v-for="item in data" class="horai-text">
                                    {{ item.debut }} - {{ item.fin }}
                                    <a @click="deleteSchedule(index, dayName, item)" class="horai-ferme pointer" style="padding: 0 !important; margin: 0 0px 0 2px;"><span class="icon-active icon-poubelle"></span></a>
                                </h4>
                                <h4 v-if="data.length === 0" class="horai-text">Ferm&eacute;</h4>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div id="modify" class="fft-modal">
            <div class="dialog__mask" id="dialog" @click="closeDialog()">
                <div class="container-fluid dialog__container">
                    <a class="dialog__close" @click="closeDialog()">
                        <i class="icon-cancel">
                            <span class="hidden">Close</span></i>
                        </a>
                    <div class="dialog__body">
                        <div class="fft-main-content page-installations-modify-modal">
                            <form name="installationDialogForm" id="installationDialogForm" method="post" action="" class="fft-form">
                                <fieldset class="p-0">
                                    <legend>Ajouter des horaires</legend>
                                    <div class="row mt-16">
                                        <div class="col-md-4 pr-68">
                                            <div>
                                                <div class="item">
                                                    <label>CHOISIR LES HORAIRES</label>
                                                    <div class="item-div">
                                                        <div class="row mt-27">
                                                            <label class="col-xs-6 req">D&eacute;but</label>
                                                            <label class="col-xs-6 p-0 req">Fin</label>
                                                        </div>
                                                        <p class="fft-form-line fft-form-line-range mt-5" v-for="(hor, idx) in horaires" v-if="hor">
                                                            <select name="civilite" v-model="hor.debut" @change="updateHoraires(hor)">
                                                                <option :value="undefined" selected></option>
                                                                <option v-for="item in hours" :value="item">{{ item }}</option>
                                                            </select>
                                                            <span>à</span>
                                                            <select name="civilite" v-model="hor.fin" :disabled="!hor.debut">
                                                                <option v-for="item in hours" :value="item" v-if="hourToInt(item) > hourToInt(hor.debut)">{{item }}</option>
                                                                <option v-for="item in hours" :value="item" v-if="hourToInt(item) < hourToInt(hor.debut)">{{item }}</option>
                                                            </select>
                                                            <a :class="{ 'not-visible': idx === 0}" @click="deleteHour(idx, item)" class="horai-ferme pointer" style="padding: 0 !important; margin-top: -10px;"><span class="icon-active icon-poubelle"></span></a>
                                                        </p>
                                                    </div>
                                                    <p class="mt-32">
                                                        <button type="button" class="btn2 icon-bigplus" @click="addHours()" v-if="horaires.length < 3">
                                                            Ajouter un cr&eacute;neau horaire ({{ 3 - horaires.length }})
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-8 pl-20">
                                            <div>
                                                <div class="item">
                                                    <label>CHOISIR LES JOURS CONCERN&Eacute;S</label>
                                                    <div class="item-div">
                                                        <table class="table fft-form-table fft-noheader-table mt-12 fft-form-table-checkbox"  id="fft-form-table-checkbox" style="width:100%">
                                                            <thead>
                                                                <tr>
                                                                    <th>LUNDI</th>
                                                                    <th>MARDI</th>
                                                                    <th>MERCREDI</th>
                                                                    <th>JEUDI</th>
                                                                    <th>VENDREDI</th>
                                                                    <th>SAMEDI</th>
                                                                    <th>DIMANCHE</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <input type="checkbox" class="check-1" id="lundi" />
                                                                        <label for="lundi" title="selectionner tout"></label>
                                                                    </td>
                                                                    <td>
                                                                        <input type="checkbox" class="check-1" id="mardi" />
                                                                        <label for="mardi" title="selectionner tout"></label>
                                                                    </td>
                                                                    <td>
                                                                        <input type="checkbox" class="check-1" id="mercredi" />
                                                                        <label for="mercredi" title="selectionner tout"></label>
                                                                    </td>
                                                                    <td>
                                                                        <input type="checkbox" class="check-1" id="jeudi" />
                                                                        <label for="jeudi" title="selectionner tout"></label>
                                                                    </td>
                                                                    <td>
                                                                        <input type="checkbox" class="check-1" id="vendredi" />
                                                                        <label for="vendredi" title="selectionner tout"></label>
                                                                    </td>
                                                                    <td>
                                                                        <input type="checkbox" class="check-1" id="samedi" />
                                                                        <label for="samedi" title="selectionner tout"></label>
                                                                    </td>
                                                                    <td>
                                                                        <input type="checkbox" class="check-1" id="dimanche" />
                                                                        <label for="dimanche" title="selectionner tout"></label>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <div class="fft-line-separate m-0 mb-16">
                                    <div class="fft-line-separate-left p-0 mt-15">
                                        <button type="button" class="btn2 ml-0" @click.prevent="closeDialog()">Fermer</button>
                                    </div>
                                    <div class="fft-line-separate-right p-0 mt-15">
                                        <button type="button" class="btn icon-tick mr-0" @click="addSchedule()">Enregistrer</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    model: {
        prop: 'scheduleJson',
        event: 'input'
    },
    props: {
        'scheduleJson': Object,
        'forceRefresh': Boolean
    },
    data() {
        return {
            modalVal: '',
            horaires: [],
            hours: ['00h00', '00h30', '01h00', '01h30', '02h00', '02h30', '03h00', '03h30', '04h00', '04h30', '05h00', '05h30', '06h00', '06h30', '07h00', '07h30', '08h00', '08h30', '09h00', '09h30', '10h00', '10h30', '11h00', '11h30', '12h00', '12h30', '13h00', '13h30', '14h00', '14h30', '15h00', '15h30', '16h00', '16h30', '17h00', '17h30', '18h00', '18h30', '19h00', '19h30', '20h00', '20h30', '21h00', '21h30', '22h00', '22h30', '23h00', '23h30'],
            days: ["lundi",
                "mardi",
                "mercredi",
                "jeudi",
                "vendredi",
                "samedi",
                "dimanche",
            ]

        }
    },
    methods: {
        getData() {
            var jsonData = this.value;

            if (!jsonData) {
                try {
                    if (document.getElementById('scheduleString')) {
                        jsonData = JSON.parse(document.getElementById('scheduleString').value);
                    }
                } catch (e) {
                    console.warn("Could not parse the content of the schedule string");
                }

            }
            console.log(jsonData);
            // add missing days to json
            for (var item in jsonData) {
                var data = jsonData[item];
                for (var i = 0; i < this.days.length; i++) {
                    if (!data[this.days[i]]) {
                        data[this.days[i]] = [];
                    }
                }
            }
            this.scheduleJson = jsonData;

        },

        addSchedule() {
            var self = this;
            var hasConflict = false;
            var hasMissingDate = false;
            var totalSegments = 0;
            const copy = Object.assign({}, self.scheduleJson[self.modalVal]);
            jQuery('#modify :checkbox').each(function (i) {
                if (hasConflict) {
                    return;
                }
                const $checkbox = jQuery(this);
                var dayName = $checkbox.attr('id');

                if ($checkbox.is(':checked')) {
                    self.horaires.forEach(h => {
                        const set = {
                            "jour": dayName,
                            "debut": h.debut,
                            "fin": h.fin
                        };
                        if (!self.scheduleJson[self.modalVal][dayName]) {
                            self.scheduleJson[self.modalVal][dayName] = [];
                        }
                        if (!h.debut || !h.fin) {
                            hasMissingDate = true;
                            return;
                        }

                        const intersections = self.scheduleJson[self.modalVal][dayName]
                            .filter(h => self.intersects(set, h) && !self.contains(set, h));
                        if (intersections.length > 0) {
                            const intersectionsString = intersections.map((i) => {
                                return `${i.jour}: ${i.debut} - ${i.fin}`;
                            }).join('<br/>')
                            FFTDialog2.alert(`<h3>La plage horaire poss&egrave;de une intersection avec une plage horaire</h3><br/>${intersectionsString}`);
                            hasConflict = true;
                            return;
                        }
                        self.scheduleJson[self.modalVal][dayName] =
                            self.scheduleJson[self.modalVal][dayName].filter(h => !self.contains(set, h));
                        self.scheduleJson[self.modalVal][dayName].push(set);
                    })
                    totalSegments += self.scheduleJson[self.modalVal][dayName].length;
                    self.scheduleJson[self.modalVal][dayName] =
                        self.scheduleJson[self.modalVal][dayName].sort((a, b) => {
                            return self.hourToInt(a.debut) >= self.hourToInt(b.debut) ? 1 : -1;
                        });
                }
            }); // end jquery each

            if (hasConflict) {
                self.scheduleJson[self.modalVal] = copy
                return;
            }

            if (hasMissingDate) {
                FFTDialog2.alert(`<h3>Attention, une des plages horaires n'est pas complète</h3><br/>`);
                return
            }

            if (totalSegments < 1) {
                FFTDialog2.alert(`<h3>Attention, Vous n'avez pas sélectionné de jour</h3><br/>`);
                return;
            }

            console.log('i emit');
            this.$emit('input', self.scheduleJson);
            this.$emit('change', self.scheduleJson);
            this.closeDialog();
        },

        addHours() {
            this.horaires.push({ id: 'new', debut: "", fin: "" })
        },

        deleteHour(i) {
            this.horaires.splice(i, 1);
        },

        contains(a, b) {
            return this.hourToInt(a.debut) <= this.hourToInt(b.debut) && this.hourToInt(a.fin) >= this.hourToInt(b.fin)
        },

        intersects(a, b) {
            return !(this.hourToInt(a.debut) >= this.hourToInt(b.fin) || this.hourToInt(a.fin) <= this.hourToInt(b.debut))
        },

        deleteSchedule(index, dayName, item) {
            this.scheduleJson[index][dayName] = this.scheduleJson[index][dayName].filter(i => {
                return !(i.debut === item.debut && i.fin === item.fin)
            })
            this.$emit('input', this.scheduleJson);
            this.$emit('change', this.scheduleJson);
        },

        showModal(index) {
            jQuery('#modify :checkbox:checked').each(function (i) {
                jQuery(this).prop('checked', false);
            });
            this.modalVal = index;
            this.horaires = [];
            this.addHours()
            var $html = jQuery('html');
            console.log("hoaraies");
            jQuery('#modify .dialog__mask').addClass('dialog__mask--is-visible');
            $html.css('overflow-y', 'hidden');
        },

        closeDialog() {
            var $html = jQuery('html');
            $html.css('overflow-y', 'unset');
            jQuery('#modify .dialog__mask').removeClass('dialog__mask--is-visible');
        },

        updateHoraires(horaire) {
            console.log(horaire);
            const nextTime = this.hours.find(h => this.hourToInt(h) > this.hourToInt(horaire.debut));
            if (!horaire) {
                return
            }
            if (horaire.debut === '23h30') {
                horaire.fin = '00h00';
            } else if (nextTime) {
                horaire.fin = nextTime;
            }
        },
        hourToInt(hour) {
            return parseInt(hour.replace('h', ''))
        }

    },
    watch: {
        'value': function () {
            console.log("update");
            this.scheduleJson = this.value;
            this.$forceUpdate();
        }
    },
    mounted() {
        this.getData();
        jQuery('#modify .dialog__mask').click(function (e) {
            var $html = jQuery('html');
            $html.css('overflow-y', 'unset');
            jQuery('#modify .dialog__mask').removeClass('dialog__mask--is-visible');
        }).children().click(function (e) {
            e.stopPropagation();
        });
    },
}
</script>
<style lang="scss" scoped>
#fft-main table.table tbody tr td {
    width: 108px;
}

#fft-main table.table tbody tr:hover td:first-of-type {
    border-left: 1px solid #06AED3 !important;
}

.horai-text {
    color: #4E4E4E;
    font-size: 12px;
    line-height: 14px;
    font-weight: normal;
}

.not-visible {
    visibility: hidden;
    opacity: 0;
}

.schedule-modal #modify .dialog__container {
    background-color: #f2f2f2 !important;

    #fft-main {
        min-height: unset !important;

        .page-installations-modify-modal {
            fieldset {
                border-bottom: transparent !important;
            }

            .item {
                margin-top: 16px;

                label {
                    font-size: 12px;
                    font-weight: bold;
                    color: #9b9b9b !important;
                }

                .item-div {
                    border-top: 1px solid #033c69;
                    margin-top: 7px;

                    table.fft-noheader-table {
                        width: 100%;

                        th {
                            text-align: center !important;
                            background-color: transparent !important;
                            color: #9b9b9b !important;
                        }

                        tbody {
                            tr {
                                td {
                                    text-align: center;
                                    padding: 12px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
