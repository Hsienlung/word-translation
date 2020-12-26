$(function () {
    //给每个选项设置点击事件
    $('ul.dropdown-menu li').on('click', function () {
        $(this).parent().siblings('button').html($(this).text()+' <span class="caret"></span>');
    })

    $('#btn').on('click', function () {
        //获取翻译内容
        let content = $('#iptForm').val();
        //随机数
        let salt = Date.now();
        //签名
        let sign = md5('20201224000654956' + content + salt + 'yy8VWf7c5A460R6oLEKm');
        // 整理参数
        let data = {
            q: content,
            from: 'zh',
            to: 'en',
            appid: '20201224000654956',
            salt: salt,
            sign: sign
        }
        //转成字符串
        let dataStr = getString(data);
        //发起JSONP请求
        $.ajax({
            url: 'https://fanyi-api.baidu.com/api/trans/vip/translate'+'?'+dataStr,
            dataType:'jsonp',
            success: function (res) {
                //获取翻译内容,并渲染到页面上
                let arr = res.trans_result;
                $('#iptTo').val(arr[0].dst.toLowerCase());
                // 存储到浏览器上
                localStorage.setItem(arr[0].src, arr[0].dst.toLowerCase());
            }
        });
    });

    //封装对象转字符串函数
    function getString(data) {
        let rows = [];
        for (const key in data) {
            rows.push(key +'='+ data[key]);
        }
        return rows.join('&');
    }
})