//注意：每次调用jquery封装好的post和get请求或者ajax请求的时候
//会先去调用 ajaxPrefilter 这个函数
//在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
})