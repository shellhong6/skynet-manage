<template>
  <div>
    <section class="content-header">
    </section>
    <section class="content">
      <box>
        <span slot="title">基础数据</span>
        <div slot="body">
            <div class='row'>
              <div class="col-md-6">
                <template v-if='timeLine && timeLine.length'>
                  <div class="box box-solid box-default">
                    <div class="box-header">
                      <h3 class="box-title">加载时间(秒)</h3>
                      <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                      </div>
                    </div>
                    <div class="box-body">
                      <chart :opt='timeLineOpt' chart='timeLineCanvas' width="400" height="200"></chart>
                    </div>
                  </div>
                </template>
                <template v-if='memory && memory.length'>
                  <div class="box box-solid box-default">
                    <div class="box-header">
                      <h3 class="box-title">js heap(MB)</h3>
                      <popover trigger='hover' effect="fade" placement="top" title="js heap" content='usedJsHeapSize is the total amount of memory being used by JS objects including V8 internal objects, <br/>totalJsHeapSize is current size of the JS heap including free space not occupied by any JS objects. <br/>This means that usedJsHeapSize can not be greater than totalJsHeapSize. <br/><br/>Note that it is not necessarily that there has ever been totalJsHeapSize of alive JS objects.<br>The values are quantized as to not expose private information to attackers. <br><br>If Chrome is run with the flag `--enable-precise-memory-info` the values are not quantized.'>
                        <button class='helpBtn'>?</button>
                      </popover>
                      <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                      </div>
                    </div>
                    <div class="box-body">
                      <chart :opt='memoryOpt' chart='memoryCanvas' width="400" height="200"></chart>
                    </div>
                  </div>
                </template>
                <template v-if='resources && resources.length'>
                  <div class="box box-solid box-default">
                    <div class="box-header">
                      <h3 class="box-title">域名情况(秒/次)</h3>
                      <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                      </div>
                    </div>
                    <div class="box-body">
                      <chart :opt='resourcesWithDomainOpt' chart='domainCanvas' width="400" height="200"></chart>
                    </div>
                  </div>
                </template>
              </div>
              <div class="col-md-6">
                <template v-if='pv && pv.length'>
                  <div class="box box-solid box-default">
                    <div class="box-header">
                      <h3 class="box-title">页面访问情况(次)</h3>
                      <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                      </div>
                    </div>
                    <div class="box-body">
                      <chart :opt='pvOpt' chart='pvCanvas' width="400" height="200"></chart>
                    </div>
                  </div>
                </template>
                <template v-if='resources && resources.length'>
                  <div class="box box-solid box-default">
                    <div class="box-header">
                      <h3 class="box-title">资源情况(秒)</h3>
                      <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                      </div>
                    </div>
                    <div class="box-body">
                      <chart :opt='resourcesWithTypeOpt' chart='resourcesCanvas' width="400" height="200"></chart>
                    </div>
                  </div>
                </template>
              </div>
            </div>
        </div>
      </box>
      <box>
        <span slot="title">异常数据</span>
        <div slot="body">
            <div class='row'>
              <div class="col-md-12">
                <template v-if='jsErrorTableData.total'>
                  <div class="box box-solid box-default">
                    <div class="box-header">
                      <h3 class="box-title">js错误日志</h3>
                      <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                      </div>
                    </div>
                    <div class="box-body">
                      <data-table
                        :columns="jsErrorTable.columns"
                        :data="jsErrorTableData.data"
                        :data-extend="jsErrorTable.dataExtend"
                        :opts="jsErrorTable.opts"
                        :row-click="jsErrorTable.rowClick">
                      </data-table>
                      <pagination :total="jsErrorTableData.total" :curr.sync="jsErrorTableData.cur" :size="jsErrorTableData.size" :page-action='jsErrorTable.pageAction'></pagination>
                    </div>
                  </div>
                </template>
                <template v-if='slowTimingTableData.total'>
                  <div class="box box-solid box-default">
                    <div class="box-header">
                      <h3 class="box-title">页面慢加载</h3>
                      <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                      </div>
                    </div>
                    <div class="box-body">
                      <data-table
                        :columns="slowTimingTable.columns"
                        :data="slowTimingTableData.data"
                        :data-extend="slowTimingTable.dataExtend"
                        :opts="slowTimingTable.opts"
                        :row-click="slowTimingTable.rowClick">
                      </data-table>
                      <pagination :total="slowTimingTableData.total" :curr.sync="slowTimingTableData.cur" :size="slowTimingTableData.size" :page-action='slowTimingTable.pageAction'></pagination>
                    </div>
                  </div>
                </template>
                <template v-if='bigMemoryTableData.total'>
                  <div class="box box-solid box-default">
                    <div class="box-header">
                      <h3 class="box-title">js heap占用大</h3>
                      <popover trigger='hover' effect="fade" placement="top" title="js heap" content='usedJsHeapSize is the total amount of memory being used by JS objects including V8 internal objects, <br/>totalJsHeapSize is current size of the JS heap including free space not occupied by any JS objects. <br/>This means that usedJsHeapSize can not be greater than totalJsHeapSize. <br/><br/>Note that it is not necessarily that there has ever been totalJsHeapSize of alive JS objects.<br>The values are quantized as to not expose private information to attackers. <br><br>If Chrome is run with the flag `--enable-precise-memory-info` the values are not quantized.'>
                        <button class='helpBtn'>?</button>
                      </popover>
                      <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                      </div>
                    </div>
                    <div class="box-body">
                      <data-table
                        :columns="bigMemoryTable.columns"
                        :data="bigMemoryTableData.data"
                        :data-extend="bigMemoryTable.dataExtend"
                        :opts="bigMemoryTable.opts"
                        :row-click="bigMemoryTable.rowClick">
                      </data-table>
                      <pagination :total="bigMemoryTableData.total" :curr.sync="bigMemoryTableData.cur" :size="bigMemoryTableData.size" :page-action='bigMemoryTable.pageAction'></pagination>
                    </div>
                  </div>
                </template>
              </div>
            </div>
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
        {{{modal.message}}}
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
  import ChartUtil from '../util/utils/chartUtil.js';
  import Pagination from '../plugins/Pagination.vue';
  import DataTable from '../plugins/DataTable.vue';
  import {
    getTimeLine,
    getMemory,
    getResources,
    getPv,
    getJsErrorTableData,
    getSlowTimingTableData,
    getBigMemoryTableData,
    doJsErrorSolve
  } from '../vuex/actions';
  import {
    timeLine,
    memory,
    resources,
    pv,
    jsErrorTableData,
    slowTimingTableData,
    bigMemoryTableData
  } from '../vuex/getters';
  import { modal, popover } from 'vue-strap';

  const SIZE = 10;

  export default {
    name: 'ProjectItem',

    components: {
      Box,
      Chart,
      modal,
      alert,
      Pagination,
      DataTable,
      popover
    },

    vuex: {
      getters: {
        timeLine,
        memory,
        resources,
        pv,
        jsErrorTableData,
        slowTimingTableData,
        bigMemoryTableData
      },
      actions: {
        getTimeLine,
        getMemory,
        getResources,
        getPv,
        getJsErrorTableData,
        getSlowTimingTableData,
        getBigMemoryTableData,
        doJsErrorSolve
      }
    },

    data() {
      return {
        timeLineOpt: null,
        memoryOpt: null,
        resourcesWithTypeOpt: null,
        resourcesWithDomainOpt: null,
        pvOpt: null,
        jsErrorTable: {
          size: SIZE,
          pageAction: 'getJsErrorTableData',
          columns: [
            {title: '名称', key: 'name'},
            {title: '描述', key: 'message'},
            {title: '数量', key: 'amount'},
            {title: '页面', key: '_page'}
          ],

          opts: [
            { title: '查看', secondTitle: '取消', key: 'stack', type: 'popover' },
            { title: '设置为解决', key: 'stack', type: 'resolve' }
          ],

          rowClick: (entry, extend) => {},

          dataExtend: {}
        },
        slowTimingTable: {
          size: SIZE,
          pageAction: 'getSlowTimingTableData',
          columns: [
            {title: '启动耗时', key: 'readyStart'},
            {title: '网络耗时', key: 'net'},
            {title: '加载耗时', key: 'load'},
            {title: '其他耗时', key: 'other'},
            {title: '上报时间', key: '_reportServerTime'}
          ],

          opts: [],

          rowClick: (entry, extend) => {},

          dataExtend: {}
        },
        bigMemoryTable: {
          size: SIZE,
          pageAction: 'getBigMemoryTableata',
          columns: [
            {title: 'used', key: 'used'},
            {title: 'total', key: 'total'},
            {title: 'limit', key: 'limit'},
            {title: '上报时间', key: '_reportServerTime'}
          ],

          opts: [],

          rowClick: (entry, extend) => {},

          dataExtend: {}
        },
        modal: {
          title: '提示',
          message: '',
          show: false,
          sureText: '确定',
          cancelText: '取消',
          id: '',
          action: ''
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
          name: name,
          cur: page,
          pageSize: pageSize
        });
      },
      'datatable:operate': function(type, key, entry){
        switch (type) {
          case 'resolve':
            this.clickResolve(entry);
            break;
          default:

        }
      }
    },

    watch: {
      timeLine(val){
        if(!val.length){
          return;
        }
        var filter = ["readyStart", "net", "load", "other"];
        this.timeLineOpt = {
          type: 'line',
          data: ChartUtil.transDataWithTime(val, filter, 'hhH', 'line')
        };
      },
      memory(val){
        if(!val.length){
          return;
        }
        var filter = ["used", "total", "limit"];
        this.memoryOpt = {
          type: 'line',
          data: ChartUtil.transDataWithTime(val, filter, 'hhH', 'line')
        };
      },
      resources(val){
        if(!val.length){
          return;
        }
        this.resourcesWithTypeOpt = {
          type: 'bar',
          data: ChartUtil.transResourcesDataWithType(val, 'bar'),
          options: {
              legend: {
                  display: false
              }
          }
        };
        this.resourcesWithDomainOpt = {
            type: 'bar',
            data: ChartUtil.transResourcesDataWithDomain(val, 'bar')
        };
      },
      pv(val){
        if(!val.length){
          return;
        }
        var filter = ["amount"];
        this.pvOpt = {
            type: 'bar',
            data: ChartUtil.transDataWithTime(val, filter, 'hhH', 'bar'),
            options: {
                legend: {
                    display: false
                }
            }
        };
      }
    },

    methods: {
      clickResolve(entry) {
        this.showModal('确定要设置为解决吗？', 'resolve', entry);
      },
      doSure(){
        var name = BaseUtil.getUrlParam('name');
        switch (this.modal.action) {
          case 'resolve':
            this.doJsErrorSolve({
              id: this.modal.id,
              name: name,
              cur: this.jsErrorTableData.cur,
              pageSize: SIZE
            });
            break;
          default:

        }
        this.modal.show = false;
      },
      trigger(e, name, type) {
        switch (type) {
          case 'project':
            location.href = `index#!/project-item-0?name=${name}`;
            break;
          default:

        }
      },
      showAlert(type, message) {
        this.alert.type = type;
        this.alert.message = message;
        this.alert.className = type == 'success' ? 'icon-ok-circled' : 'icon-info-circled';
        this.alert.show = true;
      },
      showModal(mes, type, entry) {
        this.modal.show = true;
        this.modal.message = mes;
        this.modal.action = type;
        this.modal.id = entry._id;
      }
    },

    route: {
      data() {}
    },

    created() {
      var name = BaseUtil.getUrlParam('name');
      if(name){
        this.getTimeLine({name: name});
        this.getMemory({name: name});
        this.getResources({name: name});
        this.getPv({name: name});
        this.getJsErrorTableData({
          name: name,
          cur: 1,
          pageSize: SIZE
        });
        this.getSlowTimingTableData({
          name: name,
          cur: 1,
          pageSize: SIZE
        });
        this.getBigMemoryTableData({
          name: name,
          cur: 1,
          pageSize: SIZE
        });
      }
    }
  }
</script>
