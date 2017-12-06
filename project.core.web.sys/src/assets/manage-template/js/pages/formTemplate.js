$(document).ready(function(){
    var height = $(document).height() - 300;
    $("#listWrap").css("height", height);
})

var objData = {}; //表单对应的数据
var activeId = "";
var DOMvalue; //拖动的DOM元素值
var bindTitle; //绑定标题
var bindField; //绑定字段

var collection; //数据源

var cmdOptions = `<option value="">请选择命令名称</option>`; //cmdOptions下拉选项
var cmdFormTemplateOption = `<option value="">请选择表单模板</option>`; //表单模板下拉框
var cmdFormDom = `<option value="">请选择触发的Dom</option>`; //cmdOptions 触发dom下拉选项

var detailId = ""; //查询详情url中的ID
detailId = $.request("id") || "";

//获取下拉框选项
$.ajax({
    type: "GET",
    url: urlprefix + "/api/Template/GetFormTemplateFormData",
    data: $.getAuth(),
    async: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    dataType: "json",
    success: function( res ) {
        if(res.code === "0") {

            // 数据源
            var collections = "";
            res.data.collections.forEach(function(el){
                collections += `<div data-value="${el.value}">${el.text}</div>`;
            })
            $("#collections").html(collections);


            //命令栏-命令名称
            res.data.domCmd.forEach(function (el) {
                cmdOptions += `<option value="${el.value}">${el.text}</option>`;
            })
            $(".cmdOptions").html(cmdOptions);

            //命令栏-表单模板
            res.data.formTemplate.forEach(function (el) {
                cmdFormTemplateOption += `<option value="${el.value}">${el.text}</option>`;
            })
            $(".cmdFormTemplate").html(cmdFormTemplateOption);

            //命令栏-触发dom
            $(".cmdFormDom").html(cmdFormDom);

            //平台
            bindSelect(res.data.platforms, "请选择平台", "templatePlatform");

            //展示类型
            bindSelect(res.data.doms, "请选择展示类型", "displayType");
            var html = "";
            res.data.doms.forEach(function(el){
                html += `<div class="nowrap" data-value="${el.value}">${el.text}</div>`;
            })
            $("#formDom").html(html).find("div").draggable({
                helper: "clone",
                revert: "invalid",
                zIndex: 100,
                start: function() {
                    DOMvalue = $(this).data("value");
                },
                drag: function() {},
                stop: function() {}
            });

            //绑定方式
            bindSelect(res.data.bindMethod, "请选择绑定方式", "bindMethod");

            //绑定目标
            $("#bindMethod").on("change", function(){
                $.ajax({
                    type: "GET",
                    url: urlprefix + "/api/Template/GetBindTarget",
                    data: $.getAuth({"bindMethod": $(this).val()}),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(r){
                        if(r.code === "0" && r.data){   //data可能会返回null
                            bindSelect(r.data, "请选择绑定目标", "bindTarget");
                        }                        
                    }
                })
            })

            //下拉框、复选框、单选框
            $("#bindTarget").on("change", function(){
                $.ajax({
                    type: "GET",
                    url: urlprefix + "/api/Template/GetBindData",
                    data: $.getAuth({"bindMethod":$("#bindMethod").val(),"bindTarget":$(this).val()}),
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(r){
                        if(r.code === "0") {
                            domElementUi(activeId, $("#bindMethod").val(), r.data);
                        }
                    }
                })
            })

            if(detailId){  //从url判断是 新增模板还是修改模板
                // console.log('有id')
                //获取下拉框选项
                $.ajax({
                    type: "GET",
                    url: urlprefix + "/api/Template/GetFormTemplateFormDetail",
                    // data: $.getAuth(),
                    data: $.getAuth({id: detailId}),
                    async: false,
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    dataType: "json",
                    success: function(res) {
                        var result = res.data;
                        if(result){
                            //1.菜单栏信息
                            $("#collections").val(result.collection).change();
                            $("#templateName").val(result.name);
                            $("#templateTitle").val(result.title);
                            $("#templatePlatform").val(result.platform);
                            $("#templateTags").val(result.tags ? result.tags.join(",") : "");
                            $("#templateDescription").val(result.description);

                            //2.模板dom信息
                            //2-1.判断是否有面板
                            if(result.doms && result.doms.length > 0){    
                                var doms = result.doms;
                                for (var i = 0; i < doms.length; i++) {
                                    renderResultDoms(doms[i]);
                                }
                            }
                            setParentIframeHeight()
                        }
                    }
                })
            }else{
                setParentIframeHeight()
            }
        }
    }
})

//渲染需要编辑的模板组件-面板
function renderResultDoms(doms){
    //还原面板组件(中间dom和右侧设置)
    dragCreateDom_Panel(doms.ui.displayType,$('#formDomTarget'),doms)
}
/**
 * [dragCreateDom_Panel 还原各面板组件]
 * [dragCreateDom_PanelBody 还原各面板的子组件]
 * [dragCreateDom_Panel_ButtonRegion 还原各面板子组件中的---按钮域]
 * @param  {[string]} domval [需要还原的组件的type value]
 * @param  {[object]} that     [存放 还原组件的父组件的dom]
 * @param  {[object]} editData  [需要还原的组件的data]
 */

