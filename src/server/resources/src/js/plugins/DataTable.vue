<template>
  <table class="table table-bordered dataTable table-simp">
    <thead>
      <tr>
        <th v-for="column in columns" title="{{column.title}}">
          {{column.title}}
        </th>
        <template v-if="opts.length > 0">
          <th>
            操作
          </th>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in data" @dblclick.stop.prevent="rowClick(entry, dataExtend)">
        <td v-for="column in columns">
          <template v-if="column.type == 'route'">
            <a v-link="column.route(entry)">{{column.title}}</a>
          </template>
          <template v-if="column.type == 'plain'">
            <span>{{column.value}}</span>
          </template>
          <template v-if="column.type == 'link'">
            <a href="javascript:;" :class="['table-link', column.disable ? 'disable' : '']" @click.stop.prevent="column.cb(entry)">
              {{entry[column.key]}}
            </a>
          </template>
          <template v-if="!column.type">
            <span title="{{ column.width ? entry[column.key] : ''}}" :style="{width: column.width ? (column.width-20)+'px': 'auto'}" :class="[column.width ? 'fitwidth': '']">
              {{ ['download_rate','consume','client_retention_rate'].indexOf(column.key) != -1 ? (entry[column.key] * 100).toFixed(2) + '%' : entry[column.key] }}
            </span>
          </template>
        </td>
        <template v-if="opts.length > 0">
          <td style="position:relative;">
            <template v-for="opt in opts">
              <template v-if="opt.type == 'popover'">
                <popover effect="fade" placement="left" title="stack" :content='entry[opt.key]'>
                  <a href="javascript:;" @click="operate(opt.type, entry[opts.key], entry, opt, $event)">
                    {{opt.title}}
                  </a>
                </popover>
              </template>
              <template v-else>
                <a href="javascript:;" @click="operate(opt.type, entry[opts.key], entry)">
                  {{opt.title}}
                </a>
              </template>
            </template>
          </td>
        </template>
      </tr>
      <tr v-if="data.length == 0">
        <td colspan="{{columns.length}}">
          <div class="empty">
            暂无数据
          </div>
        </td>
      </tr>
    </tbody>
    <tfoot v-if="showFoot">
      <tr>
        <th v-for="column in columns">
          {{foot[column.key]}}
        </th>
      </tr>
    </tfoot>
    <tfoot v-if="calcFoot">
      <tr>
        <th v-for="column in columns">
          {{footer[column.key]}}
        </th>
      </tr>
    </tfoot>
  </table>
</template>
<style>
.fitwidth {
    display:inline-block;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
}
</style>

<script>
  import { modal, alert, popover } from 'vue-strap';
  export default {
    name: 'DataTable',
    components: {
      popover
    },
    props: {
      columns: {
        type: Array,
        required: true,
        default: function() {
          return [];
        },
      },

      data: {
        type: Array,
        required: true,
        default: function() {
          return [];
        },
      },

      opts: {
        type: Array,
        default: function() {
          return [];
        },
      },

      foot: {
        type: Object,
        default: function() {
          return {};
        },
      },

      calcFoot: {
        type: Boolean,
        default: false,
      },

      footSummary: '',

      rowClick: {
        type: Function,
        default: function() {

        },
      },

      dataExtend: {
        type: Object,
        default: function() {
          return {};
        },
      },
    },

    data() {
      return {
        showFoot: false,
      }
    },

    computed: {
      showFoot() {
        return Object.keys(this.foot).length > 0
      },

      footer() {
        let obj = {};
        let nan = {};

        this.data.map(entry => {
          this.columns.map(col => {
            if (!(col.key in obj)) obj[col.key] = 0;
            if (typeof entry[col.key] == 'string' || typeof entry[col.key] == 'number') {
              try {
                let _n = Number(entry[col.key]);
                if (col.footer !== false && !isNaN(_n)) obj[col.key] += Number(entry[col.key]); //不显示在footer
                else nan[col.key] = true;
              } catch (e) { }
            }
          });
        });

        for (let p in obj) {
          if (String(obj[p]).indexOf('.') != -1) {
            obj[p] = obj[p].toFixed(2);
          }
          if (nan[p]) obj[p] = '';
          if (this.footSummary == p) obj[p] = '合计';
        }
        const isZero = v => !v || parseFloat(v) == 0;

        const fixed = v => {
          if (String(v).indexOf('.') != -1) {
            v = v.toFixed(2);
          }
          return v;
        };

        for (let p in obj) {
          if (p == 'consume') {
            if (typeof obj['recharge'] != 'undefined') {
              obj[p] = isZero(obj['recharge']) ? 0 : parseFloat(obj['cost']) / obj['recharge'];
              obj[p] = fixed(obj[p] * 100) + '%';
            } else {
              obj[p] = '';
            }
          }

          if (p == 'ecpm') {
            obj[p] = isZero(obj['exposure']) ? 0 : parseFloat(obj['cost']) * 1000 / obj['exposure'];
            obj[p] = fixed(obj[p]);
          }

          if (p == 'avg_d') {
            obj[p] = isZero(obj['download_cost']) ? 0 : parseFloat(obj['cost']) / obj['download_cost'];
            obj[p] = fixed(obj[p]);
          }

          if (p == 'download_rate') {
            obj[p] = isZero(obj['exposure']) ? 0 : parseFloat(obj['download']) / obj['exposure'];
            obj[p] = fixed(obj[p] * 100) + '%';
          }
        }

        return obj;
      },
    },

    methods: {
      operate(type, key, info, opt, $event) {
        if(opt && opt.secondTitle){
          var target = $event.target;
          if(target.innerText.replace(/^\s*|\s*$/g, '') == opt.title){
            target.innerText = opt.secondTitle;
          }else{
            target.innerText = opt.title;
          }
        }
        this.$dispatch('datatable:operate', type, key, info);
      }
    }
  }
</script>
