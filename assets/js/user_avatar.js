$(function () {
  let layer = layui.layer;
  // 1.1 获取裁剪区域的 DOM 元素
  let $image = $("#image");

  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  //   ------------------------------------------------
  // 点击上传按钮
  $("#choosebtn").click(function () {
    //模拟点击了文件域
    console.log(9999);
    $("[type=file]").click();
  });
  //--------------------------------------------------
  //   给文件域注册change事件 ==>当文件域发生改变时来触发这个事件==>更换裁剪区域的图片

  $("#file").change(function () {
    // console.log("gaibainle");
    //1 获取到选择的图片 ==>通过文件域的dom对象的files属性
    let file = this.files[0];
    console.log(file);
    //把选择的文件处理成url地址
    var newImgURL = URL.createObjectURL(file);

    // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //发送ajax请求 提交裁切的头像
  $("#surebtn").on("click", function () {
    let dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    $.ajax({
      url: "/my/update/avatar",
      type: "POST",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          layer.msg("更新头像失败!");
        }
        window.parent.getUserinfo();
        layer.msg("更新头像成功");
      },
    });
  });
});