//绑定页面拖拽的组件内容
function dragCreateDom_Panel(domval,that,editData){
    var id = $.generateGUID();
    generateObj(id);
    that.append(displayDOM(domval, id));
    //面板可拖入组件 
    $(".dom-panel-content").sortable({
        revert: true
    })
       
    $('#'+id).find(".dom-panel-content").droppable({  //手动设置面板可拖放组件
        greedy: true,
        drop: function() {
            if(DOMvalue === "HtmlDomDisplayType.Panel"){   //面板不能再嵌入面板
                return false;
            }
            var id1 = $.generateGUID();
            generateObj(id1);
            $(this).append(displayDOM(DOMvalue,id1));
            //手动设置 还原的按钮域，可放置按钮
            if(DOMvalue === 'HtmlDomDisplayType.ButtonRegion'){
                $('#'+id1).droppable({  
                    greedy: true,
                    drop: function() {
                        if(DOMvalue === 'HtmlDomDisplayType.Button'){
                            var idBtn = $.generateGUID();
                            generateObj(idBtn);
                            $(this).append(displayDOM(DOMvalue ,idBtn));
                        }
                    }
                })
            }
        }
    })
    //还原单个组件(中间dom和右侧设置)
    var domsChildrens = editData.childrens;
    if(domsChildrens  && domsChildrens.length > 0){     
        for (var i = 0; i < domsChildrens.length; i++) {
            dragCreateDom_PanelBody(domsChildrens[i].ui.displayType,$('#'+id),domsChildrens[i])
        }
    }

    objData[id] = editData;
}
function dragCreateDom_PanelBody(domval,that,editData){
    var id = $.generateGUID();
    generateObj(id);
    that.find('div.dom-panel-content').append(displayDOM(domval, id));
    //单个组件设置，列数(单个按钮除外)
    if(editData.ui.displayType !== 'HtmlDomDisplayType.Button'){
        var contentWidth = editData.ui.columns * 50;
        $('#'+id).css('width',contentWidth+'%');
        $('#'+id).attr('data-col',editData.ui.columns);
    }

    //单个组件设置,显示内容
    var spanText = "";
    switch(editData.ui.displayType) {
        case "HtmlDomDisplayType.StaticText":
            spanText="显示一些文字";break;
        case "HtmlDomDisplayType.StaticTextArea":
            spanText="显示一段文字";break;
        case "HtmlDomDisplayType.Image":
            spanText="显示一些图片";break;
    }
    $('#'+id).find('span').html(editData.ui.label ? editData.ui.label : spanText);
    $('#'+id).find("input[type='button']").val(editData.ui.label ?editData.ui.label :'按钮');
    $('#'+id).find('label').html(editData.ui.label);
    //还原，面板中的下拉数据。
    if(editData.ui.displayType === 'HtmlDomDisplayType.Select'){
        $.ajax({
            type: "GET",
            url: urlprefix + "/api/Template/GetBindData",
            data: $.getAuth({"bindMethod":editData.bindMethod,"bindTarget":editData.bindTarget}),
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function(r){
                if(r.code === "0") {
                    domElementUi(id,editData.bindMethod, r.data);
                }
            }
        })
    }
    //还原，按钮域下的,按钮组件
    if(domval === "HtmlDomDisplayType.ButtonRegion"){
        //手动设置 还原的按钮域，可放置按钮
        $('#'+id).droppable({  
            greedy: true,
            drop: function() {
                if(DOMvalue === 'HtmlDomDisplayType.Button'){
                    var idBtn = $.generateGUID();
                    generateObj(idBtn);
                    $(this).append(displayDOM(DOMvalue ,idBtn));
                }
            }
        })
        var domsChildrens = editData.childrens;

        if(domsChildrens  && domsChildrens.length > 0){     
            for (var i = 0; i < domsChildrens.length; i++) {
                dragCreateDom_Panel_ButtonRegion(domsChildrens[i].ui.displayType,$('#'+id),domsChildrens[i])
            }
        }
    }
    //还原单个组件的triggerdom option设置
    if(editData.name && editData.ui.label)  {
       cmdFormDom += `<option value="${editData.name}">${editData.ui.label}</option>`;
       $(".cmdFormDom").html(cmdFormDom);
    }
    objData[id] = editData;
}
function dragCreateDom_Panel_ButtonRegion(DOMvalue,that,editData){
    var id = $.generateGUID();
    generateObj(id);
    that.append(displayDOM(DOMvalue, id));

     $('#'+id).find("input[type='button']").val(editData.ui.label ?editData.ui.label :'按钮');
    
    objData[id] = editData;
}
//绑定页面拖拽的组件内容
function domElementUi (id , type , data) {
    var html = "";
    if(type === "HtmlDomDisplayType.Select" || type === "HtmlTemplate.Select"){
        for(var i = 0; i < data.length; i++){
            html += `<option>${data[i].text}</option>`;
        }
        // $("#"+id).find("select").html(html);  //对面板组件设置以后，子组件会被统一设置
        $("#"+id+">div>select").html(html);
    } else if (type === "HtmlDomDisplayType.Checkbox"){
        for (var i = 0; i < data.length; i++){
            html += `<label><input type="checkbox" value="${data[i].value}"> ${data[i].text}</label>`;
        }
        $("#"+id).find("label, input").remove();
        $("#"+id).append(html);
    } else if (type === "HtmlDomDisplayType.Radiobox"){
        for(var i = 0; i < data.length; i++){
            html += `<label><input type="radio" value="${data[i].value}">${data[i].text}</label>`;
        }
        $("#"+id).find("label, input").remove();
        $("#"+id).append(html);
    }
}

