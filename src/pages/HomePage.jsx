import React from "react";
import Navbar from "../components/Navbar";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Wave from "../components/Wave/Wave";
import Footer from "./Footer";
import Heading from "../components/Heading";

const HomeAuthenticatedPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <img
        src="/images/back.jpg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
        alt="Background"
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start", // Align items to the left
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "transparent",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Heading />
        <div style={{ marginTop: "70px", marginLeft: "20px" }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: "25px",
              padding: "15px 30px",
              fontWeight: "bold",
              backgroundColor: "#495057",
              margin: "20px",
              "&:hover": {
                backgroundColor: "#000000", // Set background color to black on hover
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
              backgroundColor: "#495057",
              "&:hover": {
                backgroundColor: "#000000", // Set background color to black on hover
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
