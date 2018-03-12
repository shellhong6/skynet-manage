<template>
  <div>
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <div class="content-wrapper">
      <router-view
        transition="fade"
        transition-mode="out-in">
      </router-view>
    </div>

    <modal :show.sync="modal.show" :backdrop="false" effect="fade" :width="400" :callback.sync="modal.callback">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">{{ modal.title }}</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        {{{ modal.content }}}
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="modal.show = false">确定</button>
      </div>
    </modal>

    <modal :show.sync="confirmModal.show" :backdrop="false" effect="fade"
      :width="500">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">{{ confirmModal.title }}</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        {{{ confirmModal.content }}}
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default pull-left"
          @click="confirmCancel">
          {{ confirmModal.cancelBtnText }}
        </button>
        <button type="button" class="btn btn-info"
          @click="confirmAccept">
          {{ confirmModal.acceptBtnText }}
        </button>
      </div>
    </modal>

    <alert
      :show.sync="alert.show"
      :duration="5000"
      :type="alert.type"
      width="400px"
      placement="top"
      dismissable>
      <span v-bind:class="['alert-icon-float-left', alert.className]"></span>
      <p>{{alert.message}}</p>
    </alert>
  </div>
</template>

<script>
  import AppHeader from './AppHeader.vue'
  import AppSidebar from './AppSidebar.vue';
  import { modal, alert } from 'vue-strap';
  import store from '../vuex/store';
  import { globalErrors, globalSuccess } from '../vuex/getters';
  import {
    displayError,
    displaySuccess,
    getUserInfo,
  } from '../vuex/actions';

  export default {
    name: 'App',

    store,

    components: {
      AppHeader,
      AppSidebar,
      modal,
      alert
    },

    vuex: {
      getters: {
        errors: globalErrors,
        success: globalSuccess
      },

      actions: {
        displayError,
        displaySuccess,
        getUserInfo
      }
    },

    data() {
      return {
        modal: {
          show: false,
          title: '提示',
          content: '',
          callback: $.noop,
        },

        confirmModal: {
          show: false,
          title: '提示',
          content: '',
          cancelBtnText: '取消',
          cancelCallback: $.noop,
          acceptBtnText: '确定',
          acceptCallback: $.noop,
        },

        alert: {
          show: false,
          type: 'danger',
          className: 'glyphicon glyphicon-remove-sign',
          message: '',
        },
      }
    },

    events: {
      ['$alert'] (content, title = '提示', cb = $.noop) {
        if (typeof title == 'function') {
          cb = title;
          title = '提示';
        }
        this.modal.content = content;
        this.modal.title = title;
        this.modal.callback = cb;
        this.modal.show = true;
      },

      ['$confirm'] (content, title = '提示', acceptCallback = $.noop, cancelCallback = $.noop) {
        this.confirmModal.content = content;
        this.confirmModal.title = title;
        this.confirmModal.acceptCallback = acceptCallback;
        this.confirmModal.cancelCallback = cancelCallback;
        this.confirmModal.show = true;
      },

      ['$tip'] (msg, type) {
        this.alert.message = msg;
        this.alert.show = true;
      },
    },

    methods: {
      confirmCancel() {
        this.confirmModal.cancelCallback();
        this.confirmModal.show = false;
      },

      confirmAccept() {
        this.confirmModal.acceptCallback();
        this.confirmModal.show = false;
      },
    },

    watch: {
      errors(val, oldval) {
        if (val.length) {
          let info = val[0];
          let index = 0;
          this.alert.message = info.message;
          this.alert.show = true;
          this.displayError(index, info);
        }
      },
      success(val, oldval){
        if (val.length) {
          let info = val[0];
          let index = 0;
          this.alert.message = info.message;
          this.alert.show = true;
          this.alert.type = 'success';
          this.displaySuccess(index, info);
        }
      }
    },

    created() {
      this.getUserInfo();
    }
  }
</script>