//切换数据源和DOM列表
$(".lists").on("click",function(){
    var name = $(this).data("name");
    $("#"+name).show().siblings().hide();
})
$("#collections").on("click", "div",function(){
    collection = $(this).data("value");
    $(".lists").eq(1).data("name","collectionsDetail");
    $.ajax({
        type: "GET",
        url: urlprefix + "/api/Template/GetFieldsByCollection",
        data: $.getAuth({data: collection}),
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function(res){
            if(res.code === "0"){
                $("#collections").hide();
                $("#collectionsDetail").show();
            }
            var html = "";
            res.data.forEach(function(el){
                html += `<div class="nowrap m-l-${el.depth}" data-value="${el.name}">${el.description}</div>`;
            })
            $("#collectionsDetailList").html(html);

            //拖拽
            $("#collectionsDetailList div").draggable({
                helper: "clone",
                revert: "invalid",
                zIndex: 100,
                start: function(){
                    bindField = $(this).data("value");
                    bindTitle = $(this).html();
                }
            });
        }
    })
})
$(".back-collections").on("click",function(){
    $("#collectionsDetail").hide();
    $(".lists").eq(1).data("name", "collections");
    $("#collections").show();
})

// $(".dom-panel-content").sortable({
//     revert: true
// })
// $(".dom-panel-content").droppable({
//     greedy: true,
//     drop: function(event, ui) {
//         if(DOMvalue){
//             var id = $.generateGUID();
//             generateObj(id);
//             $(this).append(displayDOM(DOMvalue, id));
//             DOMvalue = "";
//             $("#"+id).click();
//         }                
//     }
// });

$(document).on("click", ".btn-zoom", function(){
    var colNum = $(this).parent().data("col") || "";
    if(colNum === 2){
        $(this).parent().data("col", 1).css("width", "50%");
        $(this).find("i").removeClass("fa-compress").addClass("fa-expand");
    }
    else if (colNum === 1){
        $(this).parent().data("col", 2).css("width", "100%");
        $(this).find("i").removeClass("fa-expand").addClass("fa-compress");
    }
    
})

//生成对应对象
function generateObj(id) {
    if (!objData.id) {
        objData[id] = {
            "name": "",//绑定字段
            "value": "",//默认值
            "bindMethod": "",
            "bindTarget": "",
            "cmds": [{
                name: "",
                formTemplate: "",
                triggerDom: "",
                triggerWhere: null,
                triggerUrl: "",
                bindParamFields: "",
            }],
            "ui": {
                "label": "",//标题
                "displayType": DOMvalue,
                "placeholder": "",
                "sort": 0,
                "columns": 0,
                "attrs": [
                    {
                        "key": "",
                        "value": "",
                    },
                ],
                "classes": [
                    {
                        "key": "",
                        "value": "",
                    },
                ],
                "disabled":false,
                "hidden":false,
                "required":false,
                "multiple":false,
            },            
            "description": ""
        };
    }
}

$(document).on("click", ".element-wrap, .dom-panel", function(){
    var _self = $(this);
    var id = _self.attr("id");
    activeId = id;
    // console.log(objData[id])
    //绑定值
    $("#bindTitle").val(objData[id].ui.label);
    $("#displayType").val(objData[id].ui.displayType);
    $("#bindField").val(objData[id].name);
    $("#bindMethod").val(objData[id].bindMethod);
    $("#bindTarget").val(objData[id].bindTarget);

    if($("#bindMethod").val() && $("#bindTarget").children().length == 0){  //编辑时有值，但是无optiobns选项
        $.ajax({
            type: "GET",
            url: urlprefix + "/api/Template/GetBindTarget",
            data: $.getAuth({"bindMethod":$("#bindMethod").val()}),
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function(r){
                if(r.code === "0" && r.data){
                    bindSelect(r.data, "请选择绑定目标", "bindTarget");
                    $("#bindTarget").val(objData[id].bindTarget);
                }                        
            }
        })
    }else {
        $("#bindTarget").val(objData[id].bindTarget);  //新建表单时
    }

    $("#bindPlaceholder").val(objData[id].ui.placeholder);
    // $("#bindAttr").val(objData[id].bindAttr);
    // $("#bindCss").val(objData[id].bindCss);
    // bindCmds(objData[id].ui.cmds);
    bindCmds(objData[id].cmds);
    bindAttrAndCss("attrGroup", objData[id].ui.attrs);
    bindAttrAndCss("cssGroup", objData[id].ui.classes);
    $("#bindDisabled").prop("checked",objData[id].ui.disabled);
    $("#bindHide").prop("checked",objData[id].ui.hidden);
    $("#bindRequired").prop("checked",objData[id].ui.required);
    $("#bindMulti").prop("checked",objData[id].ui.multiple);
    $("#bindDescription").val(objData[id].description);
    return false;
})

