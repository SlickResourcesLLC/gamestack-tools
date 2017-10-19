

var comboCheckableElement = function(text)
{

    var html = "<label for='"+id+"'>"+text+"</label> <input type='checkbox' id='"+id+"'  name='"+id+"' /> ";

    return{text:text, html:html}


}


function ComboMaker(container)
{

    $(container).append("<h1>Create Combo</h1>");


    $(container).append("<button>+</button>");


};







