exports.Helper = {
    getParams: function() {
        // var str = window.location.search.substr(1);
        var str = window.location.href, pos, newStr;
        pos = str.indexOf("?");
        newStr = str.substring(pos+1, str.length);
        var map = {};
        if (!newStr) return map;
        var params = newStr.split('&');
        params.map(function(param) {
            var pair = param.split('=');
            if (pair[0] in map) {
                map[pair[0]] = [map[pair[0]], decodeURIComponent(pair[1])];
            } else {
                map[pair[0]] = decodeURIComponent(pair[1]);
            }
        });
        return map;
    },
    checkEndTime: function(endTime){
        //判断是否超过当前日期
        var nowTime = new Date(),
            end = endTime +" 23:59:59"; //默认加上时分秒
        if(nowTime.getTime() < new Date(end).getTime()) {
            return false;
        }
        return true;
    },
    formatPrice: function(n){
        //格式化金额，超过三位用逗号
        var str= n.split('').reverse().join('').replace(/(\d{3})/g,'$1,').replace(/\,$/,'').split('').reverse().join('');
        return str;
    },
    showFullImage: function(_img){
        //查看详情图片
       var self = this, img = new Image();
        img.src = $(_img).attr('src');
        img.onload = function(event){
            var _top, wid = img.width;
            var hei = img.height;
            if ( Math.min(wid, hei) > 600 ) {
                var minW = Math.min(wid/2.5 , $(window).width());
                var minH = Math.min(hei/3, $(window).height());
                if (minW == $(window).width()) {
                    hei = hei / (wid / minW);
                    wid = minW ;
                } else if (minH == $(window).height()) {
                    wid = minW;
                    hei = minH - 100;
                } else {
                    wid = minW;
                    hei = minH;
                }
            }
            $("body").append('<div id="imgLoading"></div><div id="imgContainer" style="display: none;">'
                + '<img id="showFullImage" alt=""/><a href="javascript:void(0);" class="closeImg"></a></div>');
            $('#imgLoading').css({height:$(document.body).height()});
            $("#showFullImage").attr({
                src: img.src,
                width: wid,
                height: hei
            });
            if($('#imgContainer').height() > 800){
                _top = $(window).scrollTop();
            }else{
                _top = ($(window).height()-hei)/2+$(window).scrollTop() - 100;
            }

            $("#imgContainer").css({
                "left": ($(window).width() - wid)/2,
                "top": _top
            }).slideDown();
            self.zoomFun('showFullImage', wid, hei);
            self.closeFn('closeImg');
            event.preventDefault();
        };
    },
    zoomFun: function (id, width, height) {
        if(width > 150 && height > 150) {
            $('#' + id).uberZoom({
                width: width,
                height: height,
                fullscreen: true,
                navigator: true,
                navigatorImagePreview: true
            });
        }
        $("#imgContainer").Tdrag({
            scope:".wrapper"
        });
    },
    closeFn: function (_class) {
        $("."+ _class).off('click').on("click",function () {
            $("#imgContainer").fadeOut();
            $("#imgContainer, #imgLoading").remove();
            $(document.body).css("overflow","auto");
        });
    },
    numCheck (_a){
        //只允许输入数字
        $(_a).val($(_a).val().replace(/\D/g,''));
    },
    pointCheck (_a){
        //只允许输入小数,保证只有一位小数点
        $(_a).val($(_a).val().replace(/[^\d.]/g,'').replace(/^\./g,"").
        replace(/\.{2,}/g,".").replace(".","$#$").replace(/\./g,"").replace("$#$","."));
    }
};

exports.Helper.params = exports.Helper.getParams();

exports.Helper.getParam = function(key) {
    return exports.Helper.params[key];
};