//分别绑定属性和样式
function bindAttrAndCss(obj, data) {
    $("#"+obj).find(".form-inline").remove();
    var html = "";
    // data.forEach(function(el){
    //     if(el.key && el.value)
    //     html += `<div class="form-inline">
    //             <div class="form-group">
    //                 <input type="text" class="form-control input-sm m-b-10 w100" placeholder="键" name="key" value="${el.key}">
    //             </div>
    //             <div class="form-group">
    //                 <input type="text" class="form-control input-sm m-b-10 w100" placeholder="值" name="value" value="${el.value}">
    //             </div>
    //             <div class="form-group">
    //                 <i class="fa fa-minus-circle delnotes" data-name="attr" aria-hidden="true"></i>
    //             </div>
    //         </div>`;
    // })
    if(data){   //面板组件的data没有保存的key value时返回null
        data.forEach(function(el){
            if(el.key && el.value)
            html += `<div class="form-inline">
                    <div class="form-group">
                        <input type="text" class="form-control input-sm m-b-10 w100" placeholder="键" name="key" value="${el.key}">
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control input-sm m-b-10 w100" placeholder="值" name="value" value="${el.value}">
                    </div>
                    <div class="form-group">
                        <i class="fa fa-minus-circle delnotes" data-name="attr" aria-hidden="true"></i>
                    </div>
                </div>`;
        })
    }  

    html += `<div class="form-inline">
            <div class="form-group">
                <input type="text" class="form-control input-sm m-b-10 w100" placeholder="键" name="key">
            </div>
            <div class="form-group">
                <input type="text" class="form-control input-sm m-b-10 w100" placeholder="值" name="value">
            </div>
            <div class="form-group">
                <i class="fa fa-plus-circle addnotes" data-name="attr" aria-hidden="true"></i>
            </div>
        </div>`;
     $("#"+obj).append(html);
}

//绑定cmds
function bindCmds(data) {
    $("#cmdsGroup").find(".form-inline").remove();
    var html = "";
    data.forEach(function(el,index){
        var triggerWhereHtml = "";
        if(el.name || el.formTemplate ||   el.triggerUrl || el.bindParamFields || el.triggerWhere || el.triggerDom){
            if(el.triggerWhere){
                el.triggerWhere.forEach(function(triggerWhereSon){
                    triggerWhereHtml += `                            
                            <div class="formTemplate-wrap">
                                <div class="form-group">
                                    <input type="text" class="form-control input-sm m-b-10 w100 cmdTriggerWhere" placeholder="键" name="key" value="${triggerWhereSon.key}">
                                </div>
                                <div class="form-group">
                                    <input type="text" class="form-control input-sm m-b-10 w100" placeholder="值" name="value" value="${triggerWhereSon.value}">
                                </div>
                                <div class="form-group">
                                    <i class="fa fa-minus-circle delnotes" data-name="formTemplate" aria-hidden="true"></i>
                                </div>
                            </div>`
                })
            }
             triggerWhereHtml += `                            
                <div class="formTemplate-wrap">
                    <div class="form-group">
                        <input type="text" class="form-control input-sm m-b-10 w100 cmdTriggerWhere" placeholder="键" name="key">
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control input-sm m-b-10 w100" placeholder="值" name="value">
                    </div>
                    <div class="form-group">
                        <i class="fa fa-plus-circle addnotes" data-name="formTemplate" aria-hidden="true"></i>
                    </div>
                </div>`
            html += `<div class="form-inline form-inline-${index}">
                        <div class="form-group">
                            <label for="">命令栏—命令名称：</label><br>
                            <select class="form-control input-sm m-b-10 cmdOptions" placeholder="命令名称">${cmdOptions}</select>
                        </div>
                         <div class="form-group">
                             <label for="">命令栏—表单模板：</label><br>
                            <select class="form-control input-sm m-b-10 cmdFormTemplate" placeholder="请选择表单模板">${cmdFormTemplateOption}</select>
                        </div>
                        <div class="form-group">
                            <label for="触发Dom">命令栏—触发Dom：</label><br>
                            <select class="form-control input-sm m-b-10 cmdFormDom" placeholder="触发Dom">${cmdFormDom}</select>
                        </div>
                        <div class="triggerWhereGroup">
                             <label for="">命令栏—键值对：</label>
                            `+ triggerWhereHtml +`
                        </div>
                        <div class="form-group">
                            <label for="">命令栏—触发地址：</label><br>
                            <input type="text" class="form-control input-sm m-b-10 cdmAddress" placeholder="触发地址" value="${el.triggerUrl}">
                        </div>
                        <div class="form-group">
                            <label for="">命令栏—绑定字段集合：</label><br>
                            <input type="text" class="form-control input-sm m-b-10 cmdFields" placeholder="绑定字段集合" value="${el.bindParamFields.join(",")}" disabled>
                        </div>
                        <i class="fa fa-minus-circle delnotes" data-name="cmds" aria-hidden="true"></i>
                    </div>
                    <script>
                        $('.form-inline-${index} select.cmdOptions').val('${el.name}')
                        $('.form-inline-${index} select.cmdFormTemplate').val('${el.formTemplate}');
                        $('.form-inline-${index} select.cmdFormDom').val('${el.triggerDom}');    //设置命令栏-触发dom
                    </script>`;

        }
    })
    html += `<div class="form-inline">
        <div class="form-group">
            <label for="">命令栏—命令名称：</label><br>
            <select class="form-control input-sm m-b-10 cmdOptions" placeholder="命令名称">${cmdOptions}</select>
        </div>
        <div class="form-group">
             <label for="">命令栏—表单模板：</label><br>
            <select class="form-control input-sm m-b-10 cmdFormTemplate" placeholder="请选择表单模板">${cmdFormTemplateOption}</select>
        </div>
        <div class="form-group">
            <label for="触发Dom">命令栏—触发Dom：</label><br>
            <select class="form-control input-sm m-b-10 cmdFormDom" placeholder="触发Dom">${cmdFormDom}</select>
        </div>
        <div class="triggerWhereGroup">
            <label for="">命令栏—键值对：</label>
            <div class="formTemplate-wrap">
                <div class="form-group">
                    <input type="text" class="form-control input-sm m-b-10 w100 cmdTriggerWhere" placeholder="键" name="key">
                </div>
                <div class="form-group">
                    <input type="text" class="form-control input-sm m-b-10 w100" placeholder="值" name="value">
                </div>
                <div class="form-group">
                    <i class="fa fa-plus-circle addnotes" data-name="formTemplate" aria-hidden="true"></i>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="">命令栏—触发地址：</label><br>
            <input type="text" class="form-control input-sm m-b-10 cdmAddress" placeholder="触发地址">
        </div>
        <label for="">命令栏—绑定字段集合：</label><br>
        <div class="form-group">
            <input type="text" class="form-control input-sm m-b-10 cmdFields" placeholder="绑定字段集合" disabled>
        </div>
        <i class="fa fa-plus-circle addnotes" data-name="cmds" aria-hidden="true"></i>
    </div>`; 
    $("#cmdsGroup").append(html);
    $(".cmdFields, .cmdTriggerWhere").droppable({
        drop: function(event, ui){
            /******11.17 add : 拖入以后则禁止输入  start********/
            $(this).attr('disabled','disabled')
            /******11.17 add : 拖入以则禁止输入  end********/
            if($(this).val()){               
                // $(this).data("value", $(this).data("value") +","+bindField);
                
                /******11.17 update : 可以先输入再拖入  start********/
                    $(this).data("value", $(this).data("value") ? $(this).data("value") : $(this).val() +","+bindField);
                /******11.17 update : 可以先输入再拖入  end********/

                $(this).val($(this).val()+","+bindTitle);
            }else{
                $(this).data("value", bindField);
                $(this).val(bindTitle);
            }
        }
    })
}

