import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Chart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis 
          dataKey='name' 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <Tooltip
          cursor={false}
          contentStyle={{ 
            textTransform: "capitalize",
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            fontSize: "14px"
          }}
        />
        <CartesianGrid 
          strokeDasharray='3 3' 
          vertical={false}
          stroke="#E5E7EB"
        />
        <Bar 
          dataKey='total' 
          fill='#3B82F6' 
          radius={[6, 6, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};