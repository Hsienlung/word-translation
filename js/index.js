$(function () {
    //给每个选项设置点击事件
    $('ul.dropdown-menu li').on('click', function () {
        $(this).parent().siblings('button').html($(this).text()+' <span class="caret"></span>').attr('index',$(this).attr('index'));
    })

    //设置全局变量  防抖
    let timer = null;
    //点击翻译
    $('#btn').on('click', function () {
         //防抖
        if (timer == null) {
          timer = setTimeout(function () {
              getTranslate();
              timer = null;
            },1500)
        }
    });

    // 监听输入框回车事件
    $('#iptForm').on('keyup', function (e) {
        if (e.keyCode !== 13) return;
        $('#btn').click();
    })

    //清空输入框
    $('#btnClean').on('click', function () {
        $('#iptForm').val('');
        $('#iptTo').val('');
    })
    //存储数据
    $('#btnPre').on('click',function () {
        console.log('再想想怎么保存');
    })

    //获取数据
    $('#btnGet').on('click', function () {

        const arr = Object.keys(localStorage);
        // console.log(arr)
    })

    // 封装在本地查询函数
    function getLocalStorage() {
        // 遍历本地数据
        for (const key in localStorage) {
            //判断是否是自身属性，防止把继承的方法也遍历出来
            if (localStorage.hasOwnProperty(key)) {
                // 有存储直接赋值
                if ($('#iptForm').val() == key) {
                    $('#iptTo').val(localStorage.getItem(key));
                }
            }
        }
    }

    //封装对象转字符串函数
    function getString(data) {
        let rows = [];
        for (const key in data) {
            rows.push(key +'='+ data[key]);
        }
        return rows.join('&');
    }

    //封装请求翻译函数
    function getTranslate() { 
          // 清除定时器
          clearTimeout(timer); 
        
          //获取翻译内容
          let content = $('#iptForm').val().trim();
        if (content == '') return; //没有输入内容直接return
        
        //判断本地是否有数据
        for (const key in localStorage) {
            //判断是否是自身属性，防止把继承的方法也遍历出来
            if (localStorage.hasOwnProperty(key)) {
                // 有存储直接赋值
                if (content == key) {
                    $('#iptTo').val(localStorage.getItem(key));
                    return;   //会直接退出函数
                }
            }
        }
          //随机数参数
          let salt = Date.now();
          //签名
          let sign = md5('20201224000654956' + content + salt + 'yy8VWf7c5A460R6oLEKm');
          // 整理参数
          let data = {
              q: content,
              from: $('#btnF').attr('index'),
              to: $('#btnT').attr('index'),
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
                  if (arr.length <=0) {
                    $('#iptTo').val('未获取到翻译内容');
                  }
                  $('#iptTo').val(arr[0].dst.toLowerCase());
                  // 存储到浏览器上
                  localStorage.setItem(arr[0].src, arr[0].dst.toLowerCase());
              }
        });
    }
})