$(function () {
    let layer = layui.layer
    let form = layui.form


    initCase()
    // 初始化富文本编辑器
    initEditor()


    //定义加载文章分类的方法
    function initCase() {
        $.ajax({
            method : 'get',
            url : '/my/article/cates',
            success : function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模版引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //一定要记得调用 form.render()方法
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)


    //给选择封面按钮绑定点击事件，让文本框自己触发事件
    $('#btn-chose').on('click', function () {
        $('#file').click()
    })


    //为文本选择框绑定change事件
    $('#file').on('change', function (e) {
        let filelist = e.target.files

        if (filelist.length === 0) {
            return layer.msg('请选择照片!')
        }

        //拿到用户选择的文件
        let file = e.target.files[0]
        //根据选择的文件，创建一个对应的 URL 地址
        let newImgURL = URL.createObjectURL(file)
        //重新初始化裁剪区域
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })


    //定义文章的发布状态
    let art_state = '已发布'

    //给存为草稿绑定点击事件
    $('#btnSeave').on('click', function () {
        art_state = '草稿'
    })

    //1.为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //基于 form 表单快速创建一个 FormData 对象
        let fd = new FormData($(this)[0])
        //3.将文章的发布状态，存到fd中
        fd.append('state', art_state)

        //4.将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象存储到fd中
                fd.append('cover_img', blob)
                // 6.发起ajax请求
                publishArt(fd)
            })
    })

    //定义一个发布文章的方法
    function publishArt(fd) {
        $.ajax({
            method : 'post',
            url : '/my/article/add',
            data : fd,
            //注意：如果向服务器提交的是 FormData 格式的数据
            //必须添加两个配置项
            contentType : false,
            processData : false,
            success : function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章成功！')
                }
                layer.msg('发布文章成功！')
                //发布成功后，进行跳转页面到文章列表
                location.href = '/article/art_list.html'
                
            }
        })
    }
})