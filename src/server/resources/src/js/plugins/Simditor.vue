<template>
    <textarea  :id="[idName]" :class="['form-control', className]"
               data-autosave="editor-content" autofocus required>{{text}}
    </textarea>
</template>
<script>
    import Config from '../config';
    export default {
        name: 'Simditor',
        props: {
            className: {
                type: String,
                default: ''
            },
            idName: {
                type: String,
                default: 'txt-content'
            },
            text: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                chart: null
            }
        },
        ready() {
            var $preview, editor, mobileToolbar, toolbar;
            toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment'];
            mobileToolbar = ["bold", "underline", "strikethrough", "color", "ul", "ol"];
            editor = new Simditor({
                textarea: $('#'+this.idName),
                placeholder: '这里输入文字...',
                toolbar: toolbar,
                pasteImage: true,
                upload : {
                    url: Config.host + '/common/upload',
                    params: null, //键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
                    fileKey: 'fileDataFileName', //服务器端获取文件数据的参数名
                    connectionCount: 3,
                    leaveConfirm: '正在上传文件'
                }
            });
            $preview = $('#preview');
            if ($preview.length > 0) {
                return editor.on('valuechanged', function(e) {
                    return $preview.html(editor.getValue());
                });
            }

        }
    }
</script>
<style>
    @import '../../css/simditor/simditor.css';
    .simditor-body p img{
        max-width:650px;
        overflow:hidden;
    }
</style>
