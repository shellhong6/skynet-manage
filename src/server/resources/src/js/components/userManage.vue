<template>
  <div>
    <section class="content-header">
    </section>
    <section class="content">
      <box>
        <div slot="title">
          账号管理
        </div>
        <span slot="btn" @click="clickAdd">添加</span>
        <div slot="body">
          <data-table
            :columns="userTable.columns"
            :data="userTableData.data"
            :data-extend="userTable.dataExtend"
            :opts="userTable.opts"
            :row-click="userTable.rowClick">
          </data-table>
          <pagination :total="userTableData.total" :curr.sync="userTableData.cur" :size="userTableData.size" :page-action='userTable.pageAction'></pagination>
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
        <template v-if='modal.type=="add_user"'>
          <form-group :valid.sync="modal.add_user.valid">
            <div class="form-group">
              <label class="control-label">角色</label>
              <p>
                <v-select label="角色" :value.sync="modal.add_user.role.value" :options="modal.add_user.role.options" options-label="name" options-value="name" limit="3" justified required clear-button close-on-select></v-select>
              </p>
            </div>

            <bs-input label="用户名" :value.sync="modal.add_user.name" required></bs-input>
            <bs-input label="密码" type="password" :value.sync="modal.add_user.password" required></bs-input>
          </form-group>
        </template>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="modal.show = false">{{modal.cancelText || '取消'}}</button>
        <button type="button" class="btn btn-success"  :disabled="modal.type != 'alert' && !modal.add_user.valid" @click="doSure">{{modal.sureText || '确定'}}</button>
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
    getUsers,
    getRoles,
    doUserDelete,
    doUserAdd
  } from '../vuex/actions';
  import {
    userTableData,
    roleTableData
  } from '../vuex/getters';
  import { modal, popover, formGroup, input as bsInput, select as vSelect} from 'vue-strap';

  const SIZE = 20;

  export default {
    name: 'userManage',

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
        userTableData,
        roleTableData
      },
      actions: {
        getUsers,
        getRoles,
        doUserDelete,
        doUserAdd
      }
    },

    data() {
      return {
        timeLineOpt: null,
        memoryOpt: null,
        resourcesWithTypeOpt: null,
        resourcesWithDomainOpt: null,
        pvOpt: null,
        userTable: {
          size: SIZE,
          pageAction: 'getUsers',
          columns: [
            {title: '名称', key: 'name'},
            {title: '角色', key: 'role'}
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
          type: 'add_user',
          add_user: {
            valid: false,
            role: {
              options: [],
              val: ''
            },
            name: '',
            password: ''
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
      roleTableData(val){
        this.modal.add_user.role.value = val[0].name;
        this.modal.add_user.role.options = val;
      }
    },

    methods: {
      clickDelete(entry) {
        this.showModal('确定删除该用户吗？', 'delete', entry, 'alert');
      },
      clickAdd(){
        this.showModal('', 'add_user', null, 'add_user');
      },
      doSure(){
        var name = BaseUtil.getUrlParam('name');
        switch (this.modal.action) {
          case 'delete':
            this.doUserDelete({
              id: this.modal.id,
              cur: this.userTableData.cur,
              pageSize: SIZE
            });
            break;
          case 'add_user':
            this.doUserAdd({
              name: this.modal.add_user.name,
              password: this.modal.add_user.password,
              role: this.modal.add_user.role.value,
              cur: this.userTableData.cur,
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
          case 'add_user'://do nothing
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
      this.getUsers({
        cur: 1,
        pageSize: SIZE
      });
      this.getRoles();
    }
  }
</script>
