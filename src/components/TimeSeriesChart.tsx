import { useEffect, useRef } from 'react'
import { Question, TestResult } from '@/lib/types'
import * as d3 from 'd3'

interface TimeSeriesChartProps {
  question: Question
  results: TestResult[]
}

export function TimeSeriesChart({ question, results }: TimeSeriesChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || results.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const data = results
      .map(result => {
        const response = result.responses.find(r => r.questionId === question.id)
        return {
          timestamp: result.timestamp,
          value: typeof response?.value === 'number' ? response.value : null
        }
      })
      .filter(d => d.value !== null)
      .sort((a, b) => a.timestamp - b.timestamp) as { timestamp: number; value: number }[]

    if (data.length === 0) {
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'hsl(var(--muted-foreground))')
        .text('No data available')
      return
    }

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, width])

    const yMin = question.scaleMin || 1
    const yMax = question.scaleMax || 10
    const y = d3.scaleLinear()
      .domain([yMin - 0.5, yMax + 0.5])
      .range([height, 0])

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(Math.min(data.length, 6)))
      .selectAll('text')
      .attr('fill', 'hsl(var(--muted-foreground))')

    g.append('g')
      .call(d3.axisLeft(y).ticks(yMax - yMin + 1))
      .selectAll('text')
      .attr('fill', 'hsl(var(--muted-foreground))')

    g.selectAll('.domain, .tick line')
      .attr('stroke', 'hsl(var(--border))')

    const line = d3.line<{ timestamp: number; value: number }>()
      .x(d => x(new Date(d.timestamp)))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'hsl(var(--primary))')
      .attr('stroke-width', 2.5)
      .attr('d', line)

    const area = d3.area<{ timestamp: number; value: number }>()
      .x(d => x(new Date(d.timestamp)))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(data)
      .attr('fill', 'hsl(var(--primary) / 0.1)')
      .attr('d', area)

    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(new Date(d.timestamp)))
      .attr('cy', d => y(d.value))
      .attr('r', 4)
      .attr('fill', 'hsl(var(--primary))')
      .attr('stroke', 'hsl(var(--background))')
      .attr('stroke-width', 2)

    const average = d3.mean(data, d => d.value) || 0
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(average))
      .attr('y2', y(average))
      .attr('stroke', 'hsl(var(--accent))')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5,5')

    g.append('text')
      .attr('x', width - 5)
      .attr('y', y(average) - 5)
      .attr('text-anchor', 'end')
      .attr('fill', 'hsl(var(--accent-foreground))')
      .attr('font-size', '12px')
      .text(`Avg: ${average.toFixed(1)}`)

  }, [question, results])

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        className="w-full"
        height="300"
        style={{ overflow: 'visible' }}
      />
    </div>
  )
}
