$(function () {
  let layer = layui.layer;
  //给表单添加自定义的校验规则
  let form = layui.form;
  form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    //新旧密码不能相同
    // value是表单的值
    oldPass: (value) => {
      console.log(value); //新密码输入框的值

      //获取原密码的值
      let oldPwd = $("[name=oldPwd]").val();
      if (value === oldPwd) {
        return "新密码不能与原密码相同";
      }
    },

    newPass: (value) => {
      //获取到新密码的内容和确认密码的value做比较
      let newPwd = $("[name=newPwd]").val();
      if (value !== newPwd) {
        return "两次密码不一致";
      }
    },
  });

  // ----------------------------------------------------------
  //发送ajax请求实现密码重置
  $("#form").submit(function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    // console.log(data);
    $.ajax({
      url: "/my/updatepwd",
      type: "POST",
      data,
      success: function (res) {
        console.log(res);
        if (res.status != 0) {
          return layer.msg("更新密码失败!" + res.message);
        }
        layer.msg("更新密码成功");
        //清空密码框
        $("#form")[0].reset();
      },
    });
  });
});
