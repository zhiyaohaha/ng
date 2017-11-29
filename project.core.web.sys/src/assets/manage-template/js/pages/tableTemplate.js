var templateCloneLi;
var displayTypeOptions = `<option>请选择展示类型</option>`;//展示类型选项值
var filterTypeOptions = `<option>请选择筛选类型</option>`;//筛选类型选项值
var bindMethodOptions = `<option>请选择绑定方式</option>`;//多选数据选项值
var fieldPipeOptions = `<option value="">文本</option>`;//管道选项值
var DOMvalue = ""; //拖拽的元素的字段
var DOMdescription = ""; //拖拽元素的标题

var collectionsContent; //下拉数据源选择过后的数据内容

var detailId = ""; //查询详情的ID

$(document).ready(function(){
    $("#templateFields ul li").droppable({
        drop: function(event, ui){
            $(this).find(".fieldName").val(DOMvalue);
            $(this).find(".fieldLabel").val(DOMdescription);
            if($.repeatStr(DOMvalue, ".") > 0){
                $(this).find(".fieldNested").prop("checked", true);
            }else{
                $(this).find(".fieldNested").prop("checked", false);
            }
        }
    })

    $("#templateFilters ul li").droppable({
        drop: function(event, ui){
            var str = $(this).find(".filterField").val();
            var value = $(this).find(".filterField").data("value");
            if(str){
                str += ","+DOMdescription;
                value += ","+DOMvalue;
            }else{
                str = DOMdescription;
                value = DOMvalue;
            }
            $(this).find(".filterField").val(str).data("value", value);
        }
    })

    $("#templateSorts ul li").droppable({
        drop: function(event, ui){
            $(this).find(".sortField").val(DOMdescription).data("value", DOMvalue);
        }
    })

    $("#templateFilters").on("change", ".bindMethod", function(){
        var _self = $(this);
        $.ajax({
            type: "GET",
            url: urlprefix + "/api/Template/GetBindTarget",
            data: $.getAuth({"bindMethod": _self.val()}),
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function(r){
                if(r.code === "0" && r.data){
                    var node = _self.parentsUntil("#templateFilters").find(".bindTarget");
                    node.append(`<option>请选择绑定目标</option>`);
                    for (var i = r.data.length - 1; i >= 0; i--) {
                        node.append(`<option value="${r.data[i].value}">${r.data[i].text}</option>`);
                    }
                }                        
            }
        })
    })

    detailId = $.request("id") || "";
})
//绑定平台下拉框
$.ajax({
    type: "GET",
    url: urlprefix + "/api/Template/GetTableTemplateFormData",
    data: $.getAuth(),
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    dataType: "json",
    success: function( res ) {
        if(res.code === "0") {
            // 数据源
            // var collections = "";
            // res.data.collections.forEach(function(el){
            //     collections += `<div data-value="${el.value}">${el.text}</div>`;
            // })
            // $("#collections").html(collections);
            bindSelect(res.data.collections, "请选择数据源", "collections");

            //平台
            bindSelect(res.data.platforms, "请选择平台", "templatePlatform");

            //绑定方式
            for (var i = res.data.bindMethod.length - 1; i >= 0; i--) {                
                bindMethodOptions += `<option value="${res.data.bindMethod[i].value}">${res.data.bindMethod[i].text}</option>`;
            }
            $(".bindMethod").append(bindMethodOptions);

            //管道
            for (var i = 0; i < res.data.pipes.length; i++) {
                fieldPipeOptions += `<option value="${res.data.pipes[i].value}">${res.data.pipes[i].text}</option>`;
            }
            $(".fieldPipe").append(fieldPipeOptions);
            
            //展示类型
            var displayTypes = res.data.displayTypes;
            for(var i = 0; i < displayTypes.length; i++){
                displayTypeOptions += `<option value="${displayTypes[i].value}">${displayTypes[i].text}</option>`;
            }
            $(".displayType").html(displayTypeOptions);

            //筛选类型
            var filterTypes = res.data.filterTypes;
            for(var i = 0; i < filterTypes.length; i++){
                filterTypeOptions += `<option value="${filterTypes[i].value}">${filterTypes[i].text}</option>`;
            }
            $(".filterType").html(filterTypeOptions);

            if(detailId){
                getDetail();
            }            
        }
    }
})