//关闭dom-panel
$("#formDomTarget").on("click", ".del-panel", function(){
    $(this).parent().remove();
})

//关闭dom-panel下的行
$("#formDomTarget").on("click", ".del-panel-field",function(){
    var parent = $(this).parent();
    var id = parent.attr("id");
    parent.remove();
    delete objData[id];
    return false;
})

//拖拽赋值
$("#bindField, #bindTitle").droppable({
    drop: function( event, ui ) {
        if(!activeId){return false}   //在没有拖入面板之前，就先拖入数据
        $("#bindField").val(bindField);
        $("#bindTitle").val(bindTitle);
        // $("#"+activeId).find("label").html(bindTitle);  面板组件拖入值时，子组件label都会被赋予 面板的拖入值
        $("#"+activeId+">label").html(bindTitle);  
    }
});
$("#formDomTarget").droppable({
    drop: function(event, ui) {
        if(DOMvalue){                    
            if(DOMvalue === "HtmlDomDisplayType.Panel"){
                var id = $.generateGUID();
                generateObj(id);
                $(this).append(displayDOM(DOMvalue, id));
                $(".dom-panel-content").sortable({
                    revert: true
                })
                $(".dom-panel-content").droppable({
                    greedy: true,
                    drop: function(event, ui) {
                        if(DOMvalue){
                            if(DOMvalue === "HtmlDomDisplayType.Panel"){   //面板不能再嵌入面板
                                return false;
                            }
                            var id = $.generateGUID();
                            generateObj(id);
                            $(this).append(displayDOM(DOMvalue, id));
                            if(DOMvalue === "HtmlDomDisplayType.ButtonRegion"){
                                $("#"+id).droppable({
                                    greedy: true,
                                    drop: function(event ,ui){
                                        if(DOMvalue === "HtmlDomDisplayType.Button"){
                                            var id = $.generateGUID();
                                            generateObj(id);
                                            //$(this).append(`<input type="button" class="btn btn-default" value="按钮"/>`);
                                            $(this).append(displayDOM("HtmlDomDisplayType.Button", id));
                                        }
                                        DOMvalue = "";
                                        $("#"+id).click();
                                    }
                                })
                            }
                            DOMvalue = "";
                            $("#"+id).click();
                        }
                    }
                });
                $("#"+id).click();
            }else if (DOMvalue === ""){
                $(this).find(".time-range").daterangepicker({
                    "startDate": "10/12/2017",
                    "endDate": "10/18/2017"
                }, function(start, end, label) {
                console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
                });
            }
            DOMvalue = "";
        }                
    }
});
$("#formDomTarget").sortable({
    placeholder: "ui-state-highlight",
    revert: true
})

