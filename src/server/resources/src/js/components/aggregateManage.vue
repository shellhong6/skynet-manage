<template>
  <div>
    <section class="content">
      <form-box :form="form" :buttons="buttons" :bodybtns="bodybtns"></form-box>
      <box>
        <span slot="title">数据生成</span>
        <div slot="body">
          <data-table
            :columns="aggregateTable.columns"
            :data="aggregateTableData"
            :data-extend="aggregateTable.dataExtend"
            :opts="aggregateTable.opts"
            :row-click="aggregateTable.rowClick">
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

<style lang="less">
  pre{
    max-height: 300px;
    white-space: normal;
  }
</style>
<script>
  import FormBox from '../plugins/FormBox.vue';
  import BaseUtil from '../util/utils/baseUtil.js';
  import Box from '../plugins/Box.vue';
  import DataTable from '../plugins/DataTable.vue';
  import {
    doAggregate,
    doAggregateDelete
  } from '../vuex/actions';
  import {
    aggregateTableData
  } from '../vuex/getters';
  import { modal} from 'vue-strap';

  var aggregateMap = {
    '已解决bug': {
      aggregateCode: JSON.stringify([
        {'$match': {'solve': true}},
        {'$limit': 20},
        {'$project': {'id': '$_id', '_id': 0, '_page': 1, 'stack': 1, 'amount': 1}}
      ]),
      type: 'job-jsError',
      project: 'appstore-welfare'
    },
    '实时pv': {
      aggregateCode: JSON.stringify([
        {'$group': {'_id': {'page': '$_page', 'search':'$_search'}, 'count': {'$sum': 1}}},
        {'$project': {'count': 1, '_page': '$_id.page', '_search': '$_id.search', '_id': 0}}
      ]),
      type: 'timing',
      project: 'appstore-welfare-' + BaseUtil.formatTime(Date.now(), 'yyyyMd')
    },
    '页面pv': {
      aggregateCode: JSON.stringify([
        {'$match': {'_reportServerTime': {'$gt': 1483434021608, '$lt': 2483434021610}}},
        {'$group': {'_id': {'page': '$_page', 'search':'$_search'}, 'count': {'$sum': 1}}},
        {'$project': {'count': 1, '_page': '$_id.page', '_search': '$_id.search', '_id': 0}}
      ]),
      type: 'job-pv',
      project: 'appstore-welfare'
    },
    '实时report': {
      aggregateCode: JSON.stringify([
        {'$match': {'_reportServerTime': {'$gt': 1490950800000}}},
        {'$group': {'_id': {'baseInfo': '$baseInfo'}, 'count': {'$sum': 1}}},
        {'$project': {'count': 1, 'baseInfo': '$_id.baseInfo', '_id': 0}}
      ]),
      type: 'report',
      project: 'appStore-collections'
    },
    '页面分类': {
      aggregateCode: JSON.stringify([
        {'$group': {'_id': {'page': '$_page'}, 'count': {'$sum': 1}}},
        {'$project': {'count': 1, 'page': '$_id.page', '_id': 0}}
      ]),
      type: 'timing',
      project: 'appStore-collections-2017411'
    }
  };

  export default {
    name: 'CodeGenerator',

    components: {
      FormBox,
      Box,
      modal,
      alert,
      DataTable
    },

    vuex: {
      getters: {
        aggregateTableData
      },
      actions: {
        doAggregate,
        doAggregateDelete
      }
    },

    data() {
      var one = null;
      var options = Object.keys(aggregateMap).map(function(item){
        one = aggregateMap[item];
        return {
          key: item,
          value: one.aggregateCode,
          type: one.type,
          project: one.project
        };
      });
      return {
        aggregateTable: {
          columns: [
            {title: '名称', key: 'name'},
            {title: '角色', key: 'role'}
          ],

          opts: [
            { title: '删除', key: '_id', type: 'delete' }
          ],
        },
        form: {
          title: 'aggregate管理',
          fields: [
            {
              title: '条件选择',
              titleW: 1,
              conW: 11,
              width: 12,
              type: 'select',
              value: options[0].value,
              options: options
            },
            {
              title: 'type',
              titleW: 1,
              conW: 11,
              width: 12,
              name: 'type',
              type: 'text',
              value: options[0].type || ''
            },
            {
              title: 'project',
              titleW: 1,
              conW: 11,
              width: 12,
              name: 'project',
              type: 'text',
              value: options[0].project || ''
            },
            {
              title: 'aggregate',
              titleW: 1,
              conW: 11,
              width: 12,
              name: 'aggregateCode',
              type: 'textarea',
              value: options[0].value
            }
          ]
        },

        bodybtns: [
          { type: 'create_type', text: '确定', className: 'btn-primary', width: 12}
        ],

        modal: {
          message: '',
          show: false,
          sureText: '确定',
          cancelText: '取消',
          id: '',
          action: '',
          type: 'alert'
        }
      }
    },

    events: {
      ['buttons:trigger'] (type, $el, params) {
        if (type == 'create_type') {
          this.doAggregate(params);
        }
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
      'form.fields[0].value'(newVal){
        this.setForm(newVal);
      },
      aggregateTableData(newVal){
        var columns = [],
            isId = false,
            opts = [];
        if(newVal.length){
          columns = Object.keys(newVal[0]).map(function(item){
            if(item == 'id'){
              isId = true;
            }
            return {
              title: item,
              key: item
            }
          });
          if(isId){
            opts.push({ title: '删除', key: 'id', type: 'delete' });
          }
          this.aggregateTable = {
            columns,
            opts
          };
        }
      }
    },

    methods: {
      setForm(val){
        var one = null;
        Object.keys(aggregateMap).forEach((item) => {
          one = aggregateMap[item];
          if(one.aggregateCode == val){
            this.form.fields.forEach(function(formItem, index){
              if(index != 0){
                formItem.value = one[formItem.name];
              }
            });
          }
        });
      },
      clickDelete(entry) {
        this.showModal('确定删除该记录吗？', 'delete', entry, 'alert');
      },
      doSure(){
        var name = BaseUtil.getUrlParam('name');
        switch (this.modal.action) {
          case 'delete':
            this.doAggregateDelete({
              entry: this.modal.entry,
              aggregateTableData: this.aggregateTableData,
              otherInfo: this.modal.otherInfo
            });
            break;
          default:

        }
        this.modal.show = false;
      },
      showModal(mes, action, entry, type) {
        switch (action) {
          case 'delete':
            var _type = this.form.fields[1].value,
                _project = this.form.fields[2].value;
            this.modal.message = `确定删除该记录(type:${_type},project:${_project},id:${entry.id})吗？`;
            this.modal.entry = entry;
            this.modal.otherInfo = {
              type: _type,
              project: _project
            }
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
    }
  }
</script>
