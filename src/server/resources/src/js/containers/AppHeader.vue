<template>
  <header class="main-header">
    <a v-link="{ path: '/' }" class="logo">
      <span class="logo-mini">Fly</span>
      <span class="logo-lg"><b>Flyme</b></span>
    </a>
    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top">
      <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>
    </nav>
    <div class="userField">
      <span class="username">{{userInfo.name}}</span>&nbsp;|
      <a href="javascript:;" class='logout' @click="doLogout">退出</a>
    </div>
  </header>
</template>
<style>
  .userField{
    position: absolute;
    right: 10px;
    top: 0;
    height: 50px;
    line-height: 50px;
    z-index: 1030;
  }
  .userField *{
    color: #43517b;
  }
  .logout:hover{
    color: #FAFAF4;
  }
</style>
<script>
  import { userInfo } from '../vuex/getters';
  import {
    doLogout
  } from '../vuex/actions';

  export default {
    name: 'AppHeader',

    vuex: {
      getters: {
        userInfo
      },
      actions: {
        doLogout
      }
    },

    data() {
      return {

      }
    },

    methods: {
      logout() {
        doLogout();
      }
    }
  }
</script>
