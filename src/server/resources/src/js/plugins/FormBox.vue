<template>
  <div class="box box-info">
    <div class="box-header with-border">
      <h3 class="box-title">{{ form.title }}</h3>
    </div>
    <div class="box-body">
      <form class="form-horizontal" v-el:form>
        <div class="form-group">
          <template v-for="(index, filed) in form.fields">
            <template v-if="filed.type == 'hidden'">
              <input type="hidden" name="{{ filed.name }}" value="{{ filed.value }}"  />
            </template>
            <div v-if="!filed.hidden" class="col-sm-{{filed.width || 3}}">
              <div class="row">
                <div class="col-sm-12" v-if="filed.filter =='true'">
                    <label class="col-sm-4 control-label">{{ filed.title }}</label>
                </div>
                <label class="col-sm-{{filed.titleW || 4}} control-label" v-if="filed.filter !='true'">{{ filed.title }}</label>
                <div class="col-sm-{{filed.conW || 8}}" v-if="filed.filter !='true'">
                  <template v-if="filed.type == 'text'">
                    <input type="text" class="form-control j-filed-text"
                      placeholder="{{ filed.placeholder }}"
                      name="{{ filed.name }}" value="{{ filed.value }}" v-model='filed.value'/>
                  </template>
                  <template v-if="filed.type == 'textarea'">
                    <textarea class="form-control j-filed-text" v-model='filed.value'
                      name="{{ filed.name }}">{{ filed.value}}</textarea>
                  </template>
                  <template v-if="filed.type == 'number'">
                    <input type="number" class="form-control j-filed-number"
                      placeholder="{{ filed.placeholder }}"
                      name="{{ filed.name }}" value="{{ filed.value }}" />
                  </template>
                  <template v-if="filed.type == 'select'">
                    <v-select :value.sync='filed.value' :label="filed.label" :options="filed.options" options-label="key" options-value="value" limit="3" justified required clear-button close-on-select></v-select>
                  </template>
                  <template v-if="filed.type == 'datepicker'">
                    <datepicker :value.sync="filed.value" :disabled-days-of-week="disabled" :format="filed.format" :clear-button="clear" :placeholder="filed.placeholder"></datepicker>
                  </template>
                </div>
              </div>
            </div>
          </template>
          <template v-for="btn in bodybtns">
            <div class='col-sm-{{btn.width || 3}}'>
              <button type="button" v-bind:class="['btn', 'pull-right', btn.className ? btn.className : 'btn-info']"
                @click="trigger($event, btn.type)" data-loading-text="{{btn.loading}}">
                {{btn.text}}
              </button>
            </div>
          </template>
        </div>
      </form>
    </div>
    <div class="box-footer" v-if='buttons.length'>
      <template v-for="btn in buttons">
        <button type="button" v-bind:class="['btn', 'pull-right', btn.className ? btn.className : 'btn-info']"
          @click="trigger($event, btn.type)" data-loading-text="{{btn.loading}}">
          {{btn.text}}
        </button>
      </template>
      <button type="button" class="btn btn-info pull-right" v-on:click="query" v-if='form.isQuery'>查询</button>
    </div>
  </div>
</template>

