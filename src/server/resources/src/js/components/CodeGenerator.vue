<template>
  <div>
    <section class="content-header">
      <h1>代码生成</h1>
    </section>
    <section class="content">
      <form-box :form="form" :buttons="buttons" :bodybtns="bodybtns"></form-box>
      <box>
        <span slot="title">外链方式</span>
        <div slot="body">
          <pre>
            <code class="html"></code>
        </pre>
        </div>
      </box>
      <box>
        <span slot="title">内联代码</span>
        <div slot="body">
          <pre>{{jsCodeContent}}</pre>
        </div>
      </box>
    </section>

    <alert
      :show.sync="alert.show"
      :duration="alert.duration"
      :type="alert.type"
      width="400px"
      placement="top"
      dismissable>
      <span v-bind:class="['alert-icon-float-left', alert.className]"></span>
      <p>{{alert.message}}</p>
    </alert>
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
  import Box from '../plugins/Box.vue';
  import {
    getCode
  } from '../vuex/actions';
  import {
    jsCodeContent
  } from '../vuex/getters';
  import { modal, alert} from 'vue-strap';

  export default {
    name: 'CodeGenerator',

    components: {
      FormBox,
      Box,
      modal,
      alert
    },

    vuex: {
      getters: {
        jsCodeContent: jsCodeContent
      },
      actions: {
        getCode
      }
    },

    data() {
      return {
        form: {
          title: '标识填写',
          fields: [
            { title: '项目标识', name: 'projectCode', type: 'text' },
            { title: '邮箱', name: 'emails', type: 'text', value: '群殴bug <wd_front@meizu.com>', width: 5, titleW: 2, conW: 10},
            {
              title: '查看权限',
              type: 'select',
              value: 'onlyme',
              options: [{
                key: '只有自己可看',
                value: 'onlyme'
              },
              {
                key: '所有人可看',
                value: 'anyone'
              }]
            }
          ]
        },

        bodybtns: [
          { type: 'create_type', text: '确定', className: 'btn-primary', width: 1 }
        ],

        modal: {
          types: {
            show: false
          },
          baseData: {
            show: false
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
      ['buttons:trigger'] (type, $el, params) {
        if (type == 'create_type') {
          params.owner = this.form.fields[2].value;
          this.getCode(params);

          var snippet = document.querySelector('pre code.html');
          snippet.innerHTML = '&lt;!--\n' +
          '  data-project: 项目唯一标识\n' +
          '  data-auto: 是否在onload事件中自动上报（true or false，默认为true）\n' +
          '  data-bro: 是否上报浏览器类型（true or false，默认为false，在有分享功能的页面开启）\n' +
          '  设置data-auto为false, 然后显式调用api进行上报参考代码：\n' +
          '     if(window._MONITOR){\n' +
          '        window._MONITOR.reportBase();\n' +
          '        window._MONITOR.reportResources();\n' +
          '      }\n' +
          '--&gt;\n' +
          '&lt;!--默认引入方式--&gt;\n' +
          `&lt;script src=&quot;https://i3.mzres.com/resources/appStore/skynet.js&quot; charset=&quot;utf-8&quot; data-type=&quot;skynet&quot; data-project=&quot;${params.projectCode}&quot;&gt;&lt;/script&gt;` +
          '\n' +
          '&lt;!--分享出去的页面或者你希望统计载体类型的情况下，引入方式--&gt;\n' +
          `&lt;script src=&quot;https://i3.mzres.com/resources/appStore/skynet.js&quot; charset=&quot;utf-8&quot; data-type=&quot;skynet&quot; data-project=&quot;${params.projectCode}&quot; data-bro=&quot;true&quot;&gt;&lt;/script&gt;`;
          hljs.highlightBlock(snippet);
        }
      }
    },

    watch: {},

    methods: {},

    route: {
      data() {}
    },

    created() {}

  }
</script>
