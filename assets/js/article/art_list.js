$(function () {
  //---------------------------------------------------------------------------------

  let form = layui.form;
  let laypage = layui.laypage;

  let query = {
    pagenum: 1, //默认请求第一页的数据
    pagesize: 2, //每页显示多少条数据
    cate_id: "", //加载所有分类
    state: "", //文章的状态  可选值 已发布 草稿  默认加载所有的状态
  };

  //   $.ajax({
  //     url: "/my/article/list",
  //     data: query,
  //     success: function (res) {
  //       console.log(res);
  //     },
  //   });

  function getAtrList() {
    $.ajax({
      url: "/my/article/list",
      data: query,
      success: function (res) {
        // console.log(res);

        let htmlstr = template("trtpl", res);
        $("#tb").html(htmlstr);

        //分页渲染
        renderPage(res.total);
      },
    });
  }
  getAtrList();

  //分页功能的渲染
  // 注意位置:分页的功能需要在获取文章列表后才实现
  function renderPage(total) {
    // console.log(total);
    laypage.render({
      elem: "pagebox", //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: query.pagesize,
      limits: [2, 3, 5, 10, 15],
      curr: query.pagenum, //起始页
      layout: ["count", "limit", "prev", "page", "next", "skip"], //自定义排版

      //jump是分页切换会执行的回调函数
      // jump的执行时机
      // 1 laypage.render 初始渲染时候就会执行一次
      // 2 当分页切换时也会执行
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        //console.log(obj.limit); //得到每页显示的条数

        //把query对象的pagenum参数修改了(页码)
        query.pagenum = obj.curr;

        // 把query的pagesize调整
        query.pagesize = obj.limit;

        //首次不执行 (解决了分页的bug)
        // 第一次渲染的时候 first为true ,分页切换的时候为undefined
        if (!first) {
          getAtrList();
        }
      },
    });
  }

  //修改时间格式
  //   1 在模板中导入过滤器函数
  const paddZero = (n) => (n < 10 ? "0" + n : n);
  template.defaults.imports.filterTime = function (time) {
    // 得到年月日。。。
    let d = new Date(time);
    let y = d.getFullYear();
    let m = paddZero(d.getMonth() + 1);
    let day = paddZero(d.getDate());

    let h = paddZero(d.getHours());
    let mm = paddZero(d.getMinutes());
    let s = paddZero(d.getSeconds());

    return `${y}-${m}-${day} ${h}:${mm}:${s}`;
  };
  //   2 在模板中使用过滤器函数

  //发送ajax请求获取文章的类别
  $.ajax({
    url: "/my/article/cates",
    success: function (res) {
      console.log(res);
      res.data.forEach((item) => {
        $(` <option value="${item.Id}">${item.name}</option>`).appendTo(
          $(".choosecate")
        );
        //让表单更新渲染即可出现新增的option
        form.render();
      });
    },
  });
  //------------------------------------------------------------------------------------------------
  // 实现筛选功能

  // 1 监听form的submit事件
  // 2 获取到需要的分类及状态,修改query的参数
  // 3 重新获取下文章的列表 (按照query)

  $("#chooseForm").on("submit", function (e) {
    e.preventDefault();
    // console.log($(".choosecate").val());
    // console.log($(".choosestate").val());
    query.cate_id = $(".choosecate").val();
    query.state = $(".choosestate").val();
    getAtrList();
  });

  // ------------------------------------------------------------------------

  //删除功能
  $("#tb").on("click", ".delBtn", function () {
    let id = $(this).attr("data-id");
    console.log(id);
    layer.confirm("确定删除吗?", { icon: 3, title: "提示" }, function (index) {
      //点击了确认就会执行该回调函数

      //对于删除文章的时候,会有bug,会把这一页中所有的数据全部删除之后,需要让其加载pagenum-1的数据
      // 另外 :pagenum最小值为1

      //难点:把这一页中所有的数据全部删除 ==>根据页面中删除按钮的个数

      //if成立 说明页面中还有一个删除按钮,但是经过ajax的删除操作,页面中就没有这一页的数据,需要加载上一页的数据
      if ($(".delBtn").length === 1) {
        if (query.pagenum === 1) {
          query.pagenum = 1;
        } else {
          query.pagenum = query.pagenum - 1;
        }
      }

      $.ajax({
        url: "/my/article/delete/" + id,
        success: function (res) {
          console.log(res);
          if (res.status !== 0) {
            return layer.msg("删除文章失败!");
          }

          layer.msg("删除文章成功");
          getAtrList();
        },
      });
    });
  });

  //文章编辑功能
  $("#tb").on("click", ".editBtn", function () {
    let id = $(this).attr("data-id");
    console.log(id);
    //----------------------------------------------------------

    let editacttxt = $("#editAct").html();

    $(".layui-card").html(editacttxt);
    //----------------------------------------------------------
    //修改页面中富文本和裁剪图片部分
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

    //--------------------------------------------------------------
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

    //重新渲染,实现下拉框有layui的效果
    //----------------------------------------------------------------

    //发送ajax请求获取对应Id的数据
    $.ajax({
      url: "/my/article/" + id,
      success: function (res) {
        console.log(res);

        // $(".active").attr("value", res.data.cate_id);
        // $(`<option value="${res.data.cate_id}">11111</option>`).append(
        //   $(".choosecate"));

        $.ajax({
          url: "/my/article/cates/" + id,
          success: function (res) {
            if (res.status !== 0) {
              layer.mag("获取分类信息失败");
            }

            $(".choosecate").append(
              $(`<option value="${res.data.cate_id}">${res.data.name}</option>`)
            );
          },
        });

        // $(".choosecate").append(
        //   $(`<option value="${res.data.cate_id}">11</option>`)
        // );
        // getArtCate(res.data.cate_id);

        getArtCate(res.data);
      },
    });

    //根据分类的id获取到分类的名称

    //获取文章的分类
    function getArtCate(data) {
      $.ajax({
        url: "/my/article/cates",
        success: function (res) {
          // console.log(res.data);
          if (res.status === 0) {
            //渲染模板

            res.data.forEach((item) => {
              $(`<option value="${item.Id}">${item.name}</option>`).appendTo(
                $(".choosecate")
              );
              //让表单更新渲染即可出现新增的option
            });
            form.val("editform", data);
          }
        },
        complete() {
          form.render();
          initEditor();
        },
      });
    }

    //通过layui内置的方法实现表单赋值
    //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
    // form.val("editform", );

    //--------------------------------------------------------------------------
    //  更新操作
    //处理下state
    let state; //存文章的状态(已发布,草稿)
    $("#btn1").click(function () {
      state = "已发布";
    });
    $("#btn2").click(function () {
      state = "草稿";
    });

    $("#edform").on("submit", function (e) {
      e.preventDefault();

      $image
        .cropper("getCroppedCanvas", {
          // 创建一个 Canvas 画布
          width: 400,
          height: 280,
        })
        //----------------------------------------------------------------------------
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
            url: "/my/article/edit",
            type: "POST",
            contentType: false,
            processData: false,
            data: fd,
            success: function (res) {
              console.log(res);
              if (res.status !== 0) {
                return layer.msg("更新文章失败");
              }

              location.href = "/article/art_list.html";
              getAtrList();
            },
          });
        });
    });
  });
});
