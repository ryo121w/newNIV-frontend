import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import '../css/GraphDisplayComponent.css';  // Assuming you have a CSS file for styles

const GraphDisplayComponent = ({ data }) => {

    const svgRef = useRef(null);
    const [brushEnabled, setBrushEnabled] = useState(true);
    const [translate, setTranslate] = useState({ x: 0, y: 0 }); // Add this line for storing translate values

    // Add this line for toggling brush
    const toggleBrush = () => setBrushEnabled(!brushEnabled); // Function to toggle brush state


    const exportSVG = () => {
        const svgElement = document.querySelector('#graph-display svg');
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'graph.svg';
        downloadLink.click();
        URL.revokeObjectURL(url);
    };


    useEffect(() => {
        if (!data || data.length === 0) {
            return;  // data is not yet available or empty
        }

        // Initialize SVG and dimensions
        const svgWidth = 500;
        const svgHeight = 350;  // Changed height to 350
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };  // Updated bottom and left margins

        const concentrationColumns = Object.keys(data[0]).filter(key => key !== '波長');

        // Clear previous SVG elements
        const svgContainer = d3.select("#svg-container");
        svgContainer.selectAll("*").remove();




        const svg = svgContainer.append("svg")
            .attr("width", svgWidth + margin.left + margin.right)
            .attr("height", svgHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Create initial scales
        let xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.波長), d3.max(data, d => d.波長)])
            .range([0, svgWidth]);

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(...concentrationColumns.map(col => d[col])))])
            .range([svgHeight, 0]);

        svg.append("text")
            .attr("transform", `translate(${svgWidth / 2}, ${svgHeight + margin.bottom / 2})`)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "12px")
            .text("波数 (cm⁻¹)");
        
        // Add y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (svgHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "12px")
            .text("Absorbance");

        // Create axes
        const xAxis = d3.axisBottom(xScale).tickSizeInner(0).tickSizeOuter(0);  // Removed ticks
        const yAxis = d3.axisLeft(yScale).tickSizeInner(0).tickSizeOuter(0);  // Removed ticks

        // Append axes to SVG
        const xAxisGroup = svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${svgHeight})`)
            .call(xAxis);

        const yAxisGroup = svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);





            
            const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

            // Create tooltip div if it doesn't exist yet
            let tooltip = d3.select('body').select('.tooltip');
            if (tooltip.empty()) {
                tooltip = d3.select('body').append('div')
                            .attr('class', 'tooltip')
                            .style('opacity', 0);
            }
    
            const clip = svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", svgWidth)
                .attr("height", svgHeight);
    
            const lines = svg.append("g")
                .selectAll(".line")
                .data(concentrationColumns)
                .enter().append('path')
                .attr('class', (d) => `line line-${d}`)
                .attr('fill', 'none')
                .attr("clip-path", "url(#clip)")
                .attr('stroke', (d, i) => d3.schemeCategory10[i])
                .attr('stroke-width', 1.5)
                .attr('d', (concentration) => {
                    const lineGenerator = d3.line()
                        .x((d) => xScale(d.波長))
                        .y((d) => yScale(d[concentration]));
                    return lineGenerator(data);
                })
                .on('mouseover', function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);
                    tooltip.html(`Your data: ${d}`)
                        .style('left', `${event.pageX}px`)
                        .style('top', `${event.pageY - 28}px`);
                })
                .on('mouseout', function() {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });









            if (brushEnabled) {
                lines.style("pointer-events", "none");  // lines will not capture mouse events
            } else {
                lines.style("pointer-events", "all");  // lines will capture mouse events
            }


        const brush = d3.brush()
            .extent([[0, 0], [svgWidth, svgHeight]])
            .on("end", brushed);

            const brushGroup = svg.selectAll(".brush");
            if (brushEnabled) {
                brushGroup
                    .data([null]) // dummy data
                    .enter()
                    .append("g")
                    .attr("class", "brush")
                    .call(brush);
            } else {
                brushGroup.remove();
            }

        function brushed(event) {
            if (!event.selection) return;

            const [[x0, y0], [x1, y1]] = event.selection;

            xScale.domain([xScale.invert(x0), xScale.invert(x1)]);
            yScale.domain([yScale.invert(y1), yScale.invert(y0)]);

            xAxisGroup.call(xAxis);
            yAxisGroup.call(yAxis);

            lines.attr("d", concentration => {
                const lineGenerator = d3.line()
                    .x(d => xScale(d.波長))
                    .y(d => yScale(d[concentration]));
                    return lineGenerator(data);
                });

            brushGroup.call(brush.move, null);
        }

        // Reset zoom on double click
        svg.on("dblclick", function() {
            xScale.domain([d3.min(data, d => d.波長), d3.max(data, d => d.波長)]);
            yScale.domain([0, d3.max(data, d => Math.max(...concentrationColumns.map(col => d[col])))]);
            
            xAxisGroup.call(xAxis);
            yAxisGroup.call(yAxis);
            
            lines.attr("d", concentration => {
                const lineGenerator = d3.line()
                    .x(d => xScale(d.波長))
                    .y(d => yScale(d[concentration]));
                return lineGenerator(data);
            });

            brushGroup.call(brush.move, null);
        });












    const legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(concentrationColumns)
        .enter().append("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend.append("rect")
        .attr("x", svgWidth - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", (d, i) => colorScale(i))
        .on("click", function(event, d) {
            // Stop the event propagation to prevent any parent handlers from being executed
            event.stopPropagation();
            
            // Toggle visibility
            const isActive = d3.select(this).classed("active");
            if (isActive) {
                d3.select(this).classed("active", false);
                d3.select(this).style("fill", colorScale(concentrationColumns.indexOf(d)));
            } else {
                d3.select(this).classed("active", true);
                d3.select(this).style("fill", "lightgrey");
            }
    
            // Toggle the corresponding line
            svg.selectAll(`.line-${d}`)
                .classed("hidden", !isActive);  // Use !isActive to toggle visibility
        });

    legend.append("text")
        .attr("x", svgWidth - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => d);

        

    }, [data, brushEnabled]);

    return (
        <div id="graph-display">
            <button onClick={toggleBrush}>
                {brushEnabled ? "Disable Brush" : "Enable Brush"}
            </button>
            <button className="Dynamic_Export_button" onClick={exportSVG}>Export SVG</button>
            <div ref={svgRef} id="svg-container"></div>
        </div>
    );
};

export default GraphDisplayComponent;
