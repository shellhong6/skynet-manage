<template>
  <a href="javascript:;" :class="['btn-uploader', 'btn', className]">
    {{text}}
    <input type="file" accept="{{accept}}" v-el:file  />
  </a>
</template>

<script>
  import Config from '../config';

  export default {
    name: 'Uploader',

    props: {
      className: {
        type: String,
        default: 'btn-primary',
      },
      text: {
        type: String,
        default: '上传',
      },
      size: {
        type: Number,
        default: 8388608,
      },
      accept: {
        type: String,
        default: 'image/*',
      },
      done: {
        type: Function,
        default: function() {},
      },
    },

    data() {
      return {

      }
    },

    ready() {
      $(this.$els.file).fileupload({
        dataType: 'json',
        paramName: 'Filedata',
        type: 'POST',
        url: Config.host + '/common/upload',
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        done: (e, data) => {
          let res = data.jqXHR.responseJSON;
          let err = null;
          let r = null;
          let o = null;

          if (res.code == 200) {
            let obj = res.value[0];
            let url = obj.url;
            url = `${Config.host}/upload/${url}`;
            r = url;
            o = obj;
          } else {
            err = 'server';
            r = res;
          }
          this.done(err, r, o);
        }
      });

      $(this.$els.file).on('fileuploadsend', (e, data) => {
        if (data && data.files && data.files[0]) {
          if (data.files[0].size >= this.size) {
            this.done('size');
            return false;
          }
        }
      });
    },
  }
</script>