//下拉框值改变，获取值
$("#collections").on("change", function(){
    $.ajax({
        type: "GET",
        url: urlprefix + "/api/Template/GetFieldsByCollection",
        data: $.getAuth({data:$(this).val()}),
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        success: function(res){
            if(res.code === "0" && res.data.length > 0){
                var html = "";
                collectionsContent = res.data;
                res.data.forEach(function(item, index, arr){
                    html += `<div data-name="${item.name}" data-description="${item.description}" class="m-l-${item.depth} nowrap">${item.description}</div>`;
                })
                $("#collectionsContent").html(html).find("div").draggable({
                    helper: "clone",
                    revert: "invalid",
                    zIndex: 100,
                    start: function() {
                        DOMvalue = $(this).data("name");
                        DOMdescription = $(this).data("description");
                    },
                    drag: function() {},
                    stop: function() {}
                });
            }
        },
        error: function(res){
            console.log(res);
        }
    })
})

//添加各项
$(".table-content").on("click", ".addnotes", function(){
    var name = $(this).data("name");
    var parent = $(this).parent().parent().parent().parent();
    if(name === "header"){
        parent.append(`
        <li>
            <div class="row m-b-10">
                <div class="col-lg-3">
                    <label for="">表头字段：</label>
                    <input type="text" class="form-control input-sm m-b-10 fieldName" placeholder="请填写一个表头字段">
                </div>
                <div class="col-lg-3">
                    <label for="">表头标题：</label>
                    <input type="text" class="form-control input-sm m-b-10 fieldLabel" placeholder="请填写一个表头标题">
                </div>
                <div class="col-lg-3">
                    <label for="">表格管道：</label>
                    <select class="form-control input-sm fieldPipe" placeholder="请选择一个管道">${fieldPipeOptions}</select>
                </div>
                <div class="col-lg-1 checkbox">
                    <label><input type="checkbox" class="fieldHidden">隐藏</label>
                    <label><input type="checkbox" class="fieldNested" disabled>嵌套</label>
                </div>
                <div class="col-lg-2">
                    <i class="fa fa-plus-circle addnotes" data-name="header" aria-hidden="true"></i>
                </div>
            </div>
        </li>
        `);
        parent.find("li:last").droppable({
            drop: function(event, ui){
                $(this).find(".fieldName").val(DOMvalue);
                $(this).find(".fieldLabel").val(DOMdescription);
                if($.repeatStr(DOMvalue, ".") > 0){
                    $(this).find(".fieldNested").prop("checked", true);
                }else{
                    $(this).find(".fieldNested").prop("checked", false);
                }
            }
        })
    }else if (name === "filter"){
        parent.append(`
        <li>
            <div class="row">
                <div class="col-lg-3 m-b-10">
                    <label for="">绑定项名称：</label>
                    <input type="text" class="form-control input-sm bindName" placeholder="请输入绑定项名称">
                </div>
                <div class="col-lg-3 m-b-10">
                    <label for="">筛选项标题：</label>
                    <input class="form-control input-sm filterUiLabel" type="text" placeholder="请填写筛选项标题">
                </div>
                <div class="col-lg-3 m-b-10">
                    <label for="">筛选项默认值：</label>
                    <input class="form-control input-sm filterValue" type="text" placeholder="请填写筛选项默认值">
                </div>
                <div class="col-lg-1 m-b-10 checkbox">
                    <label><input type="checkbox" class="filterUiHidden">隐藏</label>
                </div>
                <div class="col-lg-2">
                    <i class="fa fa-plus-circle addnotes" data-name="filter" aria-hidden="true"></i>
                </div>
                <div class="col-lg-3 m-b-10">
                    <label for="">筛选类型：</label>
                    <select class="form-control input-sm filterType" placeholder="请选择一个筛选类型">${filterTypeOptions}</select>
                </div>
                <div class="col-lg-9 m-b-10">
                    <label for="displayType">展示类型：</label>
                    <select class="form-control input-sm displayType filterUiDisplayType" placeholder="请选择一个展示类型">${displayTypeOptions}</select>
                </div>
                <div class="col-lg-3 m-b-10">
                    <label for="bindMethod">绑定方式：</label>
                    <select class="form-control input-sm bindMethod" placeholder="请选择">${bindMethodOptions}</select>
                </div>
                <div class="col-lg-3 m-b-10">
                    <label for="bindTarget">绑定目标：</label>
                    <select class="form-control input-sm bindTarget" placeholder="请选择"></select>
                </div>
                <div class="col-lg-3 m-b-10">
                    <label for="">占位符：</label>
                    <input class="form-control input-sm filterUiPlaceholder" type="text" placeholder="占位符">
                </div>
                <div class="col-lg-9 m-b-10">
                    <label for="">筛选项字段：</label>
                    <input class="form-control input-sm filterField" type="text" placeholder="请拖拽筛选项内容" style="width:calc(100% - 175px) !important;">
                </div>
            </div>
        </li>
        `);
        parent.find("li:last").droppable({
            drop: function(event, ui){
                var str = $(this).find(".filterField").val();
                var value = $(this).find(".filterField").data("value");
                if(str){
                    str += ","+DOMdescription;
                    value += ","+DOMvalue;
                }else{
                    str = DOMdescription;
                    value = DOMvalue;
                }
                $(this).find(".filterField").val(str).data("value", value);
            }
        })
    }else if (name === "sort"){
        parent.append(`
        <li>
            <div class="row m-b-10">
                <div class="col-lg-4">
                    <label for="">影响规则：</label>
                    <input type="text" class="form-control sortField">
                </div>
                <div class="col-lg-4">
                    <label for=""></label>
                    <input type="checkbox" class="sortDesc">排序
                </div>
                <div class="col-lg-4">
                    <i class="fa fa-plus-circle addnotes" data-name="sort" aria-hidden="true"></i>
                </div>
            </div>
        </li>
        `);
        parent.find("li:last").droppable({
            drop: function(event, ui){
                $(this).find(".sortField").val(DOMdescription).data("value", DOMvalue);
            }
        })
    }
    $(this).removeClass("addnotes fa-plus-circle").addClass("fa-minus-circle dellnotes");
})
//删除添加的项
$(".table-content").on("click", ".dellnotes", function(){
    $(this).parent().parent().parent().remove();
})

