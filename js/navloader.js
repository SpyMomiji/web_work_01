function loadnav (){
    $.ajax({
        url:"./nav.htm",
        success:(data)=>{
            $("nav").html(data);
            //console.log(data,status)
        }
    });
}
