<template>
  <div>
    <section class="content">
      <box class="doReportField">
        <span slot="title">个性化上报(doReport)</span>
        <div slot="body">
          <pre>
            <code></code>
          </pre>
        </div>
      </box>
      <box class="doAndroidReportField">
        <span slot="title">客户端异常处理(doAndroidReport)</span>
        <div slot="body">
          <pre>
            <code></code>
          </pre>
        </div>
      </box>
      <box class="doWarnReportField">
        <span slot="title">带钉钉通知的严重问题报警(doWarnReport)</span>
        <div slot="body">
          <pre>
            <code></code>
          </pre>
        </div>
      </box>
      <box class="importVcField">
        <span slot="title">根据授权imei，引入vConsole功能js</span>
        <div slot="body">
          <pre>
            <code></code>
          </pre>
        </div>
      </box>
    </section>
  </div>
</template>

<script>
  import { userInfo } from '../vuex/getters';
  import Box from '../plugins/Box.vue';

  export default {
    name: 'Blank',
    components: {
      Box
    },
    vuex: {
      getters: {
        userInfo
      }
    },

    data() {
      return {
      }
    },
    attached() {
      var doReportField = document.querySelector('.doReportField pre code');
      doReportField.innerHTML = `
        //当已经引入了skynet.js的情况下，可定义以下方法，用于个性化上报
        doReport(baseInfo, otherInfo) {
          var monitor = window._MONITOR;
          if(monitor && monitor.doReport){
            monitor.doReport({
              "baseInfo": baseInfo, //字符串（可为空字符串），一般用于存放类型；例如监听接口a.do的失败情况，baseInfo="a.do_error"
              "otherInfo": otherInfo //字符串（可为空字符串），一般用于存放具体数据；例如监听接口a.do的失败情况，otherInfo可用于存放网络情况或参数等
            });
          }
        }
      `;
      hljs.highlightBlock(doReportField);

      var doAndroidReportField = document.querySelector('.doAndroidReportField pre code');
      doAndroidReportField.innerHTML = `
        //当已经引入了skynet.js的情况下，客户端异常通过以下方式上报
        try {
          //客户端api调用
        } catch (err) {
          var monitor = window._MONITOR;
          if(monitor && monitor.doAndroidReport){
            monitor.doAndroidReport(
              err,
              'apiName'//客户端方法名称，根据需要进行修改
            );
          }
        }
      `;
      hljs.highlightBlock(doAndroidReportField);

      var doWarnReportField = document.querySelector('.doWarnReportField pre code');
      doWarnReportField.innerHTML = `
        //当已经引入了skynet.js的情况下，通过以下方式实现报警功能
        doWarnReport(type, detail) {
          var monitor = window._MONITOR;
          if(monitor && monitor.doWarnReport){
            monitor.doWarnReport(
              "cpd-error", //字符串，用于存放报警类型，同一类型的报警请保持此字段值的一致性
              "install-code-0"//字符串（可为空字符串），一般用于存放报警具体异常情况和相关数据
            );
          }
        }
      `;
      hljs.highlightBlock(doWarnReportField);

      var importVcField = document.querySelector('.importVcField pre code');
      importVcField.innerHTML = `
        //根据授权imei，引入vconsole功能js；代码中，已经new了一个全局的vConsole对象
        importVc() {
          var imei = window.getImei && window.getImei() || ''; //此处依赖于skynet.js，如为引入该js，自行改写
          var scriptEl = document.createElement('script');
          scriptEl.setAttribute('src', \`//skynet.meizu.com/meizu_get_vc_js?imei=$\{imei\}\`);
          scriptEl.setAttribute('type', \`text/javascript\`);
          document.body.appendChild(scriptEl);
        }
      `;
      hljs.highlightBlock(importVcField);
    }
  }
</script>

<style>
  .welcome {
    text-align: center;
    font-size: 24px;
    height: 400px;
    line-height: 400px;
  }
</style>