//返回对应拖动的DOM
function displayDOM(key, id) {
    switch(key) {
        case "HtmlDomDisplayType.Hidden": 
            return $(returnDom(`<label></label><input type='text' class='form-control input-sm' placeholder="">`, id));
            break;
        case "HtmlDomDisplayType.Text":
            return $(returnDom(`<label></label><input type='text' class='form-control input-sm' placeholder="">`, id));
            break;
        case "HtmlDomDisplayType.Textarea":
            return $(returnDom(`<label></label><textarea class='form-control' placeholder='' style="height: 30px;"></textarea>`, id));
            break;
        case "HtmlDomDisplayType.Select":
            return $(returnDom(`<div class="col-lg-6"><select class="form-control input-sm" placeholder="下拉框"></select></div>`, id));
            break;
        case "HtmlDomDisplayType.Checkbox":
            return $(returnDom(`<input type="checkbox">`, id));
            break;
        case "HtmlDomDisplayType.Radiobox":
            return $(returnDom(`<input type="radio">`, id));
            break;
        case "HtmlDomDisplayType.Upload":
            return $(returnDom(`<input type='file' class='form-control'>`, id));
            break;
        case "HtmlDomDisplayType.Panel":
            return $(`<div class="dom-panel" id="${id}">
                    <button class="btn btn-default btn-xs del-panel" title="删除该面板"><i class="fa fa-times"></i></button>
                    <div class="dom-panel-content"></div></div>`);
            break;
        case "HtmlDomDisplayType.Tags":
            return $(returnDom(`<label></label><input type='text' class='form-control' placeholder=''>`, id));
            break;
        case "HtmlDomDisplayType.Date":
            return $(returnDom(`<input type="date" class="form-control">`, id));
            break;
        case "HtmlDomDisplayType.Password":
            return $(returnDom(`<label></label><input type='password' class='form-control' placeholder=''>`, id));
            break;
        case "HtmlDomDisplayType.DateRange":
            return $(returnDom(`<div class="time-range"></div>`, id));
            break;
        case "HtmlDomDisplayType.Button":
            return $(`<div class="element-wrap" id="${id}" data-col="1" style="display: inline-block;width: unset;transform:scale(0.7);top:-10px;left:-10px;">
                            <button class="btn btn-default btn-xs del-panel-field" title="删除该组件"><i class="fa fa-times"></i>
                            </button><input type="button" class="btn btn-default" value="按钮"></div>`);
            break;
        case "HtmlDomDisplayType.ButtonRegion": 
            return $(returnDom(``, id));
            break;
        case "HtmlDomDisplayType.Submit":
            return $(returnDom(`<button type='submit' class='btn btn-info'>提交</button>`, id));
            break;
        case "HtmlDomDisplayType.AddressSelect":
            return $(returnDom(`<div class="col-lg-3"><select class="form-control address-select"></select></div>
                        <div class="col-lg-3"><select class="form-control address-select"></select></div>
                        <div class="col-lg-6"><input type="text" class="form-control address-input" placeholder="详细地址"></div>`, id));
            break;

        case "HtmlDomDisplayType.Text":
            return $(returnDom(`<input type='text' class='form-control input-sm' placeholder='输入框'>`, id));
            break;
        case "HtmlDomDisplayType.StaticText":
            return $(returnDom(`<span>显示一些文字</span>`, id));
        case "HtmlDomDisplayType.StaticTextArea":
            return $(returnDom(`<span>显示一段文字</span>`, id));
            break;
       case "HtmlDomDisplayType.Table":
            return $(`<div class="element-wrap" id="${id}" data-col="2" style="width:100%;min-height:100px;">
                                <button class="btn btn-default btn-xs del-panel-field" title="删除该组件"><i class="fa fa-times"></i></button>
                                <div class="table-wrap" style="height:100%;"></div></div>`);
            break;
        case "HtmlDomDisplayType.Image":
            return $(returnDom(`<span>显示一些图片</span>`, id));
            break;   
        case  "HtmlDomDisplayType.DateTime":
            return $(returnDom(`<span>待定，先放着吧</span>`, id));
            break;   
        case "HtmlDomDisplayType.TimeSpan" :
            return $(returnDom(`<span>待定，先放着吧</span>`, id));
            break;                 
        default :
            return "";
            break;
    }
}
function returnDom(html, id) {
    return `<div class="element-wrap" id="${id}" data-col="1">
            <button class="btn btn-default btn-xs btn-zoom"><i class="fa fa-expand"></i></button>
            <button class="btn btn-default btn-xs del-panel-field" title="删除该组件"><i class="fa fa-times"></i></button>${html}</div>`;
}

