



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