<template>
  <div v-bind:class="['box', className]">
    <div class="box-header">
      <h3 class="box-title">
        <slot name="title"></slot>
      </h3>
      <button type="button" name="button" class='rightBtn'><slot name="btn"></slot></button>
    </div>
    <div class="box-body">
      <slot name="body"></slot>
    </div>

    <div class="overlay" v-if="loading">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
  </div>
</template>
<style media="screen">
.rightBtn{
  float: right;
  border: none;
  outline: none;
}
.rightBtn:after{
  clear: both;
}
</style>
<script>
  export default {
    name: 'Box',

    props: {
      className: {
        type: String,
        default: '',
      },

      loading: {
        type: Boolean,
        default: false,
      }
    },

    data() {
      return {

      }
    }
  }
</script>
