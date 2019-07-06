<template>
    <div class="content mt-16">
        <div class="content-left mr-8">
            <table class="table">
                <thead>
                    <tr>
                        <th></th>
                        <th class="sortable">
                            <a href="#">Intitulé</a>
                        </th>
                        <th class="sortable">
                            <a href="#">S-type</a>
                        </th>
                        <th class="sortable">
                            <a href="#">Tarif</a>
                        </th>
                        <th class="sortable">
                            <a href="#">
                                <span class="icon-see icon-disabled"></span>
                            </a>
                        </th>
                    </tr>
                </thead>
                <draggable :element="'tbody'" v-model="formulesData" :options="{sort: false, group:{ name:'formules', ghostClass: 'ghost', put:false }}" @end="onEnd">
                    <tr v-for="(item, index) in formulesData" :key="index" class="odd pointer">
                        <td>
                            <a :href="'/adoc/formuleAcces.do?method=read&identifiantFormule=' + item.identifiant">
                                <span class="icon-editer icon-active"></span>
                            </a>
                        </td>
                        <td>{{ item.intitule }}</td>
                        <td>{{ item.sousType }}</td>
                        <td class="tarif">{{ item.millesimeVente }}</td>
                        <td v-if="item.icon === 1"><span class="icon-user icon-disabled"></span></td>
                        <td v-else-if="item.icon === 2"><span class="icon-user icon-disabled"></span><span class="icon-user icon-disabled"></span></td>
                        <td v-else></td>
                    </tr>
                </draggable>
            </table>
        </div>
        <div class="content-right ml-8">
            <ul id="fft-tabs">
                <li class="tablinks"  @click="loadMetaOffres(category.mId )"
                v-for="category in categories"
                :class="{current: category.mId === idCategorie}"
               v-bind:style="{'background': category.mId === idCategorie ? '#' + category.mCodeCouleur : ''}"
                >
                    <a href="#" tab-content="initier">{{ category.mLibelle }}</a>
                </li>

              <li class="tablinks"  :class="{current: idCategorie === 'ALL'}"
               @click="loadMetaOffres('ALL')"><a href="#" tab-content="toutes">Toutes</a>
           </li>
            </ul>
            <div class="tab-out-content">
                <div id="initier" class="fft-tab-content active">
                    <div class="item" v-for="offer in offersData" :key="offer.idMetaOffre">
                        <div class="header">
                            <h4 class="title">{{ offer.libelle }}</h4>
                            <h5 class="data">A partir du {{ formatDate(offer.debutValidite) }}</h5>
                        </div>
                        <div class="body">
                            <p>{{ offer.descriptionClub }}</p>
                        </div>
                        <div class="footer" v-if="offer && offer.formules">
                            <draggable v-if="offer.formules.length === 0 && offer.nbRattachementsEnAttente === 0 &&
                            offer.nbRattachementsValides === 0
                            " class="drag-section" v-model="offer.formules" :options="{sort: false, group:{ name:'formules' }}"  @end="onEnd"  @move="onEnd">
                                Faites glisser ici les formules concernées par cette offre
                            </draggable>
                            <draggable v-if="offer.formules.length > 0
                            || offer.nbRattachementsEnAttente > 0
                            || offer.nbRattachementsValides > 0
                            " v-model="offer.formules" :options="{sort: false, ghostClass: 'ghost', group: 'formules'}"  @end="onEnd($event, offer)"
                            >
                            <div class="action" @click="showDetail($event, offer)">
                                <h5 class="info" v-if="offer.nbRattachementsValides > 0" >{{ offer.nbRattachementsValides }} {{ offer.nbRattachementsValides == 1 ? 'formule' : 'formules' }}</h5>
                                <h5 class="info warning" v-if="offer.nbRattachementsEnAttente > 0">{{ offer.nbRattachementsEnAttente }} en attente</h5>

                                <span class="icon-down icon-active"></span>
                            </div>
                            <div class="action-content">
                                <div class="action-item" v-for="(formule, index) in offer.formules">
                                    <span>{{ formule.intitule }}</span>
                                    <div class="action-tool">
                                        <h5 v-if="formule.pendingValidation" class="detail warning mr-8">En attente de validation</h5>
                                        <span v-if="formule.pendingValidation" class="icon-warning icon-active mr-8"></span>
                                        <a @click="deleteFormules(offer, formule, index)"><span class="icon-poubelle icon-active mr-8" data-tooltip="Détacher la formule"></span></a>
                                    </div>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
            </div>
            <div id="progresser" class="fft-tab-content">
                <div class="item">
                    <div class="header">
                        <h4 class="title">TEN’UP Access</h4>
                        <h5 class="data">A partir du 12/02/2018</h5>
                    </div>
                    <div class="body">
                        <p>TEN’UP ACCESS regroupe l’ensemble des formules de cotisation individuelle, sans enseignement : cotisation adultes, cotisation étudiants, cotisation jeunes, cotisation demandeur d'emploi, formule trimestrielle ou semestrielle de location horaire,…</p>
                    </div>
                    <div class="footer">

                        <draggable v-model="progresser" :options="{sort: false, ghostClass: 'ghost', group: 'formules'}"
                        @end="onEnd($event,)"
                        >
                            <div class="action" @click="showDetail($event)">
                                <h5 class="info">3 formules</h5>
                                <span class="icon-down icon-active"></span>
                            </div>
                            <div class="action-content">
                                <div class="action-item" v-for="(element, index) in progresser">
                                    <span>{{element.name}}</span>
                                    <div class="action-tool">
                                        <!--<span class="icon-warning icon-active mr-8"></span>-->
                                        <a @click="deleteFormules(progresser, element, index)"><span class="icon-poubelle icon-active mr-8" data-tooltip="Détacher la formule"></span></a>
                                    </div>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>

                <div class="item">
                    <div class="header">
                        <h4 class="title">TEN’UP Access</h4>
                        <h5 class="data">A partir du 12/02/2018</h5>
                    </div>
                    <div class="body">
                        <p>TEN’UP ACCESS regroupe l’ensemble des formules de cotisation individuelle, sans enseignement : cotisation adultes, cotisation étudiants, cotisation jeunes, cotisation demandeur d'emploi, formule trimestrielle ou semestrielle de location horaire,…</p>
                    </div>
                    <div class="footer">
                        <draggable  class="drag-section" v-model="progresser" :options="{sort: false, group:{ name:'formules' }}">
                            Faites glisser ici les formules concernées par cette offre
                        </draggable>
                    </div>
                </div>


                <div class="item">
                    <div class="header">
                        <h4 class="title">TEN’UP Access famille</h4>
                        <h5 class="data danger">Terminée le 24/11/2017</h5>
                        <span class="icon-panier_preinsc icon-active"></span>
                    </div>
                    <div class="body">
                        <p>TEN’UP ACCESS FAMILLE regroupe l’ensemble des formules de cotisation familiale, sans enseignement : cotisation couple, cotisation famille,…</p>
                    </div>
                    <div class="footer">
                        <div class="action">
                            <h5 class="info">3 formules</h5>
                            <h5 class="info warning">1 en attente</h5>
                            <span class="icon-down icon-active"></span>
                        </div>
                        <div class="action-content"></div>
                    </div>
                </div>


                <div class="item">
                    <div class="header">
                        <h4 class="title">TEN’UP Access famille</h4>
                        <h5 class="data danger">Terminée le 24/11/2017</h5>
                        <span class="icon-panier_preinsc icon-active"></span>
                    </div>
                    <div class="body">
                        <p>TEN’UP ACCESS FAMILLE regroupe l’ensemble des formules de cotisation familiale, sans enseignement : cotisation couple, cotisation famille,…</p>
                    </div>
                    <div class="footer">
                        <div class="action">
                            <h5 class="info">2 formules</h5>
                            <span class="icon-down icon-active"></span>
                        </div>
                        <div class="action-content">
                            <div class="action-item">
                                <span>Adhésion Jeunes 4 - 11</span>
                                <div class="action-tool">
                                    <h5 class="detail warning mr-8">En attente de validation</h5>
                                    <span class="icon-warning icon-active mr-8"></span>
                                    <a><span class="icon-poubelle icon-active mr-8" data-tooltip="Détacher la formule"></span></a>
                                </div>
                            </div>
                            <div class="action-item">
                                <span>Adhésion Jeunes 12 - 18</span>
                                <div class="action-tool">
                                    <a><span class="icon-poubelle icon-active mr-8" data-tooltip="Détacher la formule"></span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="header">
                        <h4 class="title">TEN’UP Invitation</h4>
                        <h5 class="data danger">Terminée le 24/11/2017</h5>
                        <span class="icon-panier_preinsc icon-active"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import draggable from 'vuedraggable';
