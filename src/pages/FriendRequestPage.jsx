import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import SuccessfullAlert from "../components/SuccessfullAlert";
import { Avatar } from "@mui/material"; // Import Avatar
import { Box } from "@mui/system";
import AlertComponent from "../components/AlertComponent";
import Link from "@mui/material/Link";

const FriendRequestPage = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [isAccepted, setIsAccepted] = useState(false);
  const [acceptedUserId, setAcceptedUserId] = useState("");

  const baseUrl = "https://dost-backend.onrender.com";

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/v1/users/requests`);

        setFriendRequests(res.data.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error.message);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAcceptFriendRequest = async (senderId) => {
    try {
      const res = await axios.post(`${baseUrl}/api/v1/users/requestAccepted`, {
        userId: senderId,
      });

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
      const res = await axios.delete(`${baseUrl}/api/v1/users/request/${senderId}`);
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
    <Box sx={{ bgcolor: "#ced4da", minHeight: "100vh" }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#343a40", padding: "20px" }}
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
            <Typography variant="h6" component="h2" textAlign="center">
              Oops! It seems like you're all caught up with friend requests for
              now.
              <br />
              Why not{" "}
              <Link href="/suggestions" underline="hover">
                explore
              </Link>{" "}
              some new connections?
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {friendRequests.map((request) => (
              <Grid
                item
                xs={12} // Occupy full width on extra small screens
                sm={6}
                md={4}
                lg={3}
                key={request._id}
              >
                <Card sx={{ backgroundColor: "#495057", borderRadius: 4 }}>
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
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
                        <Typography variant="h6" component="h2">
                          {request.sender.name}
                        </Typography>
                        <Typography variant="body2" component="p">
                          {request.sender.email}
                        </Typography>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        marginTop: "10px",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#343a40", color: "#f5ebe0" }}
                        onClick={() =>
                          handleAcceptFriendRequest(request.sender._id)
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{ backgroundColor: "#8d99ae", color: "#f5ebe0" }}
                        onClick={() =>
                          handleRejectFriendRequest(request.sender._id)
                        }
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
