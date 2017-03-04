function USStateCounties(Targetsvg, stateID) {



    d3.json("js/us.json", function (error, us) {
        if (error) throw error;

        var state = _.find(topojson.feature(us, us.objects.states).features, function (d) { return d.id === parseInt(stateID); });

        var statecounties = _.filter(topojson.feature(us, us.objects.counties).features, function (d) { return Math.floor(d.id / 1000) === parseInt(stateID); });

        d3.select(Targetsvg).select("svg").remove();

        var width = $(Targetsvg).width(),
                height = $(Targetsvg).height(),
                active = d3.select(null);
        var projection = d3.geoConicConformal()
      .parallels([33, 45])
      .rotate([96, -39])
      .fitSize([width, height], state);

        //var projection = d3.geoAlbersUsa() // updated for d3 v4
        //    .scale((width))
        //    .translate([width / 2, height / 2]);

        var zoom = d3.zoom()
            // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
            // .translate([0, 0])
            // .scale(1)
            .scaleExtent([1, 5])
            .on("zoom", zoomed);

        var path = d3.geoPath()
       .projection(projection);

        var svg = d3.select(Targetsvg).append("svg")
            .attr("width", width)
            .attr("height", height)
            .on("click", stopped, true);

        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .on("click", reset);

        var g = svg.append("g");

        svg
            .call(zoom); // delete this line to disable free zooming
        // .call(zoom.event); // not in d3 v4


        // var conus = topojson.feature(state);

        // ESRI:102004


        g.selectAll("path")
       .data(statecounties)
     .enter().append("path")
       .attr("d", path)
       .attr("class", "feature")
       .on("click", clicked);

        g.append("path")
            .datum(topojson.mesh(us, us.objects.counties, function (a, b) { return ((a !== b) && ((Math.floor(a.id / 1000) === parseInt(stateID)) && (Math.floor(b.id / 1000) === parseInt(stateID)))); }))
            .attr("class", "mesh")
            .attr("d", path);

        //            svg.append("path")
        //                .datum(state)
        //                .attr("d", path);
        //            svg.append("path")
        //.datum(topojson.mesh(us, us.objects.counties, function (a, b) { return a !== b; }))
        //.attr("class", "mesh")
        //.attr("d", path);

        function clicked(d) {
            if (active.node() === this) return reset();
            active.classed("active", false);
            active = d3.select(this).classed("active", true);

            var bounds = path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
                translate = [width / 2 - scale * x, height / 2 - scale * y];

            svg.transition()
                .duration(750)
                // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
                .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)); // updated for d3 v4
        }

        function reset() {
            active.classed("active", false);
            active = d3.select(null);

            svg.transition()
                .duration(750)
                // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
                .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4
        }

        function zoomed() {
            g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
            // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
            g.attr("transform", d3.event.transform); // updated for d3 v4
        }

        // If the drag behavior prevents the default click,
        // also stop propagation so we don’t click-to-zoom.
        function stopped() {
            if (d3.event.defaultPrevented) d3.event.stopPropagation();
        }
    });

}
function USState(Targetsvg, stateID) {

    d3.select(Targetsvg).select("svg").remove();

    var width = $(Targetsvg).width(),
            height = $(Targetsvg).height(),
            active = d3.select(null);

    var projection = d3.geoAlbersUsa() // updated for d3 v4
        .scale((width))
        .translate([width / 2, height / 2]);

    var zoom = d3.zoom()
        // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
        // .translate([0, 0])
        // .scale(1)
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    var path = d3.geoPath() // updated for d3 v4
        .projection(projection);

    var svg = d3.select(Targetsvg).append("svg")
        .attr("width", width)
        .attr("height", height)
        .on("click", stopped, true);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g");

    svg
        .call(zoom); // delete this line to disable free zooming
    // .call(zoom.event); // not in d3 v4

    d3.json("/js/us.json", function (error, us) {
        if (error) throw error;

        var state = _.find(topojson.feature(us, us.objects.states).features, function (d) { return d.id === parseInt(stateID); });


        // var conus = topojson.feature(state);

        // ESRI:102004
        var path = d3.geoPath()
            .projection(d3.geoConicConformal()
                .parallels([33, 45])
                .rotate([96, -39])
                .fitSize([width, height], state));

        svg.append("path")
            .datum(state)
            .attr("d", path);
    });

    function clicked(d) {
        if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        svg.transition()
            .duration(750)
            // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)); // updated for d3 v4
    }

    function reset() {
        active.classed("active", false);
        active = d3.select(null);

        svg.transition()
            .duration(750)
            // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
            .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4
    }

    function zoomed() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
        g.attr("transform", d3.event.transform); // updated for d3 v4
    }

    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }
}
function USMapCounties(Targetsvg) {
    d3.select(Targetsvg).select("svg").remove();

    var width = $(Targetsvg).width(),
            height = $(Targetsvg).height(),
            active = d3.select(null); 2

    var projection = d3.geoAlbersUsa() // updated for d3 v4
        .scale((width))
        .translate([width / 2, height / 2]);

    var zoom = d3.zoom()
        // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
        // .translate([0, 0])
        // .scale(1)
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    var path = d3.geoPath() // updated for d3 v4
        .projection(projection);

    var svg = d3.select(Targetsvg).append("svg")
        .attr("width", width)
        .attr("height", height)
        .on("click", stopped, true);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g");

    svg
        .call(zoom); // delete this line to disable free zooming
    // .call(zoom.event); // not in d3 v4

    d3.json("/js/us.json", function (error, us) {
        if (error) throw error;

        g.selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
          .enter().append("path")
            .attr("d", path)
            .attr("class", "feature")
            .on("click", clicked);

        g.append("path")
            .datum(topojson.mesh(us, us.objects.counties, function (a, b) { return a !== b; }))
            .attr("class", "mesh")
            .attr("d", path);
    });

    function clicked(d) {
        if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        svg.transition()
            .duration(750)
            // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)); // updated for d3 v4
    }

    function reset() {
        active.classed("active", false);
        active = d3.select(null);

        svg.transition()
            .duration(750)
            // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
            .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4
    }

    function zoomed() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
        g.attr("transform", d3.event.transform); // updated for d3 v4
    }

    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }
}

