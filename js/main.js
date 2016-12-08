
require("!style-loader!raw-loader!sass-loader!./../sass/main.scss");
require("../node_modules/waypoints/lib/noframework.waypoints.js");

var innerWidth = window.innerWidth;

document.addEventListener("resize",function(){
    innerWidth = window.innerWidth;
});

document.addEventListener("DOMContentLoaded",function(){
    if (innerWidth>500) {
        var waypoint = new Waypoint({
            element: document.getElementById('par1'),
            context: document.querySelector('.siteContainer'),
            offset: 73,
            handler: function (direction) {
                if (direction == "down") {
                    document.body.classList.add("fixedMenu");
                }
                else {
                    document.body.classList.remove("fixedMenu");
                }
            }
        });
    }
});