<template>
  <div class="chart-wrapper">
    <canvas v-el:chart width="{{width}}" height='{{height}}'></canvas>
  </div>
  </div>
</template>

<script>
  export default {
    name: 'Chart',

    props: {
      opt: {
        type: Object
      },
      chart: {
        type: String
      },
      width: {
        type: String,
        default: '400'
      },
      height: {
        type: String,
        default: '200'
      }
    },

    watch: {
      opt(val, oldval) {
        if(this.chartObj){
          this.chartObj.data.datasets = val.data.datasets;
          this.chartObj.data.labels = val.data.labels;
          this.chartObj.update();
        }else{
          this.chartObj = new Chart(this.$els.chart, this.opt);
        }
      }
    },

    ready() {
      if(this.opt){
        this.chartObj = new Chart(this.$els.chart, this.opt);
      }
    }
  }
</script>
