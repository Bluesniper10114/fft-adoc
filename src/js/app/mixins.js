
var VueDraggableMiniCal =  {
  mounted: function (el) {
    // this.$draggerTop = $(this.$el).find('.booking-dragger-top');
    // this.$draggerBottom = $(this.$el).find('.booking-dragger-bottom');
    //
    //
    //
    // this.$draggerTop.on("mousedown touchstart", $.proxy(this.onDragTopStart, this));
    // this.$draggerTop.on("mousemove touchmove", $.proxy(this.onDragTop, this));
    // this.$draggerTop.on("mouseup touchend", $.proxy(this.onDragTopStop, this));
    //
    // this.$draggerBottom.on("mousedown touchstart", $.proxy(this.onDragBottomStart, this));
    // this.$draggerBottom.on("mousemove touchmove", $.proxy(this.onDragBottom, this));
    // this.$draggerBottom.on("mouseup touchend", $.proxy(this.onDragBottomStop, this));

    // $(this.$el).on("mousedown touchstart", $.proxy(this.onDragStart, this));
    // $(this.$el).on("mousemove touchmove", $.proxy(this.onDrag, this));
    // $(this.$el).on("mouseleave touchend", $.proxy(this.onDragStop, this));
    //

  },

    methods:{
      onAdd: function (evt) {
        var itemEl = evt.item;  // dragged HTMLElement
            evt.to;    // target list
            evt.from;  // previous list
            evt.oldIndex;  // element's old index within old parent
            evt.newIndex;  // element's new index within new parent

        console.log(itemEl);
      },
      // Element is chosen
    	onChoose: function (evt) {
    		evt.oldIndex;  // element index within parent

        console.log(evt);
    	},

      onUpdate: function (evt) {
        var itemEl = evt.item;  // dragged HTMLElement
    		evt.to;    // target list
    		evt.from;  // previous list
    		evt.oldIndex;  // element's old index within old parent
    		evt.newIndex;  // element's new index within new parent
          console.log(evt);
  	  }

}

};

var VueDraggable = {
  mounted: function (el) {
    this.$draggerTop = $(this.$el).find('.booking-dragger-top');
    this.$draggerBottom = $(this.$el).find('.booking-dragger-bottom');



    this.$draggerTop.on("mousedown touchstart", jQuery.proxy(this.onDragTopStart, this));
    this.$draggerTop.on("mousemove touchmove", jQuery.proxy(this.onDragTop, this));
    this.$draggerTop.on("mouseup touchend", jQuery.proxy(this.onDragTopStop, this));

    this.$draggerBottom.on("mousedown touchstart", jQuery.proxy(this.onDragBottomStart, this));
    this.$draggerBottom.on("mousemove touchmove", jQuery.proxy(this.onDragBottom, this));
    this.$draggerBottom.on("mouseup touchend", jQuery.proxy(this.onDragBottomStop, this));

    jQuery(this.$el).on("mousedown touchstart", jQuery.proxy(this.onDragStart, this));
    jQuery(this.$el).on("mousemove touchmove", jQuery.proxy(this.onDrag, this));
    jQuery(this.$el).on("mouseup touchend", jQuery.proxy(this.onDragStop, this));
  },

  methods: {
    // onDragTopStart: function (){
    //   this.begin--;
    // },
    // onDragTop: function (){console.log("onDragTop");},
    // onDragTopStop: function (){
    //
    // },
    // onDragBottomStart: function (){
    //   this.begin++;
    // },
    // onDragBottom: function (){console.log("onDragBottom");},
    // onDragBottomStop: function (){console.log("onDragBottomStop");},
    // onDragStart: function (){console.log("onDragStart");},
    // onDrag: function (){console.log("onDrag");},
    // onDragStop: function (){console.log("onDragStop");},
  }
};

var VueSlot = {
  data: function (){
    return {
      begin: 0,
      end: 0
    }
  },

  computed: {
    duration: function () {
      return this.end - this.begin
    },
    top: function (){
      return (this.begin - this.$root.min + 1) * 100
    }
  },
};

//export default {FFT, VueDraggable, VueSlot};