import moment from 'moment';
export default {
    components: {
        draggable,
    },
    props: ['favorisOnly', 'categories'],
    data: function () {
        return {
            formulesData: [{
                ageMax: null,
                ageMin: null,
                classementMax: null,
                classementMin: null,
                codeClub: null,
                codeClubProprietaire: null,
                codeSexe: null,
                createTime: null,
                createUser: null,
                espaceAdherent: false,
                favori: true,
                idCategorie: null,
                idMetaOffre: null,
                identifiant: 112055,
                intitule: "Inscription en attente de validation",
                intituleInvite: null,
                jsonCible: null,
                label: "Inscription en attente de validation",
                libelleMetaOffre: null,
                millesimeVente: 2019,
                montant: 15.0,
                montantEcheance1: 0.0,
                montantEcheance2: 0.0,
                montantEcheance3: 0.0,
                montantEcheance4: 0.0,
                montantPaiementEnLigne: 15.0,
                montantPel: 14.0,
                nbReservationsSimultanees: 1,
                nbTickets: null,
                niveauMax: null,
                niveauMin: null,
                nombreEcheances: 0,
                ordreAffichage: 1,
                paiementEnLigne: true,
                paiementEnLigneValidClub: true,
                paiementNFoisEcheance1: null,
                paiementNFoisEcheance2: null,
                paiementNFoisEcheance3: null,
                paiementNFoisEcheance4: null,
                preInscription: true,
                quantite: 1,
                sexe: null,
                sousType: "Abonnement",
                statutRattachement: null,
                type: "AB",
                typeLicence: {
                    code: "CLU",
                    codeClubProprietaire: null,
                    compatibleNonPratiquant: false,
                    direct: false,
                    dureeValidite: null,
                    key: "CLU",
                    label: null,
                    libelle: null,
                    valide: false
                },
                updateTime: new Date(1538495892763),
                updateUser: null,
                value: 112055
            },
            {
                ageMax: 100,
                ageMin: 19,
                classementMax: null,
                classementMin: null,
                codeClub: null,
                codeClubProprietaire: null,
                codeSexe: null,
                createTime: null,
                createUser: null,
                espaceAdherent: true,
                favori: true,
                idCategorie: null,
                idMetaOffre: null,
                identifiant: 26405,
                intitule: "Adh\u00E9sion Adultes",
                intituleInvite: null,
                jsonCible: null,
                label: "Adh\u00E9sion Adultes",
                libelleMetaOffre: null,
                millesimeVente: 2019,
                montant: 140.0,
                montantEcheance1: 67.5,
                montantEcheance2: 67.5,
                montantEcheance3: 0.0,
                montantEcheance4: 0.0,
                montantPaiementEnLigne: 140.0,
                montantPel: 135.0,
                nbReservationsSimultanees: 1,
                nbTickets: null,
                niveauMax: null,
                niveauMin: null,
                nombreEcheances: 2,
                ordreAffichage: 9,
                paiementEnLigne: true,
                paiementEnLigneValidClub: false,
                paiementNFoisEcheance1: 50,
                paiementNFoisEcheance2: 50,
                paiementNFoisEcheance3: 0,
                paiementNFoisEcheance4: 0,
                preInscription: false,
                quantite: 1,
                sexe: null,
                sousType: "Abonnement",
                statutRattachement: null,
                type: "AB",
                typeLicence: {
                    code: "CLU",
                    codeClubProprietaire: null,
                    compatibleNonPratiquant: false,
                    direct: false,
                    dureeValidite: null,
                    key: "CLU",
                    label: null,
                    libelle: null,
                    valide: false
                },
                updateTime: new Date(1526134640790),
                updateUser: null,
                value: 26405
            },],
            offersData: [],
            jouer: [
            {
                codeClubProprietaire: null,
                debutValidite: new Date(1539126000000),
                descriptionClub: "TEN'UP ENFANTS regroupe l'ensemble des formules d'enseignement d\u00E9di\u00E9es aux jeunes de moins de 11 ans, avec ou sans cotisation.",
                finValidite: new Date(2548969200000),
                idMetaOffre: 6,
                nbRattachementsEnAttente: 0,
                nbRattachementsValides: 0,
                rattachementsNonRefuses: null,
                formules: []
            },
            {
                codeClubProprietaire: null,
                debutValidite: new Date(1539126000000),
                descriptionClub: "TEN'UP ENFANTS regroupe l'ensemble des formules d'enseignement d\u00E9di\u00E9es aux jeunes de moins de 11 ans, avec ou sans cotisation.",
                finValidite: new Date(2548969200000),
                idMetaOffre: 7,
                nbRattachementsEnAttente: 0,
                nbRattachementsValides: 0,
                rattachementsNonRefuses: null,
                formules: [],
            },],
            idCategorie: 0,
            progresser: [],
            jouer: [],
        };
    },
    mounted() {
        this.loadFormules()
        this.loadMetaOffres('ALL');
        console.log(this.categories);
    },
    watch: {
        favorisOnly: 'loadFormules'
    },
    methods: {
        loadFormules(){
            console.log("Loading meata offres formulas", this.favorisOnly);
            if (!window.MetaOffreService) {
                return;
            }
            MetaOffreService.findFormules(this.favori, (formules) => {
                console.log(formules);
                this.formulesData = Object.keys(formules).map((idx) => formules[idx]);

                // var divFormules = document.getElementById("formules");
                // var formulesList = "";

                // for(var i=0; i < Object.keys(formules).length; i++){
                    //     formulesList += "<p class='fft-form-line'>";
                    //     formulesList += formules[i]["intitule"] + " || ";
                    //     formulesList += formules[i]["sousType"] + " || ";
                    //     formulesList += formules[i]["millesimeVente"] + " || ";
                    //     formulesList += " VISIBILITE TODO || ";
                    //     formulesList += " (idMetaOffre : " + formules[i]["idMetaOffre"];
                    //     formulesList += " - idFormule : " + formules[i]["identifiant"];
                    //     formulesList += " - statutRattachement : " + formules[i]["statutRattachement"];
                    //     formulesList += ")";
                    //     formulesList += "</p>";
                    // }
                    // divFormules.innerHTML = formulesList;
                });
        },
        loadMetaOffres(idCategorie){
            console.log("LOADING meta offers", idCategorie);
            this.idCategorie = idCategorie;
            if (!window.MetaOffreService) {
                return;
            }
            MetaOffreService.findMetaOffres(this.idCategorie === 'ALL' ? null : this.idCategorie, null, (metaoffres) => {
                console.log(metaoffres);
                this.offersData = metaoffres;
                this.offersData.forEach(offer => {
                    if (!offer.formules) {
                        offer.formules = [];
                    }
                })

            });
        },

        loadFormulesMetaOffre(idMetaOffre){
            if (!window.MetaOffreService) {
                return;
            }
            MetaOffreService.findFormulesRattachees(idMetaOffre, (formules) => {

                const metaoffre = this.offersData.find(offer => offer.idMetaOffre === idMetaOffre);
                console.log("DFOUND ", formules, 'for', metaoffre);
                if (metaoffre) {
                    metaoffre.formules = formules;
                    this.$set(metaoffre, 'formules', formules);
                }

            });
        },

        formatDate(data) {
            return moment(data).format('DD/MM/YYYY');
        },
        onEnd(a, b) {
            console.log("end of drag", a, b);
            this.$emit('formule:drop', {offre:b, formule: a});
            //  MetaOffreService.rattacher(b.idMetaOffre, a.idFormule, () => {
              //      this.loadFormules();
              //  });
          },

          showDetail(event, offer) {
            const panel = event.target.closest('.action').nextElementSibling;
            if (panel === null || !offer){
               return;
           }
           event.target.closest('.action').classList.toggle('active');
           this.loadFormulesMetaOffre(offer.idMetaOffre);
           if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    },

    deleteFormules(offre, formule, index) {
        if(offre.formules) {
            offre.formules.splice(index, 1);
        }
        else {
            offre.splice(index, 1);
        }
        this.formulesData.push(formule);
        this.$emit('formule:remove', {offre:offre, formule: formule});
        if (!window.MetaOffreService) {
            return;
        }
        MetaOffreService.detacher(idRattachement, function(){
            alert('Détachement OK');
            loadFormules();
        });
    }
}
}
</script>
<style lang="scss" scoped>
</style>


