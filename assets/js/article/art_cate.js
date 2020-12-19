$(function () {
  let layer = layui.layer;
  let form = layui.form;
  //发送ajax请求 获取文章的分类
  function getArtCate() {
    $.ajax({
      url: "/my/article/cates",
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          layer.msg("获取文章分类失败");
        }

        //成功
        let htmlStr = template("trTpl", res);
        $("#tb").html(htmlStr);
      },
    });
  }
  getArtCate();

  //-------------------------------------------------------------------------
  let index;
  //   添加类别按钮的点击功能
  $("#addBtn").on("click", function () {
    index = layer.open({
      type: 1,
      title: "添加文章分类",
      content: $("#addFormtpl").html(),

      area: "500px",
    });
    //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。

    //这种写法错误,因为form是动态创建的 (随着弹出层的出现才创建的)
    // $("#addcateform").on("submit", function (e) {
    //   alert(1);
    // });

    //正确写法是用事件委托
    $("body").on("submit", "#addcateform", function (e) {
      e.preventDefault();

      let data = $(this).serialize();
      console.log(data);

      //发送ajax请求
      $.ajax({
        type: "POST",
        url: "/my/article/addcates",
        data,
        success: function (res) {
          console.log(res);
          if (res.status !== 0) {
            layer.msg("新增文章分类失败!");
          }

          //新增成功后要做的事
          //    1 关闭弹出层
          layer.close(index);
          //    2 需要获取所有的分类
          getArtCate();
          //    3 提示告知添加成功
          layer.msg("新增文章分类成功!");
        },
      });
    });
  });

  //--------------------------------------------------------------------------

  // 编辑功能
  let editIndex;
  $("#tb").on("click", ".editBtn", function () {
    editIndex = layer.open({
      type: 1,
      title: "修改文章分类",
      content: $("#editFormtpl").html(),

      area: "500px",
    });
    //发送ajax请求获取对应的数据信息

    let id = $(this).attr("data-id");
    console.log(id);
    $.ajax({
      url: "/my/article/cates/" + id, // 注意这里的写法
      success: function (res) {
        console.log(res);
        //把获取到的结果赋值给表单,form.val()
        form.val("editform", res.data);
      },
    });
  });

  //-----------------------------------------------------------------------------
  // 修改功能 =>form注册submit事件,需要注册事件委托
  $("body").on("submit", "#editform", function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    // console.log(data);

    $.ajax({
      type: "POST",
      url: "/my/article/updatecate",
      data,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg("修改分类信息失败");
        }

        //关闭弹出层
        layer.close(editIndex);
        //重新获取所有分类
        getArtCate();

        //提示修改成功
        layer.msg("修改分类信息成功");
      },
    });
  });

  //-----------------------------------------------------------------------------
  //  删除功能
  $("#tb").on("click", ".delBtn", function () {
    let id = $(this).attr("data-id");
    console.log(id);
    layer.confirm("确定删除吗?", { icon: 3, title: "提示" }, function (index) {
      //点击了确认就会执行该回调函数
      $.ajax({
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          console.log(res);
          if (res.status !== 0) {
            return layer.msg("删除类别失败!");
          }

          layer.msg("删除类别成功");
          getArtCate();
          layer.close(index);
        },
      });
    });
  });
});
