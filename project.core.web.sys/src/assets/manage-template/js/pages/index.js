var urlprefix = `http://api4.cpf360.com`;

//登录
$.ajax({
    type: "POST",
    url: urlprefix + "/api/auth/login",
    data: $.postAuth({ "account": "administrator", "password": "1" }),
    async: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function( res ) {
        console.log(res);
    }
})


//绑定下拉框值
function bindSelect(data, defaultText, target){
    var html = `<option value="">${defaultText}</option>`;
    data.forEach(function(el){
        html += `<option value="${el.value}">${el.text}</option>`;
    })
    $("#"+target).html(html);
}