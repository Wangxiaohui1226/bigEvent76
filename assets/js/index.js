//发送ajax请求来获取到用户的基本信息(头像 昵称)
function getUserinfo() {
  let layer = layui.layer;
  $.ajax({
    url: "/my/userinfo",
    //请求头的配置
    // 从本地存储中获取到token的值

    // headers: {
    //   Authorization: localStorage.getItem("token"),
    // },
    success: function (res) {
      // console.log(res);
      //失败的判断
      if (res.status != 0) {
        $(".textavatar").hide();
        return layer.msg("获取用户信息失败");
      }

      //渲染处理头像和昵称
      //  1 如果有头像的话展示头像,没有头像的话展示文字头像
      //  2 如果有nickname,优先展示nickname,否则才展示username

      let name = res.data.nickname || res.data.username;
      //   console.log(name);
      //展示名字
      $("#welcome").text("欢迎您:" + name);
      //处理 根据user_pic来做判断
      if (res.data.user_pic) {
        //  if成立.有图片
        $(".layui-nav-img").attr("src", res.data.user_pic).show();
        $(".textavatar").hide();
      } else {
        //没有图片,展示文字头像 还需要修改文字头像
        let first = name.slice(0, 1).toUpperCase();
        console.log(first);
        // $(".textavatar").show().text(name[0].toUpperCase());
        $(".textavatar").show().text(first);
        $(".layui-nav-img").hide();
      }
    },
    complete: function (res) {
      //请求完成(不论成功还是失败,都会完成),判断
      //message==="身份认证失败"
      //status===1
      // 就知道用户没有权限进入到index页面,需要回到login页面重新登录

      // 通过 res的responseJson可以获取到服务器响应回来的数据
      let data = res.responseJSON;
      if (data.status === 1 && data.message === "身份认证失败！") {
        // alert("请重新登录");

        // 清除伪造的token信息
        localStorage.removeItem("token");
        location.href = "/home/login.html";
      }
      console.log(res);
    },
  });
}
getUserinfo();

//实现退出功能
// 点击退出,我们要做的事
// 1 清空本地存储的token
// 2 返回到登录页
$("#loginoutBtn").on("click", function () {
  layer.confirm("确定退出吗", { icon: 3, title: "提示" }, function (index) {
    //do something
    localStorage.removeItem("token");
    location.href = "/home/login.html";

    // function函数是点击确认执行的函数
    layer.close(index);
  });
  console.log(121212);
});
