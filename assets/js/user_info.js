//发送ajax请求来获取到用户的基本信息
let form = layui.form;
let layer = layui.layer;
function getUserInfo() {
  $.ajax({
    url: "/my/userinfo",
    success: function (res) {
      console.log(res);

      //给表单赋值
      // form 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值

      // 注意:需要按照name的名字来一一对应 ,所有就要给表单设置name属性
      form.val("form", res.data);
    },
  });
}
getUserInfo();
// --------------------------------------------------------
//实现重置功能个,reset按钮可以实现表单重置,但是是清空表单,我们要求的是还是还原到未修改的状态
// 做法:点击重置按钮的时候,重新发送ajax请求
$("#resetbtn").on("click", function (e) {
  e.preventDefault(); //阻止清空
  getUserInfo();
});

//-----------------------------------------------------------------
//实现表单的提交功能
//   1 给form注册submit事件
//   2 阻止其默认行为
//   3 收集表单数据
//   4 ajax

$(".layui-form").on("submit", function (e) {
  //阻止其默认行为
  e.preventDefault();
  let data = $(this).serialize();
  //   console.log(data);

  //发送ajax请求
  $.ajax({
    type: "POST",
    url: "/my/userinfo",
    data,
    success: function (res) {
      console.log(res);
      if (res.status != 0) {
        return layer.msg("修改用户信息失败");
      }
      layer.msg("修改用户信息成功");

      //更新index页面左侧导航的名字
      //   window.parent来获取父页面(index页面) 从而获取其getUserinfo方法
      //   注意点:父页面的getUserinfo这个函数需要时全局的
      window.parent.getUserinfo();
    },
  });
});