function saveTemplate() {
    var fields = [], filters = [], sorts = [], tags = [];
    $("#templateFields li").each(function(index, item){
        var _self = $(item);
        if(!_self.find(".fieldName").val()){
            return false;
        }
        fields.push({
            name: _self.find(".fieldName").val(),
            label: _self.find(".fieldLabel").val(),
            pipe: _self.find(".fieldPipe").val(),
            hidden: _self.find(".fieldHidden").is(":checked") ? true : false,
            nested: _self.find(".fieldNested").is(":checked") ? true : false
        })
    })

    $("#templateFilters li").each(function(index, item){
        var _self = $(item);
        if(!_self.find(".filterField").data("value")){
            return false;
        }
        filters.push({
            fields:  _self.find(".filterField").data("value").split(","),            
            "name": _self.find(".bindName").val(),
            "bindMethod": _self.find(".bindMethod").val(),
            "bindTarget": _self.find(".bindTarget").val(),
            ui: {
                label: _self.find(".filterUiLabel").val(),
                displayType: _self.find(".filterUiDisplayType").val(),
                placeholder: _self.find(".filterUiPlaceholder").val(),
                hidden: _self.find(".filterUiHidden").is(":checked") ? true : false
            },
            type: _self.find(".filterType").val(),
            value: _self.find(".filterValue").val()
        })
    })

    $("#templateSorts li").each(function(index, item){
        var _self = $(item);
        if(!_self.find(".sortField").data("value")){
            return false;
        }
        sorts.push({
            field: _self.find(".sortField").data("value"),
            desc: _self.find(".sortDesc").is(":checked") ? true : false
        })
    })
    var data = {
        name: $("#templateName").val(),
        title: $("#templateTitle").val(),
        platform: $("#templatePlatform").val(),
        collection: $("#collections").val(),
        description: $("#templateDescription").val(),
        fields: fields,
        filters: filters,
        sorts: sorts,
        tags: $("#templateTags").val() ? $("#templateTags").val().split(",") : null
    }
    var url = "/api/Template/AddTableTemplate";
    if(detailId){
        data.id = detailId;
        url = "/api/Template/UpdateTableTemplate";
    }
    $.ajax({
        type: "POST",
        url: urlprefix + url,///api/Template/AddTableTemplate /api/Template/UpdateTableTemplate
        data: $.postAuth(data),
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        success: function(res){
            console.log(res);
        }
    })
}


//获取修改数据
function getDetail(){
    $.ajax({
        type: "GET",
        url: urlprefix + "/api/Template/GetTableTemplateFormDetail",
        data: $.getAuth({id: detailId}),
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        success: function(res){
            var result = res.data;
            if(result){
                $("#collections").val(result.collection).change();

                $("#templateName").val(result.name);
                $("#templateTitle").val(result.title);
                $("#templatePlatform").val(result.platform);
                $("#templateTags").val(result.tags ? result.tags.join(",") : "");
                $("#templateDescription").val(result.description);
                
                $("#templateFields ul").html(bindFelds(result.fields));

                setTimeout(function() {
                    if(result.filters.length > 0) bindFilters(result.filters);
                
                    $("#templateSorts ul").html(bindSorts(result.sorts));
                }, 2000);
            }
        }
    })
}

