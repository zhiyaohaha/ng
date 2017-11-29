var displayTypeOptions = `<option>请选择展示类型</option>`;//展示类型选项值
var filterTypeOptions = `<option>请选择筛选类型</option>`;//筛选类型选项值

var DOMvalue = ""; //拖拽的元素的字段
var DOMdescription = ""; //拖拽元素的标题

(function($){

    $("#templateFields ul li,#templateValues ul li").droppable({
        drop: function(event, ui){
            $(this).find(".fieldName").val(DOMvalue);
            $(this).find(".fieldLabel").val(DOMdescription);
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
})(jQuery)

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
         
        }
    }
})

//下拉框值改变，获取值
$("#collections").on("change", function(){
    var type = $(this).val();
    $("#templateName").val($(this).val());
    $("#templateTitle").val($(this).find("option:selected").html());
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
                if(type === "SysParam"){
                    $("#bindTextField").val("name");
                    $("#templateFields .fieldLabel").val("名称");
                    $("#bindValueField").val("code");
                    $("#templateValues .fieldLabel").val("代号");
                }
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

//添加筛选项
$("#templateFilters").on("click", ".addnotes", function(){
    var parent = $(this).parent().parent().parent().parent();

    parent.append(`
        <li>
            <div class="row">
                <div class="col-sm-8">
                    <div class="row">
                        <div class="col-sm-8 m-b-10">
                            <label for="">筛选类型：</label>
                            <select class="form-control input-sm filterType" placeholder="请选择一个筛选类型">${filterTypeOptions}</select>
                        </div>
                        <div class="col-sm-12 m-b-10">
                            <label for="">筛选项字段：</label>
                            <input class="form-control input-sm filterField" type="text" placeholder="请拖拽筛选项内容" style="width:calc(100% - 183px) !important;">
                        </div>
                        <div class="col-sm-8 m-b-10">
                            <label for="">筛选值：</label>
                            <input class="form-control input-sm filterValue" type="text" placeholder="请填写筛选项默认值">
                        </div>
                    </div>
                </div>
                <div class="col-sm-4">
                    <i class="fa fa-plus-circle addnotes" data-name="filter" aria-hidden="true"></i>
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

    $(this).removeClass("addnotes fa-plus-circle").addClass("fa-minus-circle dellnotes");
})
//删除添加的项
$("#templateFilters").on("click", ".dellnotes", function(){
    $(this).parent().parent().parent().remove();
})

//保存新模板
function saveTemplate(){
    var filters = [];

    $("#templateFilters li").each(function(index, item){
        var _self = $(item);
        if(!_self.find(".filterField").data("value")){
            return false;
        }
        filters.push({
            fields:  _self.find(".filterField").data("value").split(","),
            type: _self.find(".filterType").val(),
            value: _self.find(".filterValue").val()
        })
    })

    var data = {
        name: $("#templateName").val(),
        title: $("#templateTitle").val(),
        platform: $("#templatePlatform").val(),
        collection: $("#collections").val(),
        description: $("#templateDescription").val(),
        bindTextField: $("#bindTextField").val(),
        bindValueField: $("#bindValueField").val(),
        filter: filters,
        childrens: $("#childrens").is(":checked") ? true : false,
        depth: $("#depth").val(),
        tags: $("#templateTags").val() ? $("#templateTags").val().split(",") : null
    }
    $.ajax({
        type: "POST",
        url: urlprefix + "/api/Template/AddSelectTemplate",
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

