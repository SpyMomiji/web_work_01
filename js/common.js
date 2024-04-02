function loadnav (){
    $.ajax({
        url:"./nav.htm",
        success:(data)=>{
            $("nav").html(data);
            //console.log(data,status)
        }
    });
}

let navDest; //目標 nav
let headerFloat; //浮動 header
let headerFixed; //固定 header
let asideFloat;

let measureFloatHeigth = 0;
let measureFixedHeigth = 0;
let heightDiff = 0;

let frameCount = 0;;

function measureDest(){
    measureFloatHeigth = headerFloat.height();
    measureFixedHeigth = headerFixed.height();
    if(!measureFloatHeigth) window.requestAnimationFrame(measureDest);
    else {
        let computedFloatStyle = getComputedStyle(headerFloat[0]);
        headerFloat.css('width',(headerFixed[0].clientWidth - parseInt(computedFloatStyle.paddingLeft) - parseInt(computedFloatStyle.paddingRight)) + 'px');
        heightDiff = measureFixedHeigth - measureFloatHeigth;
        heightDiff < 0 ?? (heightDiff = -heightDiff);
        scrollEvent();
    }
}

function updateScreen(){
    if(--frameCount > 0) window.requestAnimationFrame(updateScreen);
    if(window.scrollY>heightDiff){
        headerFloat?.css("top",'0px');
        asideFloat?.css("top",`${window.scrollY-heightDiff}px`);
    } else {
        headerFloat?.css("top",`${-measureFloatHeigth}px`);
        asideFloat?.css("top",'0px');
    }
}

function scrollEvent(){
    frameCount = 2;
    updateScreen();
}


function initHeader(){
    navDest = $("#nav_dest");
    headerFloat = $(".header.float");
    headerFixed = $(".header.fixed");

    navDest.append($("#nav_src > *").clone()); //將選項複製到另一個 nav
    headerFloat.removeClass('hide');

    $(window).on("scroll", scrollEvent );
    measureDest();
}

function scrollToTag(tag){
    let target;
	if( tag && (target = $(`[data-tag=${decodeURIComponent(tag).replace(/ +/g,'\\ ')}]`)[0]) ){
		target.scrollIntoView();
		window.requestAnimationFrame( ()=>
			($('body').height() > window.scrollY + window.innerHeight)
			&& window.scrollTo(window.scrollX,window.scrollY-measureFloatHeigth)
			);
		//window.scrollTo(window.scrollX,window.scrollY-measureFloatHeigth);
	} else {
        window.scrollTo(window.scrollX,0);
	}

}

function initAside(){
    asideFloat = $(".aside.float"); //浮動 aside
    asideFloat.find("a").on("click",function(){
        let tag = this.href.match(/#(.*)$/);
        tag && scrollToTag(tag[1]);
    })
}

$(function(){
    //await (new Promise((a)=>setTimeout(a,200)));
    scrollToTag(location.hash.substring(1));
})