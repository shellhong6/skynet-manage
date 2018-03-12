<template>
  <div>
    <section class="content-header">
    </section>
    <section class="content">
      <box>
        <div slot="title">
          项目管理
        </div>
        <div slot="body">
          <data-table
            :columns="projectTable.columns"
            :data="projects"
            :data-extend="projectTable.dataExtend"
            :opts="projectTable.opts"
            :row-click="projectTable.rowClick">
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
        <template v-if='modal.type=="edit_project"'>
          <form-group :valid.sync="modal.edit_project.valid">
            <div class="form-group">
              <label class="control-label">归属</label>
              <p>
                <v-select label="归属" :value.sync="modal.edit_project.owner.value" :options="modal.edit_project.owner.options" options-label="name" options-value="name" limit="3" justified required clear-button close-on-select></v-select>
              </p>
            </div>

            <bs-input label="名称" :value.sync="modal.edit_project.name" required></bs-input>
            <bs-input label="邮箱" :value.sync="modal.edit_project.emails" required placeholder='张三 <zhangsan@meizu.com>,李四 <lishi@meizu.com>'></bs-input>
          </form-group>
        </template>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="modal.show = false">{{modal.cancelText || '取消'}}</button>
        <button type="button" class="btn btn-success"  :disabled="modal.type != 'alert' && !modal.edit_project.valid" @click="doSure">{{modal.sureText || '确定'}}</button>
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
    getProjects,
    getUsers,
    doProjectDelete,
    doProjectEdit
  } from '../vuex/actions';
  import {
    projects,
    userTableData
  } from '../vuex/getters';
  import { modal, popover, formGroup, input as bsInput, select as vSelect} from 'vue-strap';

  const SIZE = 20;

  export default {
    name: 'projectManage',

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
        projects,
        userTableData
      },
      actions: {
        doProjectDelete,
        doProjectEdit,
        getProjects,
        getUsers
      }
    },

    data() {
      return {
        timeLineOpt: null,
        memoryOpt: null,
        resourcesWithTypeOpt: null,
        resourcesWithDomainOpt: null,
        pvOpt: null,
        projectTable: {
          columns: [
            {title: '名称', key: 'name'},
            {title: '归属', key: 'owner'},
            {title: '邮件', key: 'emails'}
          ],

          opts: [
            { title: '修改', key: '_id', type: 'edit' },
            { title: '删除', key: '_id', type: 'delete' }
          ],

          rowClick: (entry, extend) => {},

          dataExtend: {}
        },
        modal: {
          title: '修改项目',
          message: '',
          show: false,
          sureText: '确定',
          cancelText: '取消',
          id: '',
          action: '',
          type: 'edit_project',
          edit_project: {
            valid: false,
            owner: {
              options: [],
              val: ''
            },
            name: '',
            emails: ''
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
      'datatable:operate': function(type, key, entry){
        switch (type) {
          case 'delete':
            this.clickDelete(entry);
            break;
          case 'edit':
            this.clickEdit(entry);
            break;
          default:

        }
      }
    },

    watch: {
      userTableData(val){
        var data = val.data;
        data.push({
          name: 'anyone'
        });
        this.modal.edit_project.owner.value = data[0].name;
        this.modal.edit_project.owner.options = data;
      }
    },

    methods: {
      clickDelete(entry) {
        this.showModal('确定删除该项目吗？', 'delete', entry, 'alert');
      },
      clickEdit(entry){
        this.showModal('', 'edit_project', entry, 'edit_project');
      },
      doSure(){
        var name = BaseUtil.getUrlParam('name');
        switch (this.modal.action) {
          case 'delete':
            this.doProjectDelete({
              id: this.modal.id
            });
            break;
          case 'edit_project':
            this.doProjectEdit({
              id: this.modal.id,
              name: this.modal.edit_project.name,
              emails: this.modal.edit_project.emails,
              owner: this.modal.edit_project.owner.value
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
            break;
          case 'edit_project':
            this.modal.edit_project.owner.value = entry.owner;
            this.modal.edit_project.name = entry.name;
            this.modal.edit_project.emails = entry.emails;
            break;
          default:

        }
        this.modal.id = entry._id;
        this.modal.show = true;
        this.modal.type = type;
        this.modal.action = action;

      }
    },

    route: {
      data() {}
    },

    created() {
      this.getProjects();
      this.getUsers({
        cur: 1,
        pageSize: 2000
      });
    }
  }
</script>
