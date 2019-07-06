export const fft_helpers = {
  methods: {
    timeToNumber: function (time) {
      var timeEntier = Math.floor(time);
      var timeDecimal = (time - timeEntier) * 60;
      return timeEntier + "h" + timeDecimal;
    },

    numberToTime: function (number) {
      var time = ("" + number).split(":");
      if (time.length < 2) return false;
      var H = +time[0];
      var M = +time[1] / 60;
      return +(H + M).toFixed(2);
    },

    dateToString: function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      return y + "-" + ((m < 10) ? "0" + m : m) + "-" + d;
    },

    getCurrentWeekDays: function() {
      var curr = new Date(); // get current date
      var y = curr.getFullYear();
      var m = curr.getMonth()+1;
      var d = curr.getDay();
      var mon = curr.getDate() - d + (d == 0 ? -6:1);
      var thu = mon + 1;
      var wed = mon + 2;
      var tue = mon + 3;
      var fri = mon + 4;
      var sat = mon + 5;
      var sun = mon + 6;
      var days=[mon,thu,wed,tue,fri,sat,sun];
      var weekDates=[];
      for(var i=0; i<7; i++){
        var date = y + '-' + ((m < 10) ? "0" + m : m) + '-' + ((days[i] < 10) ? "0" + days[i] : days[i]);
        weekDates.push(date);
      }

      return weekDates;
    }
  }
};