<script>
  import Config from '../config';
  import * as Api from '../vuex/api';
  import moment from 'moment';
  import PosCascadeMenu from './PosCascadeMenu.vue';
  import DropdownAjax from './DropdownAjax.vue';
  import {select as vSelect, datepicker} from 'vue-strap';

  export default {
    name: 'FormBox',

    components: {
      PosCascadeMenu,
      DropdownAjax,
      vSelect,
      datepicker
    },

    props: {
      form: {
        type: Object,
        required: true
      },

      buttons: {
        type: Array,
        default: function() {
          return [];
        }
      },

      bodybtns: {
        type: Array,
        default: function() {
          return [];
        }
      }
    },

    data: function() {
      return {
        title: '查询',
        fields: [],
        content_id: '',
        position_ids: [],
      }
    },

    watch: {
      content_id(val) {
        this.updateFormFiled('content_id', val);
      },
    },

    methods: {
      query(e) {
        let params = $(this.$els.form).serializeObject();
        this.form.fields.forEach((f) => {
            if(f.type == 'date') { //日期，需要补全 yyyy-mm-dd 格式；若是yyyy-mm，则以 01 结尾 -- by klj
                ['name','startName','endName'].forEach((name) => { //查找name
                    if(f[name]) {
                        if(params[f[name]] && params[f[name]].length < 10) {
                            params[f[name]] += '-01';
                        }
                    }
                })
            }
        });

        this.$dispatch('formbox:query', params);
      },

      dropdown(index, entry) {
        this.form.fields[index].selected = entry;
      },

      trigger(e, type) {
        let params = $(this.$els.form).serializeObject();
        this.form.fields.forEach((f) => {
            if(f.type == 'date') { //日期，需要补全 yyyy-mm-dd 格式；若是yyyy-mm，则以 01 结尾 -- by klj
                ['name','startName','endName'].forEach((name) => { //查找name
                    if(f[name]) {
                        if(params[f[name]] && params[f[name]].length < 10) {
                            params[f[name]] += '-01';
                        }
                    }
                })
            }
        });
        this.$dispatch('buttons:trigger', type, $(e.target), params);
      },

      // 修复时间段不能用的bug
      updateFormFiled(key, val, name='name',value='value') {
        this.form.fields.map((d, index, arr) => {
          if (d[name] == key) {
            arr[index][value] = val;
          }
        });
      },

      changeDateRangeRadio(e, val, refs) {
        //TODO 支持引用元素
        let [d, t] = val.split(',');
        // vue 的数据绑定不work??? -- by klj
        // this.updateFormFiled('start_time', moment().add(d, t).format('YYYY-MM-DD'),'startName','startValue');
        // this.updateFormFiled('end_time', moment().add(-1, 'days').format('YYYY-MM-DD'),'endName','endValue');
        $(this.$els.form).find('.j-filed-date input').each(function(i,el) {
            if(i == 0) {
                $(this).datepicker('setDate',moment().add(d, t).format('YYYY-MM-DD'));
            } else if(i == 1) {
                $(this).datepicker('setDate',moment().add(-1, 'days').format('YYYY-MM-DD'));
            }
        });
      },

      changeRadioField(e, field, checkedEntry) {
          this.$dispatch('radio:check', checkedEntry, field, e);
      }
    },

    events: {
        // 构建日期格式 -- by klj
        switchDatepickerStyle(onlyMonth, names = []) {
            if(toString.call(names) == '[Object String]') { //改成数组
                names = [names];
            }

            if(onlyMonth) {
                $(this.$els.form).find('.j-filed-date input').each(function(i,el) {
                    if(names.length == 0 || names.indexOf(this.name)) {
                        $(this).datepicker('resetConfig',{startView: "months",minViewMode: "months",format:'yyyy-mm'});
                        // 重置一个月
                        if(i == 0) {
                            $(this).datepicker('setDate',moment().add(-1, 'months').format('YYYY-MM'));
                        } else if(i == 1) {
                            $(this).datepicker('setDate',moment().format('YYYY-MM'));
                        }
                    }
                });
            } else {
                $(this.$els.form).find('.j-filed-date input').each(function(i,el) {
                    if(names.length == 0 || names.indexOf(this.name)) {
                        $(this).datepicker('resetConfig',{startView: "days",minViewMode: "days",format:'yyyy-mm-dd'});
                        // 重置7天
                        if(i == 0) {
                            $(this).datepicker('setDate',moment().add(-7, 'days').format('YYYY-MM-DD'));
                        } else if(i == 1) {
                            $(this).datepicker('setDate',moment().add(-1, 'days').format('YYYY-MM-DD'));
                        }
                    }
                });
            }
        }
    },

    ready() {
      let self = this;
      $(this.$els.form).find('.j-filed-date').datepicker({
        language: "zh-CN",
        format: "yyyy-mm-dd",
        defaultDate: "+1w",
        autoclose: true,
        todayHighlight: true,
      });

      $(this.$els.form).find('.j-input-select').each(function() {
        let url = '';
        let ref = $(this).data('ref') || 'content_id';
        let $input = $(this);

        let $ref = $(self.$els.form).find(`input[name="${ref}"]`);

        $ref.on('blur', function() {
          $input.val('');
          $input.trigger('change');
        });

        switch ($(this).data('type')) {
          case 'apps': url = '/console/app/query'; break;
          case 'keyword': url = '/console/keywords/query'; break;
          case 'sponsor': url = '/console/sponsor/query'; break;
        }

        $(this).on('select2:select', function(e) {
          let data = e.params.data || {};
          $ref.val(data.id);
        });

        $(this).select2({
          ajax: Api.ajaxOpts({
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {
              return {
                name: params.term,
              };
            },
            processResults: function (data, params) {
              let r = [];
              if (data.code == 200) {
                r = data.value.map(d => {
                  return {
                    id: d.id,
                    text: d.name,
                  };
                });
              }

              return {
                results: r,
              };
            },
          }),
          minimumInputLength: 1,
        });
      });
    }
  }
</script>
