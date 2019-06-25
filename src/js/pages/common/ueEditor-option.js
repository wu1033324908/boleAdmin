$(function() {
    
    
    if(window.UE) {
        /*
         * 判断编辑器是否获得焦点
         */
        $('.is-focus-btn').on('click', function(e) {
            alert(UE.getEditor('editor').isFocus());
            UE.dom.domUtils.preventDefault(e)
        });
        
        /*
         * 使编辑器失去焦点
         */
        $('.set-blur-btn').on('click', function(e) {
            UE.getEditor('editor').blur();
            UE.dom.domUtils.preventDefault(e)
        });
        
        /*
         * 往编辑器中插入给定的内容
         */
        $('.insert-html-btn').on('click', function(e) {
            var value = prompt('插入html代码', '');
            UE.getEditor('editor').execCommand('insertHtml', value)
        });
        
        /*
         * 创建编辑器
         */
        $('.create-editor-btn').on('click', function(e) {
            enableBtn();
            UE.getEditor('editor');
        });
        
        /*
         * 删除编辑器
         */
        $('.delete-editor-btn').on('click', function(e) {
            disableBtn();
            UE.getEditor('editor').destroy();
        });
        
        /*
         * 获得整个html的内容
         */
        $('.get-all-html-btn').on('click', function(e) {
            alert(UE.getEditor('editor').getAllHtml())
        });
        
        /*
         * 获得内容
         */
        $('.get-content-btn').on('click', function(e) {
            var arr = [];
            arr.push("使用editor.getContent()方法可以获得编辑器的内容");
            arr.push("内容为：");
            arr.push(UE.getEditor('editor').getContent());
            alert(arr.join("\n"));
        });
        
        /*
         * 获得带格式的纯文本
         */
        $('.get-plain-text-btn').on('click', function(e) {
           var arr = [];
            arr.push("使用editor.getPlainTxt()方法可以获得编辑器的带格式的纯文本内容");
            arr.push("内容为：");
            arr.push(UE.getEditor('editor').getPlainTxt());
            alert(arr.join('\n')) 
        });
         
        /*
         * 写入内容
         */
        $('.set-content-btn').on('click', function(e) {
            var arr = [];
            arr.push("使用editor.setContent('欢迎使用ueditor')方法可以设置编辑器的内容");
            UE.getEditor('editor').setContent('欢迎使用ueditor', 'aaa');
            alert(arr.join("\n"));
        });
        
        /*
         * 可以编辑按钮
         */
        $('.set-enabled-btn').on('click', function(e) {
            UE.getEditor('editor').setEnabled();
            enableBtn();
        });
        
        /*
         * 不可以编辑按钮
         */
        $('.set-disabled-btn').on('click', function(e) {
            UE.getEditor('editor').setDisabled('fullscreen');
            disableBtn("enable"); 
        });
        
        /*
         * 获得当前选中的文本
         */
        $('.get-text-btn').on('click', function(e) {
            //当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
            var range = UE.getEditor('editor').selection.getRange();
            range.select();
            var txt = UE.getEditor('editor').selection.getText();
            alert(txt)
        });
        
        /*
         * 获得纯文本
         */
        $('.get-content-text-btn').on('click', function(e) {
            var arr = [];
            arr.push("使用editor.getContentTxt()方法可以获得编辑器的纯文本内容");
            arr.push("编辑器的纯文本内容为：");
            arr.push(UE.getEditor('editor').getContentTxt());
            alert(arr.join("\n"));
        });
        
        /*
         * 判断是否有内容
         */
        $('.has-content-btn').on('click', function(e) {
            var arr = [];
            arr.push("使用editor.hasContents()方法判断编辑器里是否有内容");
            arr.push("判断结果为：");
            arr.push(UE.getEditor('editor').hasContents());
            alert(arr.join("\n"));
        });
        
        /*
         * 使编辑器获得焦点
         */
        $('.set-focus-btn').on('click', function(e) {
            UE.getEditor('editor').focus();
        });
       
        /*
         * 获取草稿箱内容
         */
        $('.get-local-data-btn').on('click', function(e) {
            alert(UE.getEditor('editor').execCommand( "getlocaldata" ));
        });
        
        /*
         * 清空草稿箱内容
         */
        $('.clear-local-data-btn').on('click', function(e) {
            UE.getEditor('editor').execCommand( "clearlocaldata" );
            alert("已清空草稿箱");
        });
        
        /*
         * 隐藏编辑器
         */
        $('.hide-editor-btn').on('click', function(e) {
            UE.getEditor('editor').setHide();
        });
        
        /*
         * 显示编辑器
         */
        $('.show-editor-btn').on('click', function(e) {
            UE.getEditor('editor').setShow();
        });
        
        /*
         * 设置编辑器高度
         */
        $('.set-height-btn').on('click', function(e) {
            UE.getEditor('editor').setHeight(300);
        });
         
        /*
         * 使编辑器的按钮不可用
         */
        function disableBtn(str) {
            var div = document.getElementById('ue-editor-btn-group');
            var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
            for (var i = 0, btn; btn = btns[i++];) {
                if (btn.id == str) {
                    UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
                } else {
                    btn.setAttribute("disabled", "true");
                }
            }
        }
        
        /*
         * 使编辑器的按钮可用
         */
        function enableBtn() {
            var div = document.getElementById('ue-editor-btn-group');
            var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
            for (var i = 0, btn; btn = btns[i++];) {
                UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
            }
        }
    }
    
});
