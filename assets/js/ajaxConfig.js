//
$.ajaxPrefilter(function (options) {
  console.log(options.url);
  options.url = "http://ajax.frontend.itheima.net" + options.url;

  //处理请求头 带上token
  //  把options配置项里面的请求头配置下
  options.headers = {
    Authorization: localStorage.getItem("token"),
  };
});
