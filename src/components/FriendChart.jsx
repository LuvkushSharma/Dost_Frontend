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
  Cell,
} from "recharts";

const FriendChart = () => {
  const [friendCounts, setFriendCounts] = useState({});

  const baseUrl = "https://dost-backend.onrender.com";

  const colors = ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#0099FF"]; // Orange, green, blue, yellow, turquoise


  let random = Math.floor(Math.random() * 10);

  const data = Object.keys(friendCounts).map((friend) => ({
    name: friend,
    count: friendCounts[friend],
  }));

  useEffect(() => {
    const fetchFriendCounts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/users/friend-counts`, { withCredentials: true });
        setFriendCounts(response.data.data);
      } catch (error) {
        console.error("Error fetching friend counts:", error);
      }
    };
    fetchFriendCounts();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#f0f4f8",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <BarChart
        width={800} // Wider for better readability
        height={400}
        data={data}
        margin={{ top: 50, right: 50, left: 50, bottom: 40 }} // Increased margins for visual balance
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} /> // Remove
        vertical grid lines for cleaner look
        <XAxis
          dataKey="name"
          angle={-45} // Rotate labels for longer names
          label={{
            position: "insideBottom",
            offset: 10, // Adjust offset to prevent label overlapping
          }}
        />
        <YAxis
          domain={[0, Math.max(...(data.map((item) => item.count) + 2))]} // Adjust for better scaling
        />
        <Tooltip />
        <Legend verticalAlign="top" /> // Align legend to top
        <Bar
          dataKey="count"
          fill={colors[random]} // More vibrant color
          barSize={40} // Wider bars for visibility
        />
      </BarChart>
    </div>
  );
};

export default FriendChart;