function USMap(Targetsvg, StateSVG) {

    d3.select(Targetsvg).select("svg").remove();

    var width = $(Targetsvg).width(),
            height = $(Targetsvg).height(),
            active = d3.select(null);

    var projection = d3.geoAlbersUsa() // updated for d3 v4
        .scale((width))
        .translate([width / 2, height / 2]);

    var zoom = d3.zoom()
        // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
        // .translate([0, 0])
        // .scale(1)
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    var path = d3.geoPath() // updated for d3 v4
        .projection(projection);

    var svg = d3.select(Targetsvg).append("svg")
        .attr("width", width)
        .attr("height", height)
        .on("click", stopped, true);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g");

    svg
        .call(zoom); // delete this line to disable free zooming
    // .call(zoom.event); // not in d3 v4

    d3.json("/js/us.json", function (error, us) {
        if (error) throw error;

        g.selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
          .enter().append("path")
            .attr("d", path)
            .attr("class", "feature")
            .on("click", clicked);

        g.append("path")
            .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
            .attr("class", "mesh")
            .attr("d", path);
    });

    function clicked(d) {
        console.log(d);
        USStateCounties(StateSVG, d.id);
        if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        svg.transition()
            .duration(750)
            // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)); // updated for d3 v4
    }

    function reset() {
        active.classed("active", false);
        active = d3.select(null);

        svg.transition()
            .duration(750)
            // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
            .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4
    }

    function zoomed() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
        g.attr("transform", d3.event.transform); // updated for d3 v4
    }

    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }


}

function USMapCountiesWithData(Targetsvg) {
    d3.select(Targetsvg).select("svg").remove();

    var width = $(Targetsvg).width(),
            height = $(Targetsvg).height(),
            active = d3.select(null); 2

    var projection = d3.geoAlbersUsa() // updated for d3 v4
        .scale((width))
        .translate([width / 2, height / 2]);

    var zoom = d3.zoom()
        // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
        // .translate([0, 0])
        // .scale(1)
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    var path = d3.geoPath() // updated for d3 v4
        .projection(projection);

    var svg = d3.select(Targetsvg).append("svg")
        .attr("width", width)
        .attr("height", height)
        .on("click", stopped, true);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g");

    svg
        .call(zoom); // delete this line to disable free zooming
    // .call(zoom.event); // not in d3 v4

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    d3.json("/js/us.json", function (error, us) {
        if (error) throw error;

        g.selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
          .enter().append("path")
            .attr("d", path)
            .attr("class", "feature")
            .on("click", clicked);

        g.append("path")
            .datum(topojson.mesh(us, us.objects.counties, function (a, b) { return a !== b; }))
            .attr("class", "mesh")
            .attr("d", path);
        d3.json("/Hospitals.json", function (error, providers) {
            if (error) console.log(error);
            g.selectAll("circle")
                    .data(providers)
                    .enter()
                    .append("circle").attr("class", "cities").attr("cx", function (d) {
                        //    console.log(d.Longitude + ", " + d.Latitude);
                        // console.log(projection([parseFloat(d.Longitude), parseFloat(d.Latitude)])[0]);

                        if (projection([parseFloat(d.Longitude), parseFloat(d.Latitude)]) != null)
                            return projection([parseFloat(d.Longitude), parseFloat(d.Latitude)])[0];
                    }).attr("cy", function (d) {
                        if (projection([parseFloat(d.Longitude), parseFloat(d.Latitude)]) != null)
                            return projection([parseFloat(d.Longitude), parseFloat(d.Latitude)])[1];
                    })
                                    .attr("r", function (d) {
                                        return "1px";
                                    }).on("mouseover", function (d) {
                                        div.transition()
                                          .duration(200)
                                          .style("opacity", .9);
                                        div.html("<h5>" + d.Name + "<H5><br>"
                                            + "<b>Type: <b>" + d.Type + "<br>"
                                            + "<b>Owner: <b>" + d.Owner + "<br>"
                                            + "<b>Population: <b>" + d.Population + "<br>"
                                            + "<b>Beds: <b>" + d.Beds + "<br>"
                                            + "<b>Trauma: <b>" + d.Trauma + "<br>"
                                            + "<b>Helipad: <b>" + d.Helipad + "<br>"
                                            )
                                          .style("left", (d3.event.pageX) + "px")
                                          .style("top", (d3.event.pageY - 28) + "px");
                                    })
     .on("mouseout", function (d) {
         div.transition()
           .duration(500)
           .style("opacity", 0);
     });
            ;
        });
    });

    function clicked(d) {
        if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        svg.transition()
            .duration(750)
            // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)); // updated for d3 v4
    }

    function reset() {
        active.classed("active", false);
        active = d3.select(null);

        svg.transition()
            .duration(750)
            // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
            .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4
    }

    function zoomed() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
        g.attr("transform", d3.event.transform); // updated for d3 v4
    }

    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }
}