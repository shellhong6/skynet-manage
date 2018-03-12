<template>
  <div>
    <section class="content-header">
    </section>
    <section class="content">
      <form-box :form="form" :buttons="buttons" :bodybtns="bodybtns"></form-box>
      <box>
        <div slot="title">
          数据库管理(总个数：{{dbTableData.length}}／总大小：{{dbTableData.total}})
        </div>
        <div slot="body">
          <data-table
            :columns="dbTable.columns"
            :data="dbTableData.data"
            :data-extend="dbTable.dataExtend"
            :opts="dbTable.opts"
            :row-click="dbTable.rowClick">
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
    getDbList,
    doDbDelete,
    getQDbList,
    batchDbDelete
  } from '../vuex/actions';
  import {
    dbTableData,
    batchDbList
  } from '../vuex/getters';
  import { modal, formGroup} from 'vue-strap';

  export default {
    name: 'dbManage',

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
        dbTableData,
        batchDbList
      },
      actions: {
        getDbList,
        doDbDelete,
        getQDbList,
        batchDbDelete
      }
    },

    data() {
      return {
        dbTable: {
          columns: [
            {title: '名称', key: 'name'},
            {title: '大小', key: 'sizeOnDisk'},
            {title: '是否为空', key: 'isEmpty'}
          ],

          opts: [
            { title: '删除', key: '_id', type: 'delete' }
          ],

          rowClick: (entry, extend) => {},

          dataExtend: {}
        },
        form: {
          title: '数据库处理',
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
            this.getQDbList({
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
        this.showModal(`确定删除数据库（${entry.name}）吗？`, 'delete', entry, 'alert');
      },
      clickBatchDelete(entry) {
        var query = entry.map(function(item){
          return item.name;
        }).join(',');
        this.showModal(`确定批量删除数据库（${query}）吗？`, 'batch-delete', {
          list: entry,
          query: query
        }, 'alert');
      },
      doSure(){
        var name = BaseUtil.getUrlParam('name');
        switch (this.modal.action) {
          case 'delete':
            this.doDbDelete({
              entry: this.modal.entry,
              dbTableData: this.dbTableData
            });
            break;
          case 'batch-delete':
            this.batchDbDelete({
              query: this.modal.entry.query,
              entry: this.modal.entry.list,
              dbTableData: this.dbTableData
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
            this.modal.dbTableData = dbTableData;
            break;
          case 'batch-delete':
            this.modal.message = mes;
            this.modal.entry = entry;
            this.modal.dbTableData = dbTableData;
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
      this.getDbList();
    }
  }
</script>
