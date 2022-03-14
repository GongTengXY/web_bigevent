$(function () {
    let form = layui.form
    let layer = layui.layer

    form.verify({
        nickname : function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ～ 6个字符之间'
            }
        }
    })

    initUserinfo()

    //初始化用户的信息
    function initUserinfo() {
        $.ajax({
            method : 'get',
            url : '/my/userinfo',
            success : function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                //调用form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    //重置按钮
    $('#btnReset').on('click', function (e) {
        //阻止表单的重置默认行为
        e.preventDefault()
        //表中的值再次发起请求就可以重回最初的内容
        initUserinfo()
    })

    //监听提交更新用户
    $('.layui-form').on('submit', function (e) {
        //阻止表单的重置提交行为
        e.preventDefault()
        //发起ajax请求
        $.ajax({
            method : 'post',
            url : '/my/userinfo',
            data : $(this).serialize(),
            success : function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                //调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})