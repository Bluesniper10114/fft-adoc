var FFTDialog2 = {
    background: null,
    okCallback: null,
    footer: null,
    leftButtons: [],
    centerButtons: [],
    rightButtons: [],
    closeAll: function () {
        $$("div.modal").each(function (item) {
            item.hide();
            item.remove();
        });
    },

    close: function () {
        $$("div.modal").each(function (item) {
            /*const hiddenElement = document.getElementsByClassName('hiddenElement');
            if(hiddenElement.length > 0){
              hiddenElement[0].classList.remove('hiddenElement');
            }*/

            item.hide();
            item.remove();
        });
    },

    alert: function (content, parameters) {
        if (!parameters) {
            parameters = {};
        }
        parameters.type = "alert";
        if (!parameters.width) {
            parameters.width = "30%";
        }
        if (content && typeof content != "string") {
            if (content.options == null) {
                content.options = {};
            }
            content.options.onComplete = function (response) {
                FFTDialog.alert(response.responseText, parameters);
            }
            new Ajax.Request(content.url, content.options)
            return null;
        } else {
            return this._openDialog(content, parameters);
        }
    },

    alertWithObject: function (object, parameters) {
        parameters.type = "alert";
        return this._openDialog(object, parameters);
    },

    confirm: function (content, parameters) {
        parameters.type = "confirm";
        if (content && typeof content != "string") {
            if (content.options == null) {
                content.options = {};
            }
            content.options.onComplete = function (response) {
                FFTDialog.confirm(response.responseText, parameters);
            }
            new Ajax.Request(content.url, content.options)
            return null;
        } else {
            return this._openDialog(content, parameters);
        }
    },

    _openDialog: function (content, parameters) {
        var self = this;
        this.background = new Element("div", { "class": "modal" });
        this.background.style.setProperty('z-index', this._getZIndex(parameters));

        var modal = new Element("div", {
            "class": "modal-content"
        });
        modal.style.width = this._getWidth(parameters);

        var close = new Element("span", { "class": "modal-close" });
        close.update("&times;");
        close.observe("click", function () {
            if (parameters.onClose) {
                parameters.onClose(self)
            }
            self.close();
        });

        var child = new Element("p");
        child.update(content);

        modal.insert(close);
        modal.insert(content);
        this._createFooter();
        modal.insert(this.footer);
        this.background.update(modal);

        $$("div.fft-main-content")[0].insert({ 'top': this.background });
        this.background.show();

        this._getButtons(modal, parameters);
        return this;
    },

    _getButtons: function (modal, parameters) {
        var self = this;
        self.leftButtons = [];
        self.centerButtons = [];
        self.rightButtons = [];
        if ((parameters.type == "confirm" && (parameters.okLabel != null || parameters.onOk != null))) {
            self.centerButtons = [];
            var okButton = new Element("button", { "class": self._getButtonStyleClass(parameters.okStyleClass), "type": "button" });
            okButton.update(parameters.okLabel != null ? parameters.okLabel : "OK");
            okButton.observe("click", function (win) {
                if (parameters.onOk != null) {
                    parameters.onOk(self);
                }
                self.close();
            });
            self.rightButtons.push(okButton);

            if (parameters.okLabel2 != null) {
                var okButton2 = new Element("input", { "class": "btn2 btn2ModaleGsEquipe", "value": parameters.okLabel2, "type": "button" });
                okButton2.observe("click", function (win) {
                  if (parameters.onOk2 != null) {
                      parameters.onOk2(self);
                  }
                    self.close();
                });
                self.centerButtons.push(okButton2);
            }


        }
        this._getCloseButtonLine(modal, parameters);

        var buttonsLine = this._getButtonsLine(modal, parameters);
        if (buttonsLine != null) {
            modal.insert(new Element("p").update("&nbsp;"));
            modal.insert(buttonsLine);
        }
    },

    _getButtonStyleClass: function (paramValue) {
        return paramValue != null && paramValue != "" ? paramValue : "btn2";
    },

    _getCloseButtonLine: function (modal, parameters) {
        var self = this;
        var centerButtons = [];
        var closeLabel;
        if (parameters.type == "alert") {
            closeLabel =  parameters.okLabel != null ? parameters.okLabel : 'OK';
        }
        else if (parameters.type == "confirm") {
            closeLabel =  parameters.cancelLabel != null ? parameters.cancelLabel : 'Annuler';
        }

        if (parameters.closeLabel != "NONE" && parameters.cancelLabel != "NONE") {
            var close = new Element("input", { "class": "btn2", "value": closeLabel, "type": "button" });
            close.observe("click", function () {
                self.close();
            });
            if (parameters.type == "alert") {
                this.centerButtons.push(close);
            } else if (parameters.type == "confirm") {
                this.leftButtons.push(close);
            }

        }
    },

    _createFooter: function() {
      jQuery('.modal .fft-line-separate').remove();
      var footer = new Element("div", { "class": "fft-line-separate" , 'data-timestamp': Date.now()});
      var left = new Element("div", { "class": "fft-line-separate-left" });
      var center = new Element("div", { "class": "fft-line-separate-center" });
      var right = new Element("div", { "class": "fft-line-separate-right" });

      footer.insert(left);
      footer.insert(center);
      footer.insert(right);
      this.footer = footer;
      return this.footer;
    },

    _getButtonsLine: function (modal, parameters) {
        var nbButtons = 0;

        var left = document.querySelector('.modal .fft-line-separate-left');
        nbButtons += this._addButtons(left, this.leftButtons);
        this.footer.insert(left);

        var center = document.querySelector('.modal .fft-line-separate-center');
        nbButtons += this._addButtons(center, this.centerButtons);
        this.footer.insert(center);

        var right = document.querySelector('.modal .fft-line-separate-right');
        nbButtons += this._addButtons(right, this.rightButtons);
        this.footer.insert(right);

        return nbButtons > 0 ? this.footer : null;
    },

    _addButtons: function (container, buttons) {
      container.innerHTML = "";
        var nbButtons = 0;
        if (buttons != null) {
            for (var i = 0; i < buttons.length; i++) {
                container.insert(buttons[i]);
                nbButtons += 1;
            }
        }
        return nbButtons;
    },

    _getWidth: function (parameters) {
        var width = "30%";
        if (parameters != null && parameters.width != null) {
            width = parameters.width + (!isNaN(parameters.width) ? "px" : "");
        }
        return width;
    },

    _getZIndex: function (parameters) {
        var zIndex = "999";
        if (parameters != null && parameters.zIndex != null) {
            zIndex = parameters.zIndex;
        }
        return zIndex;
    }
}
