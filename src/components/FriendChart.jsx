import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import './FriendChart.css'; 

const FriendChart = () => {
  const [friendCounts, setFriendCounts] = useState({});

  const baseUrl = "http://localhost:3000";

  const colors = ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#0099FF"];

  let random = Math.floor(Math.random() * colors.length);

  const data = Object.keys(friendCounts).map((friend) => ({
    name: friend,
    count: friendCounts[friend],
  }));

  useEffect(() => {
    const fetchFriendCounts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/users/friend-counts`, {
          headers: {
            'Access-Control-Allow-Origin': '*', 
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        setFriendCounts(response.data.data);
      } catch (error) {
        console.error("Error fetching friend counts:", error);
      }
    };
    fetchFriendCounts();
  }, []);

  return (
    <div className="chart-container">
      <BarChart
        width={800}
        height={400}
        data={data}
        margin={{ top: 50, right: 50, left: 50, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          angle={-45}
          label={{
            position: "insideBottom",
            offset: 10,
          }}
        />
        <YAxis
          domain={[0, Math.max(...data.map((item) => item.count)) + 2]}
        />
        <Tooltip />
        <Legend verticalAlign="top" />
        <Bar
          dataKey="count"
          fill={colors[random]}
          barSize={40}
          shape={(props) => <CustomBar {...props} />}
        />
      </BarChart>
    </div>
  );
};

const CustomBar = (props) => {
  const { x, y, width, height, fill } = props;

  const gradientId = `gradient-${fill.replace('#', '')}`;
  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={0.8} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`url(#${gradientId})`}
        className="bar"
      />
    </g>
  );
};

export default FriendChart;
