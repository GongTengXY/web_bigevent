$(function () {
    let layer = layui.layer
    let form = layui.form
    initArtCate()


    //获取文章分类的列表
    function initArtCate() {
        $.ajax({
            method : 'get',
            url : '/my/article/cates',
            success : function (res) {
               let htmlStr = template('tpl-table', res)
               $('tbody').html(htmlStr)
            }
        })
    }


    //给添加类别绑定点击事件弹出框
    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type : 1,
            area : ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialong').html()
        })
    })

    //通过代理的形式(类似jq中的事件委托)，为form-add表单绑定submit事件，
    $('body').on('submit', '#form-add',function (e) {
        e.preventDefault()
        $.ajax({
            method : 'post',
            url : '/my/article/addcates',
            data : $(this).serialize(),
            success : function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCate()
                layer.msg('新增分类成功！')
                //根据索引，关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    let indexEdit = null
    //通过代理的形式，为btn-edit 按钮绑定事件
    $('tbody').on('click', '#btn-edit', function (e) {
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type : 1,
            area : ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialong-edit').html()
        })
        
        let id = $(this).attr('data-id')
        //发起请求获取对应分类的数据
        $.ajax({
            method : 'get',
            url : '/my/article/cates/' + id ,
            success : function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method : 'post',
            url : '/my/article/updatecate',
            data : $(this).serialize(),
            success : function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                layer.msg('更新分类信息成功!')
                //根据索引，关闭弹出层
                layer.close(indexEdit)
                initArtCate()
            }
        })
    })

    //通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-del', function (e) {
        let id = $(this).attr('data-id')
        //提示用户是否删除
        layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method : 'get',
                url : '/my/article/deletecate/' + id,
                success : function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    initArtCate()
                }
            })

            layer.close(index)
          });
    })
})