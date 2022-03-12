$(function () {
    //点击去注册的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击去登录的链接
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    //从layui中获取form元素
    let form = layui.form
    let layer = layui.layer
    //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义pwd这个校验规则，用来校验密码
        pwd : [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致的规则
        repwd: function (value) {
            //通过形参拿到的是确认密码框中的内容
            //还需要拿到密码框中的内容
            //然后进行一次等于的判断
            //如果判断失败，则return一个提示消息
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //监听注册表单的提交事件            
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        // 发起ajax的post请求
        $.post('/api/reguser',
        {username : $('#form_reg [name=username]').val(),
        password : $('#form_reg [name=password]').val()
    }, function (res) {
        if (res.status !== 0) {
            return layer.msg(res.message)
        }
        layer.msg('注册成功，请登录')
        //模拟人的点击
        $('#link_login').click()
    })
    })

    //监听登录表单的提交事件 
    $('#form_login').on('submit', function (e) {
        //阻止默认提交行为
        e.preventDefault()
        $.ajax({
            method : 'post',
            url : '/api/login',
            data : {
                username : $('#form_login [name=username]').val(),
                password : $('#form_login [name=password]').val()
            },
            success : function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                //console.log(res.token)
                //将登录成功得到的token字符串保存到localStorage 中
                localStorage.setItem('token', res.token)
                //跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})