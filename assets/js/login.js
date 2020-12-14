$(function () {
  $("#gotologin").click(function () {
    $(".register").hide();
    $(".login").show();
  });
  $("#gotoregister").click(function () {
    $(".login").hide();
    $(".register").show();
  });

  var form = layui.form;
  var layer = layui.layer;
  //表单的校验,自定义校验规则
  form.verify({
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repass: function (value) {
      // value:表单的值,
      // item:表单dom对象

      //   通过value和密码框的值做比较,如果不一致,弹框提示
      console.log(value);

      console.log($(".pwd").val());
      if (value !== $(".pwd").val()) return "两次输入的密码不一致";
    },
  });

  //实现注册功能
  //   1 当form表单提交的时候,触发表单的submit事件
  //   2 阻止form表单的默认行为
  //   3 收集表单中的数据(用户名和密码)
  //   4 发送ajax==按照接口文档

  $("#registerform").on("submit", function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    // console.log(data);

    //发送ajax请求

    $.ajax({
      url: "/api/reguser",
      type: "POST",
      data,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          //注册失败
          //    console.log(res.message);
          return layer.msg(res.message);
        }
        //注册成功
        // console.log("注册成功");
        layer.msg("注册成功");
        $("#registerform")[0].reset();
      },
    });
  });

  //登录操作

  $("#loginform").on("submit", function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    // console.log(data);
    $.ajax({
      url: "/api/login",
      type: "POST",
      data,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // layer.msg("登录成功,即将跳转到首页");
        // 登录成功做的事
        // 1 layer.msg("登录成功,即将跳转到首页");
        // 2 跳转页面=>弹框关闭之后再跳转
        // 3 把token (令牌存储到本地)
        localStorage.setItem("token", res.token);
        layer.msg("登录成功,即将跳转到首页", { time: 2000 }, function () {
          location.href = "index.html";
        });
        //跳转页面
      },
    });
  });
});
