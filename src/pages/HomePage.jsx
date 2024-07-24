import React from "react";
import Navbar from "../components/Navbar";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Wave from "../components/Wave/Wave";
import Footer from "./Footer";
import Heading from "../components/Heading";

const HomeAuthenticatedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #00203FFF, #ADEFD1FF)" }}>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: "20px",
          textAlign: "center",
          padding: "20px",
          color: "#FFF"
        }}
      >
        <Heading />
        <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
          Welcome to DOST
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
          Discover, connect, and build lasting friendships
        </Typography>
        <div style={{ marginTop: "30px" }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: "25px",
              padding: "15px 30px",
              fontWeight: "bold",
              backgroundColor: "#333", // Darker shade of black
              color: "#FFF",
              margin: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)", // Add box shadow for depth
              transition: "transform 0.3s, background-color 0.3s",
              "&:hover": {
                backgroundColor: "#555",
                transform: "scale(1.1)",
              },
              "&:active": {
                transform: "scale(0.9)",
              },
            }}
            onClick={() => navigate("/suggestions")}
          >
            Get Suggestions
          </Button>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: "25px",
              padding: "15px 30px",
              fontWeight: "bold",
              backgroundColor: "#333",
              color: "#FFF",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              transition: "transform 0.3s, background-color 0.3s",
              "&:hover": {
                backgroundColor: "#555",
                transform: "scale(1.1)",
              },
              "&:active": {
                transform: "scale(0.9)",
              },
            }}
            onClick={() => navigate("/friendsRequests")}
          >
            See Friend Requests
          </Button>
        </div>
      </Box>
      <Footer />
      <Wave />
    </div>
  );
};

export default HomeAuthenticatedPage;
