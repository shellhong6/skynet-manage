<template>
  <div>
    <section class="content-header">
    </section>
    <section class="content">
      <form-box :form="form" :buttons="buttons" :bodybtns="bodybtns"></form-box>
      <box>
        <div slot="body">
          <data-table
            :columns="coTable.columns"
            :data="coTableData.data"
            :data-extend="coTable.dataExtend"
            :opts="coTable.opts"
            :row-click="coTable.rowClick">
          </data-table>
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
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="modal.show = false">{{modal.cancelText || '取消'}}</button>
        <button type="button" class="btn btn-success" @click="doSure">{{modal.sureText || '确定'}}</button>
      </div>
    </modal>

  </div>
</template>
<script>
  import FormBox from '../plugins/FormBox.vue';
  import Box from '../plugins/Box.vue';
  import Chart from '../plugins/Chart.vue';
  import BaseUtil from '../util/utils/baseUtil.js';
  import DataTable from '../plugins/DataTable.vue';
  import {
    getCoList,
    getQCoList,
    doCoDelete,
    batchCoDelete
  } from '../vuex/actions';
  import {
    coTableData,
    batchCoList
  } from '../vuex/getters';
  import { modal, formGroup} from 'vue-strap';

  export default {
    name: 'coManage',

    components: {
      Box,
      modal,
      alert,
      DataTable,
      formGroup,
      FormBox
    },

    vuex: {
      getters: {
        coTableData,
        batchCoList
      },
      actions: {
        getCoList,
        getQCoList,
        doCoDelete,
        batchCoDelete
      }
    },

    data() {
      return {
        coTable: {
          columns: [
            {title: '名称', key: 'name'},
            {title: '记录条数', key: 'count'}
          ],

          opts: [
            { title: '删除', key: '_id', type: 'delete' }
          ],

          rowClick: (entry, extend) => {},

          dataExtend: {}
        },
        form: {
          title: '集合处理',
          fields: [
            { title: '关键字', name: 'query', type: 'text' }
          ]
        },
        bodybtns: [
          {
            type: 'delete_type',
            text: '批量删除',
            className: 'btn-primary'
          }
        ],
        modal: {
          message: '',
          show: false,
          sureText: '确定',
          cancelText: '取消',
          id: '',
          action: '',
          type: 'add_user'
        }
      }
    },

    events: {
      'datatable:operate': function(type, key, entry){
        switch (type) {
          case 'delete':
            this.clickDelete(entry);
            break;
          default:

        }
      },
      'buttons:trigger': function(type, $el, params) {
        if (type == 'delete_type') {
          var val = this.form.fields[0].value;
          if(val){
            this.getQCoList({
              query: val
            }, (list) => {
              if(list && list.length){
                this.clickBatchDelete(list);
              }
            });
          }else{

          }
        }
      }
    },

    watch: {
    },

    methods: {
      clickDelete(entry) {
        this.showModal(`确定删除集合（${entry.name}）吗？`, 'delete', entry, 'alert');
      },
      clickBatchDelete(entry) {
        var query = entry.join(',');
        this.showModal(`确定批量删除集合（${query}）吗？`, 'batch-delete', {
          list: entry,
          query: query
        }, 'alert');
      },
      doSure(){
        var name = BaseUtil.getUrlParam('name');
        switch (this.modal.action) {
          case 'delete':
            this.doCoDelete({
              entry: this.modal.entry,
              coTableData: this.coTableData
            });
            break;
          case 'batch-delete':
            this.batchCoDelete({
              query: this.modal.entry.query,
              entry: this.modal.entry.list,
              coTableData: this.coTableData
            });
            break;
          default:

        }
        this.modal.show = false;
      },
      showModal(mes, action, entry, type) {
        switch (action) {
          case 'delete':
            this.modal.message = mes;
            this.modal.entry = entry;
            this.modal.coTableData = coTableData;
            break;
          case 'batch-delete':
            this.modal.message = mes;
            this.modal.entry = entry;
            this.modal.coTableData = coTableData;
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

    created() {
      this.getCoList();
    }
  }
</script>
