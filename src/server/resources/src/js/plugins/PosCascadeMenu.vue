<template>
  <div class="col-sm-12">
    <div class="row">
      <div class="col-sm-4">
        <div class="row">
          <label class="col-sm-4 control-label">页面</label>
          <div class="col-sm-8">
            <div class="btn-group">
              <button type="button" class="btn btn-default">{{selected.l1.name}}</button>
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" role="menu">
                <li v-for="entry in levelOne">
                  <a href="javascript:;" @click="choiceOne(entry)">{{ entry.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="row">
          <label class="col-sm-4 control-label">模块</label>
          <div class="col-sm-8">
            <div class="btn-group">
              <button type="button" class="btn btn-default">{{selected.l2.name}}</button>
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" role="menu">
                <li v-for="entry in levelTwo">
                  <a href="javascript:;" @click="choiceTwo(entry)">{{ entry.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="row">
          <label class="col-sm-4 control-label">位置</label>
          <div class="col-sm-8">
            <div class="btn-group">
              <button type="button" class="btn btn-default">{{selected.l3.name}}</button>
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" role="menu">
                <li v-for="entry in levelThree">
                  <a href="javascript:;" @click="choiceThree(entry)">{{ entry.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <input type="hidden" :name="name" :value="idsStr" />
    </div>
  </div>
</template>
<script>
  import * as Api from '../vuex/api';

  export default {
    name: 'PosCascadeMenu',

    props: {
      id: {
        type: String,
        default: '',
        twoWay: true,
      },

      ids: {
        type: Array,
        twoWay: true,
        default: function() {
          return [];
        },
      },

      idsStr: String,

      name: String,
    },

    data() {
      return {
        levelOne: [],
        levelTwo: [],
        levelThree: [],
        selected: {
          l1: { id: '', name: '全部', },
          l2: { id: '', name: '全部', },
          l3: { id: '', name: '全部', },
        },
        bill: {},
      }
    },

    watch: {
      ids(val) {
        this.idsStr = JSON.stringify(val);
      },
    },

    methods: {
      choiceOne(page) {
        let levelTwo = [];
        let ids = [];

        if (page.id != 0) {
          levelTwo.push({ id: 0, name: '全部', });
          for (var mod in page.modules) {
            levelTwo.push(page.modules[mod]);
            for (var p in page.modules[mod]['pos']) {
              ids.push(parseInt(p));
            }
          }
        } else {

        }

        this.levelTwo = levelTwo;
        this.levelThree = [];
        this.selected.l1 = {id: page.id, name: page.name};
        this.selected.l2 = {id: '', name: '全部'};
        this.selected.l3 = {id: '', name: '全部'};
        this.id = '';
        this.ids = ids;
      },

      choiceTwo(mod) {
        let levelThree = [];
        let ids = [];

        if (mod.id != 0) {
          levelThree.push({ id: 0, name: '全部', });
          for (var p in mod.pos) {
            levelThree.push(mod.pos[p]);
            ids.push(parseInt(p));
          }
        } else {
          let mods = this.bill[this.selected.l1.id].modules;
          for (let mod in mods) {
            for (let p in mods[mod]['pos']) {
              ids.push(parseInt(p));
            }
          }
        }

        this.levelThree = levelThree;
        this.selected.l2 = {id: mod.id, name: mod.name};
        this.selected.l3 = {id: '', name: '全部'};
        this.id = '';
        this.ids = ids;
      },

      choiceThree(pos) {
        let ids = [];

        if (pos.id != 0) {
          ids.push(pos.id);
        } else {
          this.levelThree.map(p => {
            if (p.id != 0) ids.push(p.id);
          });
        }

        this.selected.l3 = {id: pos.id, name: pos.name};
        this.id = String(pos.id);
        this.ids = [pos.id];
      },
    },

    ready() {
      let self = this;
      let billInfo = {};
      let levelOne = [];
      levelOne.push({ id: 0, name: '全部', });

      Api.get({
        url: '/console/billboard/list',
        success: function(res) {
          if (res.code == 200) {
            res.value.map(page => {
              billInfo[page.page_id] = {
                id: page.page_id,
                name: page.page_name,
                modules: [],
              };

              page.modules.map(mod => {
                billInfo[page.page_id].modules[mod.module_id] = {
                  id: mod.module_id,
                  name: mod.module_name,
                  pos: {},
                }

                mod.billBoards.map(pos => {
                  billInfo[page.page_id].modules[mod.module_id].pos[pos.id] = {
                    id: pos.id,
                    name: pos.name,
                  }
                });
              })

              levelOne.push(billInfo[page.page_id]);
            });
            self.bill = billInfo;
            self.levelOne = levelOne;
          }
        }
      });
    }
  }
</script>