//添加属性或样式
$(".additional").on("click", ".addnotes", function(){
     var name = $(this).data("name");
     if(name === "attr"){
         $(this).parent().parent().parent().append(`<div class="form-inline"><div class="form-group">
                                                     <input type="text" class="form-control input-sm m-b-10 w100" placeholder="键" name="key"></div>
                                                     <div class="form-group"><input type="text" class="form-control input-sm m-b-10 w100" placeholder="值" name="value"></div>
                                                     <div class="form-group"><i class="fa fa-plus-circle addnotes" data-name="attr" aria-hidden="true"></i></div>
                                                     </div>`);
     }else if (name === "css"){
         $(this).parent().parent().parent().append(`<div class="form-inline"><div class="form-group">
                                                     <input type="text" class="form-control input-sm m-b-10 w100" placeholder="键" name="key"></div>
                                                     <div class="form-group"><input type="text" class="form-control input-sm m-b-10 w100" placeholder="值" name="value"></div>
                                                     <div class="form-group"><i class="fa fa-plus-circle addnotes" data-name="css" aria-hidden="true"></i></div>
                                                     </div>`);
     }else if (name === "cmds"){
        $(this).parent().parent().append(`<div class="form-inline">
                                            <div class="form-group">
                                                <label for="">命令栏—命令名称：</label><br>
                                                <select class="form-control input-sm m-b-10 cmdOptions" placeholder="命令名称">${cmdOptions}</select>
                                            </div>
                                            <div class="form-group">
                                                <label for="">命令栏—表单模板：</label><br>
                                                <select class="form-control input-sm m-b-10 cmdFormTemplate" placeholder="请选择表单模板">${cmdFormTemplateOption}</select>
                                            </div>
                                            <div class="form-group">
                                                <label for="触发Dom">命令栏—触发Dom：</label><br>
                                                <select class="form-control input-sm m-b-10 cmdFormDom" placeholder="触发Dom">${cmdFormDom}</select>
                                            </div>
                                            <div class="triggerWhereGroup">
                                                <label for="">命令栏—键值对：</label>
                                                <div class="formTemplate-wrap">
                                                    <div class="form-group">
                                                        <input type="text" class="form-control input-sm m-b-10 w100 cmdTriggerWhere" placeholder="键" name="key">
                                                    </div>
                                                    <div class="form-group">
                                                        <input type="text" class="form-control input-sm m-b-10 w100" placeholder="值" name="value">
                                                    </div>
                                                    <div class="form-group">
                                                        <i class="fa fa-plus-circle addnotes" data-name="formTemplate" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="">命令栏—触发地址：</label><br>
                                                <input type="text" class="form-control input-sm m-b-10 cdmAddress" placeholder="触发地址" value="">
                                            </div>
                                            <label for="">命令栏—绑定字段集合：</label><br>
                                            <div class="form-group">
                                                <input type="text" class="form-control input-sm m-b-10 cmdFields" placeholder="绑定字段集合" disabled>
                                            </div>
                                            <i class="fa fa-plus-circle addnotes" data-name="cmds" aria-hidden="true"></i>
                                        </div>`);

        $(".cmdFields, .cmdTriggerWhere").droppable({
            drop: function(event, ui){
                if($(this).val()){
                    $(this).data("value", $(this).data("value")+","+bindField);
                    $(this).val($(this).val()+","+bindTitle);
                }else{
                    $(this).data("value", bindField);
                    $(this).val(bindTitle);
                }
            }
        })
    }else if (name === "formTemplate"){
        $(this).parent().parent().parent().append(`<div class="formTemplate-wrap">
                                                    <div class="form-group">
                                                        <input type="text" class="form-control input-sm m-b-10 w100 cmdTriggerWhere" placeholder="键" name="key">
                                                    </div>
                                                    <div class="form-group">
                                                        <input type="text" class="form-control input-sm m-b-10 w100" placeholder="值" name="value">
                                                    </div>
                                                    <div class="form-group">
                                                        <i class="fa fa-plus-circle addnotes" data-name="formTemplate" aria-hidden="true"></i>
                                                    </div>
                                                </div>`);
        $(".cmdTriggerWhere").droppable({
            drop: function(event, ui){
                if($(this).val()){
                    $(this).data("value", $(this).data("value")+","+bindField);
                    $(this).val($(this).val()+","+bindTitle);
                }else{
                    $(this).data("value", bindField);
                    $(this).val(bindTitle);
                }
            }
        })
    }
     $(this).removeClass("fa-plus-circle addnotes").addClass("fa-minus-circle delnotes");
})
//删除属性或样式
$(".additional").on("click", ".delnotes", function(){
    if($(this).data("name") === "cmds"){
        $(this).parent().remove();
    }else{
        $(this).parent().parent().remove();
    }  
})

//保存数据
function save(){
    if(activeId){
        objData[activeId] = {            
            "name": $("#bindField").val(),
            "bindMethod": $("#bindMethod").val(),
            "bindTarget": $("#bindTarget").val(),
            "cmds": saveCmds(),
            ui: {
                "label": $("#bindTitle").val(),
                "displayType": $("#displayType").val(),
                "placeholder": $("#bindPlaceholder").val(),
                "attrs": saveAttrAndCss("attrGroup"),
                "classes": saveAttrAndCss("cssGroup"),
                "disabled": $('#bindDisabled').is(':checked'),
                "hidden": $('#bindHide').is(':checked'),
                "required": $('#bindRequired').is(':checked'),
                "multiple": $('#bindMulti').is(':checked')
            },
            "description": $("#bindDescription").val()
        }
        //命令栏-触发dom
        //只有在'有标题，有绑定值的情况下'，才能添加'触发dom的选项'
        if(objData[activeId].name && objData[activeId].ui.label)  
        {
            //循环“触发dom”里面，的options。如果和要添加的重复（key和value都有相等），则不用添加。
            var cmdFormDomOptions = $('#cmdsGroup select.cmdFormDom option');
            var cmdFormDomOptionsAdd = true;
            for (var i = 0; i < cmdFormDomOptions.length; i++) {
                 var option = $("#cmdsGroup select.cmdFormDom option:eq("+i+")")
                 if(option.text() == objData[activeId].ui.label && option.val() == objData[activeId].name){   
                    cmdFormDomOptionsAdd = false;
                    break;
                 }
            }
            // console.log(cmdFormDomOptionsAdd)
            if(cmdFormDomOptionsAdd){
                cmdFormDom += `<option value="${objData[activeId].name}">${objData[activeId].ui.label}</option>`;
                $(".cmdFormDom").html(cmdFormDom);  
            }

        }


        if($("#displayType").val() === "HtmlDomDisplayType.Button"){
            $("#" + activeId).find("input").val($("#bindTitle").val());
        }
    }
}

