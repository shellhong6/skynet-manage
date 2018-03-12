<template>
  <div class="btn-group">
    <button type="button" class="btn btn-default">{{selected.key}}</button>
    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false" :disabled="disabled">
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" role="menu">
      <li v-for="entry in vals">
        <a href="javascript:;" @click="select(entry)">{{entry.key}}</a>
      </li>
    </ul>
    <input type="hidden" name="{{name}}" value="{{selected.val}}" />
  </div>
</template>

<script>
  import * as Api from '../vuex/api';

  export default {
    name: 'DropdownAjax',

    props: {
      name: {
        type: String,
        required: true,
      },

      selected: {
        type: Object,
        default: function() {
          return {
            key: '',
            val: '',
          };
        },
      },

      vals: {
        type: Array,
        default: function() {
          return [];
        },
      },

      url: {
        type: String,
        default: '',
      },

      data: {
        type: Object,
        default: function() {
          return {};
        },
      },

      type: {
        type: String,
        default: '',
      },

      disabled: {
          type: Boolean,
          default: false
      }
    },

    data() {
      return {

      }
    },

    methods: {
      select(entry) {
        this.selected = entry;
      },
    },

    ready() {
      let url = this.url;

      if (!url) {
        switch (this.type) {
          case 'algorithm_version':
            url = '/console/stat/algorithm/versions'
            break;
        }
      }

      Api.ajax({
        url,
        data: this.data,
      }).done(res => {
        if (res.code == 200) {
          if(this.selected.val === '' && res.value && res.value.length > 0) { //没有默认值，选第一个
              this.selected.val = res.value[0].val;
          }
          this.vals = [].concat(this.vals, (res.value || []).map(d => {
            if (this.type == 'algorithm_version') {
              return {
                key: d.alias_name,
                val: d.name,
              }
            }

            // 无key时，从val中查找出来
            if(d.val === this.selected.val) {
                this.selected.key = d.key;
            }

            return d;
          }));
        }
      });
    },
  }
</script>
