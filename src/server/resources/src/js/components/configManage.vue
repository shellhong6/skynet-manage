<template>
  <div>
    <section class="content-header">
    </section>
    <section class="content">
      <box>
        <div slot="title">
          配置管理
        </div>
        <span slot="btn" @click="clickAdd">添加</span>
        <div slot="body">
          <data-table
            :columns="configTable.columns"
            :data="configTableData.data"
            :data-extend="configTable.dataExtend"
            :opts="configTable.opts"
            :row-click="configTable.rowClick">
          </data-table>
          <pagination :total="configTableData.total" :curr.sync="configTableData.cur" :size="configTableData.size" :page-action='configTable.pageAction'></pagination>
        </div>
      </box>
    </section>
    <modal :show.sync="modal.show" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          {{modal.title}}
        </h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <template v-if='modal.type=="alert"'>
          {{modal.message}}
        </template>
        <template v-if='modal.type=="add_config"'>
          <form-group :valid.sync="modal.add_config.valid">
            <bs-input label="名称" :value.sync="modal.add_config.name" required></bs-input>
            <bs-input label="内容" type="detail" :value.sync="modal.add_config.detail" required></bs-input>
          </form-group>
        </template>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="modal.show = false">{{modal.cancelText || '取消'}}</button>
        <button type="button" class="btn btn-success"  :disabled="modal.type != 'alert' && !modal.add_config.valid" @click="doSure">{{modal.sureText || '确定'}}</button>
      </div>
    </modal>

  </div>
</template>
<script>
  import FormBox from '../plugins/FormBox.vue';
  import Box from '../plugins/Box.vue';
  import Chart from '../plugins/Chart.vue';
  import BaseUtil from '../util/utils/baseUtil.js';
  import ChartUtil from '../util/utils/chartUtil.js';
  import Pagination from '../plugins/Pagination.vue';
  import DataTable from '../plugins/DataTable.vue';
  import {
    getConfigs,
    doConfigDelete,
    doConfigAdd
  } from '../vuex/actions';
  import {
    configTableData
  } from '../vuex/getters';
  import { modal, popover, formGroup, input as bsInput, select as vSelect} from 'vue-strap';

  const SIZE = 20;

  export default {
    name: 'configManage',

    components: {
      Box,
      Chart,
      modal,
      alert,
      Pagination,
      DataTable,
      popover,
      formGroup,
      vSelect,
      bsInput
    },

    vuex: {
      getters: {
        configTableData
      },
      actions: {
        getConfigs,
        doConfigDelete,
        doConfigAdd
      }
    },

    data() {
      return {
        timeLineOpt: null,
        memoryOpt: null,
        resourcesWithTypeOpt: null,
        resourcesWithDomainOpt: null,
        pvOpt: null,
        configTable: {
          size: SIZE,
          pageAction: 'getConfigs',
          columns: [
            {title: '名称', key: 'name'},
            {title: '内容', key: 'detail'}
          ],

          opts: [
            { title: '删除', key: '_id', type: 'delete' }
          ],

          rowClick: (entry, extend) => {},

          dataExtend: {}
        },
        modal: {
          title: '添加用户',
          message: '',
          show: false,
          sureText: '确定',
          cancelText: '取消',
          id: '',
          action: '',
          type: 'add_config',
          add_config: {
            valid: false,
            name: '',
            detail: ''
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
      'pagination:change': function(page, start, pageSize, type) {
        var name = BaseUtil.getUrlParam('name');
        this[type]({
          cur: page,
          pageSize: pageSize
        });
      },
      'datatable:operate': function(type, key, entry){
        switch (type) {
          case 'delete':
            this.clickDelete(entry);
            break;
          default:

        }
      }
    },

    watch: {
    },

    methods: {
      clickDelete(entry) {
        this.showModal('确定删除该用户吗？', 'delete', entry, 'alert');
      },
      clickAdd(){
        this.showModal('', 'add_config', null, 'add_config');
      },
      doSure(){
        var name = BaseUtil.getUrlParam('name');
        switch (this.modal.action) {
          case 'delete':
            this.doConfigDelete({
              id: this.modal.id,
              cur: this.configTableData.cur,
              pageSize: SIZE
            });
            break;
          case 'add_config':
            this.doConfigAdd({
              name: this.modal.add_config.name,
              detail: this.modal.add_config.detail,
              cur: this.configTableData.cur,
              pageSize: SIZE
            });
            break;
          default:

        }
        this.modal.show = false;
      },
      trigger(e, name, type) {
      },
      showAlert(type, message) {
        this.alert.type = type;
        this.alert.message = message;
        this.alert.className = type == 'success' ? 'icon-ok-circled' : 'icon-info-circled';
        this.alert.show = true;
      },
      showModal(mes, action, entry, type) {
        switch (action) {
          case 'delete':
            this.modal.message = mes;
            this.modal.id = entry._id;
            break;
          case 'add_config'://do nothing
            break;
          default:

        }
        this.modal.show = true;
        this.modal.type = type;
        this.modal.action = action;

      }
    },

    route: {
      data() {}
    },

    attached() {
      this.getConfigs({
        cur: 1,
        pageSize: SIZE
      });
    }
  }
</script>
