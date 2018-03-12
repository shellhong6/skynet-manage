<template>
  <div>
    <section class="content-header">
    </section>
    <section class="content">
      <box>
        <span slot="title">项目大纲</span>
        <div slot="body">
            <div class='row'>
              <template v-for='item in projects'>
                <div class="col-md-4" @click.stop="trigger($event, item.name, 'project')">
                  <div class="box box-solid box-default">
                    <div class="box-header">
                      <h3 class="box-title">{{item.name}}</h3>
                    </div>
                    <div class="box-body">
                      <p>加载时间过长：{{item.slowTimingAmount}}</p>
                      <p>内存使用过大：{{item.bigMemoryAmount}}</p>
                      <p>代码错误数量：{{item.errorAmount}}</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
        </div>
      </box>
    </section>

    <alert
      :show.sync="alert.show"
      :duration="alert.duration"
      :type="alert.type"
      width="400px"
      placement="top"
      dismissable>
      <span v-bind:class="['alert-icon-float-left', alert.className]"></span>
      <p>{{alert.message}}</p>
    </alert>
  </div>
</template>
<style>
  .col-md-4{
    cursor: pointer;
  }
</style>
<script>
  import FormBox from '../plugins/FormBox.vue';
  import Box from '../plugins/Box.vue';
  import {
    getProjects
  } from '../vuex/actions';
  import {
    projects
  } from '../vuex/getters';
  import { modal, alert } from 'vue-strap';

  export default {
    name: 'AllProject',

    components: {
      Box,
      modal,
      alert
    },

    vuex: {
      getters: {
        projects: projects
      },
      actions: {
        getProjects
      }
    },

    data() {
      return {
        modal: {
          types: {
            show: false
          },
          baseData: {
            show: false
          }
        },

        alert: {
          show: false,
          type: 'success',
          className: 'icon-ok-circled',
          duration: 3500,
          message: ''
        },
      }
    },

    events: {
      ['buttons:trigger'] (type, $el, params) {
        if (type == 'create_type') {
          this.getProjects(params);
        }
      }
    },

    watch: {},

    methods: {
      trigger(e, name, type) {
        switch (type) {
          case 'project':
            location.href = `index#!/project-item-0?name=${name}`;
            break;
          default:

        }
      }
    },

    route: {
      data() {}
    },

    created() {
      this.getProjects();
    }
  }
</script>
