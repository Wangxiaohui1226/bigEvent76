$(function () {
  let form = layui.form;
  $.ajax({
    url: "/my/article/cates",
    success: function (res) {
      console.log(res);
      if (res.status !== 0) {
        layer.msg("获取文章分类失败");
      }
      res.data.forEach((item) => {
        $(`<option value="${item.Id}">${item.name}</option>`).appendTo(
          $(".choosecate")
        );
        //重新渲染页面
        form.render();
      });
    },
  });

  // 初始化富文本编辑器
  initEditor();

  //图片裁剪js
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //------------------------------------
  $("#chooseimg").click(function () {
    $("#file").click();

    //更换裁剪图片

    $("#file").change(function (e) {
      //获取到选择的图片
      let file = this.files[0];

      //根据选择的文件,创建一个对应的url地址
      var newImgURL = URL.createObjectURL(file);

      $image
        .cropper("destroy") // 销毁旧的裁剪区域
        .attr("src", newImgURL) // 重新设置图片路径
        .cropper(options); // 重新初始化裁剪区域
    });
  });

  //-----------------------------------------
  // 发送ajax添加文章

  //处理下state
  let state; //存文章的状态(已发布,草稿)
  $("#btn1").click(function () {
    state = "已发布";
  });
  $("#btn2").click(function () {
    state = "草稿";
  });

  $("#addform").on("submit", function (e) {
    e.preventDefault();

    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob((blob) => {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        console.log(blob);

        let fd = new FormData(this);
        //把state状态追加到fd中 append()
        fd.append("state", state);
        fd.append("cover_img", blob);
        //查看fd收集的数据
        fd.forEach((v, key) => {
          console.log(v, key);
        });
        $.ajax({
          url: "/my/article/add",
          type: "POST",
          contentType: false,
          processData: false,
          data: fd,
          success: function (res) {
            console.log(res);
            location.href = "/article/art_list.html";
          },
        });
      });

    // return;
  });
});
