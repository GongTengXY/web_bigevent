$(function () {
    //调用 getUserInfo 函数获取用户的基本信息
    getUserInfo()

    //给退出绑定点击事件
    $('#navTwo').children('a').on('click', function (e) {
        //提示用户是否确认退出
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'},
        function(index){
            //要清空本地存储中的那个token
            localStorage.removeItem('token')
            //重新跳转登录页面
            location.href = './login.html'

            //关闭confirm 询问框
            layer.close(index)
        });
    })
})

//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method : 'get',
        url : '/my/userinfo',
        //headers 就是请求头配置对象
        // headers : {
        //     Authorization : localStorage.getItem('token') || ''
        // },
        success : function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //调用renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        //无论成功还是失败都会调用这个complete回调函数
        // complete : function (res) {
        //     //在complete回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //强制清空token
        //         localStorage.removeItem('token')
        //         //强制跳转到登录页面
        //         location.href = './login.html'
        //     }
        // }
    })
}

//渲染用户的头像
function renderAvatar(user) {
    //获取用户的名称
    let name = user.nickname || user.username
    //设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //按需渲染用户的头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatat').hide()
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatat').html(first).show()
    }
}