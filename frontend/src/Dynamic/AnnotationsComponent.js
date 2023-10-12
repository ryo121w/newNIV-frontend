import React, { useEffect } from 'react';
import * as d3 from 'd3';

const AnnotationsComponent = ({ annotations, svgRef }) => {

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // 既存の注釈を削除
    svg.selectAll('.annotation').remove();

    // 新しい注釈を追加
    annotations.forEach((annotation, index) => {
      svg.append('text')
        .attr('x', annotation.x)
        .attr('y', annotation.y)
        .attr('class', 'annotation')
        .text(annotation.text);
    });
    
  }, [annotations, svgRef]);

  return null; // UIレンダリングは不要
};

export default AnnotationsComponent;
