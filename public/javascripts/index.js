$(document).ready(function(){


    function screen_setting(){
        var full_width = $(window).width();
        var full_height = $(window).height();
        
        $('#title').height(full_height*0.2);
        $('#menu').height(full_height*0.2);
        $('#main').height(full_height*0.6);
    }
    
    screen_setting();
    
    $( window ).resize(function() {
        screen_setting();
    });
});