//绑定表头
function bindFelds(data){
    var html1 = "";
    for(var i = 0; i < data.length; i++) {
        var disabled = i === 0 ? "disabled" : "";
        var html = "";
        if(i === 0){
            html = "";
        }else if (i < data.length - 1){
            html = `<div class="col-lg-2"><i class="fa fa-minus-circle dellnotes" data-name="header" aria-hidden="true"></i></div>`
        }else if ( i === data.length -1){
            html = `<div class="col-lg-2"><i class="fa fa-plus-circle addnotes" data-name="header" aria-hidden="true"></i></div>`
        }
        html1 += `<li class="clone">
            <div class="row m-b-10">
                <div class="col-lg-4">
                    <label for="">表头字段：</label>
                    <input type="text" class="form-control input-sm m-b-10 fieldName" placeholder="请填写一个表头字段" ${disabled} value="${data[i].name}">
                </div>
                <div class="col-lg-4">
                    <label for="">表头标题：</label>
                    <input type="text" class="form-control input-sm m-b-10 fieldLabel" placeholder="请填写一个表头标题" ${disabled} value="${data[i].label}">
                </div>
                <div class="col-lg-8">
                    <label for="">表格管道：</label>
                    <select class="form-control input-sm m-b-10 fieldPipe" placeholder="请选择一个管道" value="${data[i].pipe}">${fieldPipeOptions}</select>
                </div>
                <div class="col-lg-2">
                    <input type="checkbox" class="fieldHidden" ${disabled} ${data[i].hidden ? "checked" : ""}>隐藏
                    <input type="checkbox" class="fieldNested" disabled ${data[i].nested ? "checked" : ""}>嵌套
                </div>
                ${html}
            </div>
        </li>`;
    }
    return html1;
}

//绑定筛选项
function bindFilters(data){
    var html = "";
    for(var i = 0; i < data.length; i++){
        var fields = [];
        var $clone = $("#templateFilters .clone").clone(true);
        $clone.find(".filterType").val(data[i].type);
        $clone.find(".filterUiDisplayType").val(data[i].ui.displayType);
        if (data[i].fields) {
            for(var j = 0; j < data[i].fields.length; j++){
                fields.push(getcollectionsContent(data[i].fields[j]))
            }
        }        
        $clone.find(".bindMethod").val(data[i].bindMethod);
        setTimeout(() => {
            $clone.find(".bindTarget").val(data[i].bindTarget);
        }, 1000);
        $clone.find(".filterField").val(fields.join(","));
        $clone.find(".filterField").data("value", fields.join(","));
        $clone.find(".filterUiLabel").val(data[i].ui.label);
        $clone.find(".bindName").val(data[i].bindName);
        $clone.find(".filterValue").val(data[i].value);
        $clone.find(".filterUiPlaceholder").val(data[i].ui.placeholder);
        $clone.find(".filterUiHidden").attr("checked",data[i].ui.hidden);
        if(i < data.length - 1){
            $clone.find("i").removeClass("fa-plus-circle addnotes").addClass("fa-minus-circle dellnotes");
        }
        $("#templateFilters ul").append($clone.removeClass("clone"));
    }
    $("#templateFilters .clone").remove();
}

//绑定排序
function bindSorts(data){
    if(!data) return;
    var html = "";
    for(var i = 0; i < data.length; i++){
        html += `
        <li class="clone">
            <div class="row m-b-10">
                <div class="col-lg-4">
                    <label for="">影响规则：</label>
                    <input type="text" class="form-control sortField" data-value="${data[i].field}" value="${getcollectionsContent(data[i].field)}">
                </div>
                <div class="col-lg-4">
                    <label for=""></label>
                    <input type="checkbox" class="sortDesc" ${data[i].desc ? "checked" : ""}>倒序
                </div>
                <div class="col-lg-4">
                    <i class="fa fa-plus-circle addnotes" data-name="sort" aria-hidden="true"></i>
                </div>
            </div>
        </li>
        `;
    }
    return html;
}

//获取数据源的描述
function getcollectionsContent(key){
    var desc = "";
    collectionsContent.forEach(function(item, index){
        if(item.name === key){
            desc = item.description;
            return false;
        }
    })
    return desc;
}

//更新表格模板
function updateTemplate(){
    $.ajax({
        type: "POST",
        url: urlprefix + "/api/Template/UpdateTableTemplate",
        data: $.postAuth(),
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        success: function(res){
            console.log(res)
        }
    })
}