//保存cmds
function saveCmds(){
    var arr = [];
    $("#cmdsGroup").find(".form-inline").each(function(){
        var _self = $(this);
         var arrChild = {
            name: _self.find(".cmdOptions").val(),
            formTemplate: _self.find(".cmdFormTemplate").val(),
            triggerDom:_self.find(".cmdFormDom").val(),
            triggerWhere: saveTriggerWhere(_self.find(".triggerWhereGroup")),
            triggerUrl: _self.find(".cdmAddress").val(),
            bindParamFields: _self.find(".cmdFields").data("value") ? _self.find(".cmdFields").data("value").split(",") : []
        };
        var arrChildValid = false;
        $.each(arrChild,function(key,val){
            if(typeof val === "object"){
               if(val && val.length>0){ arrChildValid = true; }     
            }else{
                if(val){ arrChildValid = true;}
            }
        })
        if(arrChildValid){arr.push(arrChild)}
    })
    return arr;
}

//保存触发条件
function saveTriggerWhere(obj) {
    var arr = [];
    obj.find(".formTemplate-wrap").each(function(){
        var _self = $(this);
        // var value1 = _self.find("input[name=key]").data("value");

        /******11.17 update : 如果有拖入的值，则使用拖入的值。没有拖入的值，使用输入的值  start********/
        var value1 = _self.find("input[name=key]").data("value") ||  _self.find("input[name=key]").val(); 
        /******11.17 update : end********/
        var value2 = _self.find("input[name=value]").val();
        if(value1 && value2) {
            arr.push({key: value1,value:value2});
        }
    })
    return arr.length > 0 ? arr : null;
}

//保存属性和样式
function saveAttrAndCss(obj){
    var arr = [];
    $("#"+obj).find(".form-inline").each(function(){
        var _self = $(this);
        var value1 = _self.find("input[name=key]").val();
        var value2 = _self.find("input[name=value]").val();
        if(value1 && value2) {
            arr.push({key: value1,value:value2});
        }        
    })
    return arr.length > 0 ? arr : null;
}

//dom数据
// function boxDom() {
//     var dom = [];
//     $(".dom-panel").each(function(index, element){
//         var panelId = $(this).attr("id");
//         var arr = [];
//         $(this).find(".element-wrap").each(function(i, el){
//             var wrapId = $(this).attr("id");
//             objData[wrapId].ui.sort = i;
//             objData[wrapId].ui.columns = $(this).data("col");
//             arr.push(objData[wrapId]);
//         })
//         if(index === 0) {
//             arr.push({bindMethod:"",bindTarget:null,description:"",name:"id",ui:{attrs:null,classes:null,columns:1,disabled:false,displayType:"HtmlDomDisplayType.Hidden",hidden:true,label:"",multiple:false,placeholder:"",required:false,sort:0}})
//         }
//         objData[panelId].childrens = arr;
//         objData[panelId].ui.sort = index;
//         objData[panelId].ui.columns = 2;
//         dom.push(objData[panelId]);
//     })
//     //dom[0].childrens.append()
//     return dom;
// }
function boxDom() {
    var dom = [];
    $(".dom-panel").each(function(index, element){
        var panelId = $(this).attr("id");
        var arr = [];
        $(this).children(".dom-panel-content").children(".element-wrap").each(function(i, el){
            var wrapId = $(this).attr("id");
            objData[wrapId].ui.sort = i;
            objData[wrapId].ui.columns = $(this).data("col");

            var arr_ = [];
            if($(this).children(".element-wrap").length > 0){
                $(this).children(".element-wrap").each(function(item, e){
                    var wrapId_ = $(this).attr("id");
                    objData[wrapId_].ui.sort = i;
                    objData[wrapId_].ui.columns = $(this).data("col");
                    arr_.push(objData[wrapId_])
                })
                objData[wrapId].childrens = arr_;
            }

            arr.push(objData[wrapId]);
        })
        if(index === 0) {
            arr.push({bindMethod:"",bindTarget:null,description:"",name:"id",ui:{attrs:null,classes:null,columns:1,disabled:false,displayType:"HtmlDomDisplayType.Hidden",hidden:true,label:"",multiple:false,placeholder:"",required:false,sort:0}})
        }
        objData[panelId].childrens = arr;
        objData[panelId].ui.sort = index;
        objData[panelId].ui.columns = 2;
        dom.push(objData[panelId]);
    })
    return dom;
}

//保存表单模板
function saveTemplate() {
    var name = $("#templateName").val();
    var title = $("#templateTitle").val();
    var platform = $("#templatePlatform").val();
    var description = $("#templateDescription").val();
    var tags = $("#templateTags").val() ? $("#templateTags").val().split(",") : null;
    var data = {
            "name": name,
            "title": title,
            "platform": platform,
            "collection": collection,
            "description": description,
            "tags": tags,
            "doms": boxDom(),
    };
    var detailTemplateOperateUrl = '';        
    if(detailId){    //编辑模板
        detailTemplateOperateUrl  = 'Update';
        data.id = detailId    
    }else{         //新增模板
        detailTemplateOperateUrl  = 'Add';  
    }
    // console.log(data)
    $.ajax({
        type: "POST",
        url: urlprefix + "/api/Template/"+detailTemplateOperateUrl+"FormTemplate", 
        data: $.postAuth(data),
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function(res) {
            console.log(res)
            if(res.code === "0"){
                alert("保存成功");
            }
        }
    })
}
function setParentIframeHeight(){
    // console.log('加载了')
    var obj = parent.document.getElementById("parentFrame"); //取得父页面IFrame对象 
    // console.log(this.document.getElementsByTagName('section')[0].scrollHeight)
    // console.log(obj.height)
    obj.height = this.document.getElementsByTagName('section')[0].scrollHeight;
    // console.log(obj.height)
}