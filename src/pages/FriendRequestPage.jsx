import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Avatar, Box, Link } from "@mui/material";
import AlertComponent from "../components/AlertComponent";

const FriendRequestPage = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [isAccepted, setIsAccepted] = useState(false);
  const [acceptedUserId, setAcceptedUserId] = useState("");

  const baseUrl = "https://dost-backend.onrender.com";

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/v1/users/requests`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setFriendRequests(res.data.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error.message);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAcceptFriendRequest = async (senderId) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/users/requestAccepted`,
        {
          userId: senderId,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success === true) {
        setIsAccepted(true);
        setAcceptedUserId(senderId);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error.message);
    }
  };

  const handleRejectFriendRequest = async (senderId) => {
    try {
      const res = await axios.delete(
        `${baseUrl}/api/v1/users/request/${senderId}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const updatedFriendRequests = friendRequests.filter(
        (request) => request.sender._id !== senderId
      );

      setFriendRequests(updatedFriendRequests);
    } catch (error) {
      console.error("Error removing user from sended requests:", error.message);
    }
  };

  const str = "Friend request accepted successfully";

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom right, #00203FFF, #ADEFD1FF)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#FFFFFF", padding: "20px" }}
      >
        Friend Requests
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap", margin: "20px" }}>
        {isAccepted && (
          <AlertComponent
            request={setIsAccepted}
            str={str}
            severityType={"success"}
          />
        )}
        {friendRequests.length === 0 ? (
          <Box sx={{ textAlign: "center", margin: "auto" }}>
            <Typography variant="h6" component="h2" textAlign="center" sx={{ color: "#FFFFFF" }}>
              Oops! It seems like you're all caught up with friend requests for now.
              <br />
              Why not
              <Link href="/suggestions" underline="hover" sx={{ color: "#ADEFD1FF", marginLeft: "5px" }}>
                explore
              </Link>
              some new connections?
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {friendRequests.map((request) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={request._id}
                sx={{ animation: "fadeInUp 0.5s ease-in-out" }}
              >
                <Card
                  sx={{
                    backgroundColor: "#1c4e80", borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent sx={{ display: "flex", flexDirection: "column", color: "#FFF" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={
                          request.sender.cloudinaryImageUrl
                            ? request.sender.cloudinaryImageUrl
                            : "/default-avatar.png"
                        }
                        sx={{ width: 60, height: 60, marginRight: "10px" }}
                      />
                      <div>
                        <Typography variant="h6" component="h2" sx={{ color: "#FFFFFF" }}>
                          {request.sender.name}
                        </Typography>
                        <Typography variant="body2" component="p" sx={{ color: "#EEE" }}>
                          {request.sender.email}
                        </Typography>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "auto",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 100%)",
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
                          marginRight: "10px",
                          fontSize: "0.875rem",
                          padding: "6px 12px",
                          marginTop: "10px",
                        }}
                        onClick={() => handleAcceptFriendRequest(request.sender._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#FFF",
                          color: "#FFF",
                          transition: "transform 0.3s, background-color 0.3s",
                          "&:hover": {
                            background: "linear-gradient(to bottom right, #00203FFF, #ADEFD1FF)",
                            borderColor: "#555",
                            color: "#FFF",
                            transform: "scale(1.1)",
                          },
                          "&:active": {
                            transform: "scale(0.9)",
                          },
                          fontSize: "0.875rem",
                          padding: "6px 12px",
                          marginTop: "10px",
                        }}
                        onClick={() => handleRejectFriendRequest(request.sender._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </Box>
  );
};

export default FriendRequestPage;
