var padding = {top:20, right:40, bottom:0, left:0},
    w = 500 - padding.left - padding.right,
    h = 500 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20(),
    names = ["Tom", "Ole", "Dan"],
    currentIndex = 0;

var data = [
    {"label":"Item is...",  "value":1,  "Hat"},
    {"label":"Item is...",  "value":2,  "Shirt"}, 
    {"label":"Item is...",  "value":3,  "Trousers"},
    {"label":"Item is...",  "value":3,  "Socks"},
    {"label":"Item is...",  "value":3,  "Jacket"}, 
    {"label":"Item is...",  "value":3,  "Accessory"},
    {"label":"Item is...",  "value":3,  "Shoes?"},        
];

var svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("width",  w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);

var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

var vis = container.append("g");

var pie = d3.layout.pie().sort(null).value(function(d){ return 1; });

var arc = d3.svg.arc().outerRadius(r);

var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

arcs.append("path")
    .attr("fill", function(d, i){ return color(i); })
    .attr("d", function(d){ return arc(d); });

arcs.append("text").attr("transform", function(d){
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
    })
    .attr("text-anchor", "end")
    .text(function(d, i) { return data[i].label; });

container.on("click", spin);

function spin(d) {
    container.on("click", null);
    
    if (oldpick.length == data.length) {
        container.on("click", null);
        return;
    }

    var ps = 360 / data.length,
        pieslice = Math.round(1440 / data.length),
        rng = Math.floor((Math.random() * 1440) + 360);

    rotation = (Math.round(rng / ps) * ps);

    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? (picked % data.length) : picked;

    if (oldpick.indexOf(picked) !== -1) {
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }

    rotation += 90 - Math.round(ps / 2);
    
    vis.transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .each("end", function() {
            d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                .attr("fill", "#111");

            d3.select("#question h1").text(data[picked].question);
            
            // Assign the selected item to the current name
            var name = names[currentIndex];
            var nameElement = document.querySelector("#nameList li:nth-child(" + (currentIndex + 1) + ")");
            nameElement.textContent = name + ": " + data[picked].label;

            // Remove the selected item from the data array
            data.splice(picked, 1);
            oldrotation = rotation;

            // Update the currentIndex to the next name
            currentIndex = (currentIndex + 1) % names.length;

            container.on("click", spin);
        });
}

function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function(t) {
        return "rotate(" + i(t) + ")";
    };
}

// Arrow and spin text remain the same as before...
