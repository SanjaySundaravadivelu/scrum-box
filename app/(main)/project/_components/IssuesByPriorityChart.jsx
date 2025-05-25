import React, { PureComponent } from "react";
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

// 1. Define color map per priority
const PRIORITY_COLORS = {
  URGENT: "#f87171", // red-400
  HIGH: "#facc15", // yellow-400
  MEDIUM: "#60a5fa", // blue-400
  LOW: "#34d399", // green-400
  DEFAULT: "#a78bfa", // purple-400
};

// 2. Group issues by priority
const getPriorityData = (issues) => {
  const counts = {};
  issues.forEach((issue) => {
    counts[issue.priority] = (counts[issue.priority] || 0) + 1;
  });

  return Object.entries(counts).map(([priority, count]) => ({
    name: priority,
    value: count,
    fill: PRIORITY_COLORS[priority] || PRIORITY_COLORS.DEFAULT,
  }));
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        {...{ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }}
      />
      <Sector
        {...{
          cx,
          cy,
          startAngle,
          endAngle,
          innerRadius: outerRadius + 6,
          outerRadius: outerRadius + 10,
          fill,
        }}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#ffff"
      >
        {`Issues-${value}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default class IssuesByPriorityChart extends PureComponent {
  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({ activeIndex: index });
  };

  render() {
    const { issues } = this.props;
    const data = getPriorityData(issues);

    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            dataKey="value"
            onMouseEnter={this.onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={6}
            iconSize={6}
            
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
