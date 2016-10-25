/**
 * Created by Malcom on 10/25/2016.
 */
var io = io('http://localhost:3000');
var now = moment();

$('time').each(function(i, e) {
    var time = moment($(e).attr('datetime'));

    if(now.diff(time, 'days') <= 1) {
        $(e).html('<span>' + time.from(now) + '</span>');
    }
});
$(document).ready(function () {
    io.on('new traffic',function (traffic) {
        console.log("new traffic",traffic);
        var html = getTrafficHTML(traffic);
        $(html).insertAfter('.updates-label').hide().fadeIn('slow');
        setTimeout(function () {
            $(".new-traffic").removeClass("new-traffic", 4000, "fade" );
        },2000);
    });
});


var getTrafficHTML = function(traffic){
    if(!traffic) return null;
    else
    {   var colors = ["primary","success","info","warning","purple","danger","inverse","pink","orange","custom","brown","teal"];
        var randomColor = colors[Math.floor(Math.random() * colors.length)];
         return '<article class="timeline-item">'+
                    '<div class="timeline-desk new-traffic">'+
                        '<div class="panel">'+
                            '<div class="timeline-box">'+
                                '<span class="arrow"></span>'+
                                '<span class="timeline-icon bg-"'+randomColor+'"><i class="mdi mdi-checkbox-blank-circle-outline"></i></span>'+
                                '<h4><strong><a href="#"><i class="fa fa-map-marker"></i> '+traffic.location.landmark+'</a></strong></h4>'+
                                '<h5 class="text-'+randomColor+'"><time class="timeago" datetime="'+traffic.createdAt+'"></time></h5>'+
                                '<p><strong>Traffic Level: </strong> <label class="label label-<%= traffic.level.color %>">'+traffic.level.name+'</label></p>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</article>';
    }

};