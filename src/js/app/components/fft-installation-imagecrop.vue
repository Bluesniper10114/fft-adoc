<template>
    <div id="imagecrop" class="fft-modal">
        <div class="dialog__mask" id="dialog">
            <div class="container-fluid dialog__container">
                <a class="dialog__close" @click.prevent="closeDialog()">
                    <i class="icon-cancel">
                        <span class="hidden">Close</span>
                    </i>
                </a>
                <div class="dialog__body" id="fft-main">
                    <div yle="max-width:1400px; max-height:700px;" class="fft-main-content page-installations-modify-modal">
                        <h2 class="mt-0 mb-32">Ajouter une photo</h2>

                        <div class="fft-notification">
                            <span class="fft-notification_info"></span>
                                <ul>
                                    <li>La zone en surbrillance vous permet de visualiser votre photo telle qu'elle sera enregistr&eacute;e. Vous pouvez repositionner votre photo et utiliser la molette de votre souris pour ajuster le niveau de zoom si n&eacute;cessaire.</li>
                                </ul>
                        </div>

                        <div class="drop-back" @dragover.prevent @drop="onDrop">
                            <div class="drop-image">
                                <p>Faites glisser votre photo ici</p>
                            </div>
                            <p class="pt-64 pb-50">ou</p>
                            <label class="btn icon-bigplus" style="color:white !important; padding: 0px !important" for="upload">S&eacute;lectionnez depuis votre ordinateur</label>
                            <input type="file" id="upload" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/jpg" @change="uploadImg($event)">
                        </div>
                        <div class="preview-back">
                            <vueCropper ref="cropper" :img="imageData.img" :outputSize="imageData.size" :outputType="imageData.outputType" :info="imageData.info" :canScale="imageData.canScale" :autoCrop="imageData.autoCrop" :autoCropWidth="imageData.autoCropWidth" :autoCropHeight="imageData.autoCropHeight" :fixedBox="imageData.fixedBox" :fixedNumber="imageData.fixedNumber" enlarge="2"></vueCropper>
                            <button type="button" class="btn icon-poubelle icon-white mt-15" @click="remove()">Supprimer</button>
                        </div>
                        <div class="fft-line-separate m-0">
                            <div class="fft-line-separate-left p-0 mt-15">
                                <button type="button" class="btn2 ml-0" @click.prevent="closeDialog()">Fermer</button>
                            </div>
                            <div class="fft-line-separate-right p-0 mt-15">
                                <button type="button" class="btn icon-tick mr-0" @click.prevent="finish()">Valider</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { VueCropper } from 'vue-cropper'

export default {
    props: ['open', 'source', 'destination', 'extensions'],
    components: {
        VueCropper,
    },
    data: function () {
        return {
            imageData: {
                img: "",
                // info: true,
                size: 1,
                outputType: "jpeg",
                // canScale: true,
                autoCrop: true,
                autoCropWidth: 656,
                autoCropHeight: 300,
                fixed: true,
                fixedBox: true,
                info: false,
                fixedNumber: [1312, 600]
            },
            outputTag: false
        };
    },
    watch: {
        'open': 'openDialog'
    },
    created() {},
    mounted() {
        this.outputTag = document.querySelector(this.destination);
        this.$store.commit('setImage', this.source + '');
    },
    methods: {
        finish() {
            this.$refs.cropper.getCropData(data => {
                this.$store.commit('setImage', data);
            });
            jQuery('html').css('overflow-y', 'unset');
            jQuery('#imagecrop .dialog__mask').removeClass('dialog__mask--is-visible');
        },
        uploadImg(e) {
            var files = e.target.files;
            this.createFile(files[0]);
        },
        onDrop: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var files = e.dataTransfer.files;
            this.createFile(files[0]);
        },
        createFile(file) {
            var fileName = file.name;
            var fileExtension = fileName.substr((fileName.lastIndexOf('.') + 1));

            var tabExtension = this.extensions.split(';');

            if (!tabExtension.includes(fileExtension)) {
                alert('Merci de selectionner une image');
                return;
            }
            if (file.size > 5e+6) {
                alert("La taille maximum autoris�e est de 5Mo.");
                return;
            }

            var reader = new FileReader();
            reader.onload = e => {
                let image = new Image();
                image.src = e.target.result;

                let url = e.target.result;
                let self = this;

                image.onload = function () {
                    var height = this.height;
                    var width = this.width;
                    console.log("dimensions", height, width);
                    if (height < 600 || width < 1312) {
                        alert("La taille minimum autorisée; est : 1312px de largeur par / 600px de hauteur");
                    } else {
                        self.imageData.img = url;
                        document.getElementsByClassName('drop-back')[0].style.display = 'none';
                        document.getElementsByClassName('preview-back')[0].style.display = 'block';
                    }
                };
            };
            reader.readAsDataURL(file);
        },
        openDialog() {
            openModal('#imagecrop');
        },
        closeDialog() {
            jQuery('html').css('overflow-y', 'unset');
            jQuery('#imagecrop .dialog__mask').removeClass('dialog__mask--is-visible');
            document.getElementsByClassName('drop-back')[0].style.display = 'block';
            document.getElementsByClassName('preview-back')[0].style.display = 'none';
            this.imageData.img = '';
        },
        remove() {
            this.imageData.img = '';
            document.getElementById('upload').value = '';
            document.getElementsByClassName('drop-back')[0].style.display = 'block';
            document.getElementsByClassName('preview-back')[0].style.display = 'none';
        }
    },
}
</script>
<style lang="scss" scoped>
.dialog__container {
    background-color: #f2f2f2 !important;
    width: unset !important;
    max-width: 1152px;
    padding: 32px;

    .dialog__close {
        height: 24px;
        width: 24px;
        right: 32px;
        top: 32px;
    }

    #fft-main {
        width: 1152px;
        min-height: unset !important;
        min-width: unset !important;
        padding: 0;

        .page-installations-modify-modal {
            padding-top: 0 !important;

            h2 {
                color: #033C69;
                font-size: 18px;
                line-height: 21px;
                font-weight: 100;
            }

            .drop-back {
                background-color: #E7E7E7;
                padding: 32px;
                text-align: center;

                p {
                    color: #9B9B9B;
                    font-size: 18px;
                    line-height: 21px;
                    text-align: center;
                }

                .drop-image {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 190px;
                    border: 3px dotted #9B9B9B;
                    border-radius: 4px;
                }

                label {
                    align-items: center;
                    justify-content: center;
                    display: flex;
                    width: 255px;
                    height: 32px;
                    margin: 0 auto;
                }
            }

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

        .fft-line-separate {
            border-top: 1px solid #CDCDCD;
        }

        .preview-back {
            display: none;
            height: 650px;
            text-align: center;
        }
    }
}

@media (max-width: 1279px) {
    #imagecrop #fft-main {
        width: 90vw;
    }
}
</style>
