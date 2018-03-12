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
