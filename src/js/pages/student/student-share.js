/**
 * @description 分享记录
 * @author wujunwei
 * @createAt 2018-04-24
 */


var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/error');
require('tool/jquery-extend');
$(function () {


    /**
     * @description datatable 对象
     */
    var _TABLE;


    init();
    /**
     * @description 页面初始化
     */
    function init() {
        // 初始化表格
        initTable();
        $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.student.composition.list_all);
        // 初始化修改模块
        initModifyModule();
        // 点击图片，将在浏览器打开图片大图
        $.showResourceInBrowser();
    }

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.share.url,
                type: 'POST',
                dataSrc: (res) => {
                    return res.Data;
                }
            },
            columns: [{
                    title: '序号',
                    data: '',
                    orderable: false,
                    searchable: false,
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return '';
                    }
                }, 
                // {
                //     title: '操作',
                //     data: '',
                //     orderable: false,
                //     searchable: false,
                //     className: 'btn-td show-detail-td',
                //     render: (data, type, row, meta) => {
                //         // return `
                //         //     <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="详细信息">详情</button>
                //         //     `;
                //         // <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除"><i class="fa fa-trash-o"></i></button>
                //         return '';
                //     }
                // },
                {
                    title: '学生区域',
                    data: 'StudentElement',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '学生电话',
                    data: 'StudentPhont',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                
                {
                    title: '学生城市',
                    data: 'StudentDistrict',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '学生年级',
                    data: 'StudentGrade',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '学生学校',
                    data: 'StudentSchool',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '推荐人昵称',
                    data: 'ReferrerNikeName',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '推荐人电话',
                    data: 'ReferrerPhone',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '创建时间',
                    data: 'CreatedAt',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data.replace('T', ' ').substring(0, 19)}">${data.replace('T', ' ').substring(0, 19)}</div>`;
                    }
                }
            ],
            drawCallback: function (settings) {
                var api = this.api();

                var startIndex = api.context[0]._iDisplayStart; //获取到本页开始的条数
                　　
                api.column(0).nodes().each(function (cell, i) {　　　　
                    cell.innerHTML = startIndex + i + 1;　　
                });

                // 往分页中添加跳页输入框和按钮
                $.datatablesSkipPagigate(this);
            }
        });
        // datatables 的样式设置
        $.datatablesStyle();

    }

    /**
     * @description 初始化修改模块
     */
    function initModifyModule() {
        var fun_data = {};
        $('.dataTables_wrapper').on('click', 'tbody .btn-modify', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');
            console.log(fun_data)

            // 初始化表单
            initForm(fun_data);

            // 打开一个弹出层
            layui.layer.open({
                type: 1,
                title: '修改',
                content: $('#modify-module'),
                maxmin: false,
                anim: 2,
                success: (layero, index) => {
                    // 最大化layer
                    layui.layer.full(index);

                },
                cancel: (index, layero) => {
                    $('.layer-content-molude').css('display', 'none');
                    layui.layer.close(index);
                }
            });
        });

        /**
         * @description 初始化表单内容
         */
        function initForm(fun_data) {
            // 修改模块表单
            let form = $('#modify-module form');
            // 阶段名称
            form.find('.stage').text(fun_data.modify.StageDescribe);
            // 课次名称
            form.find('.section').text(fun_data.modify.CouresDescribe);
            // 批改状态
            form.find('.IsCorrect').text(fun_data.modify.IsCorrect? '已批改': '未批改');

            // 未批改图片
            var $img_box = form.find('.composition-image');
            $img_box.empty();
            fun_data.modify.ThumbnailUrl.forEach((ele, index) => {
                $img_box.append(`
                    <div class="item">
                        <img class="origin-image show_resource_in_browser" src="${ele}" data-src="${fun_data.modify.Url[index]}" title="查看大图" alt="加载失败">
                    </div>
                `)
            });

            // 已批改图片
            var $commented_img_box = form.find('.commented-image');
            $commented_img_box.empty();
            // 有批改过
            if (fun_data.modify.IsCorrect) {
                $.ajax({
                    url: _HOST.add_rort + _HOST.student.composition.commented_image,
                    type: 'POST',
                    data: {
                        articleid: fun_data.modify.ArticleId,
                        correctid: fun_data.modify.IsCorrectId,
                    },
                    success: (res) => {
                        if (res.Result) {
    
                            res.Data[0].ThumbnailUrl.forEach((ele, index) => {
                                $commented_img_box.append(`
                                    <div class="item">
                                        <img class="origin-image show_resource_in_browser" src="${ele}" data-src="${res.Data[0].Url[index]}" title="查看大图" alt="">
                                    </div>
                                `)
                            });
                        }
                    }
                })
            }
        }
    }
});