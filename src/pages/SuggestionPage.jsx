import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AlertComponent from "./../components/AlertComponent";
import Loader from "./../components/Loader";
import { Avatar, Chip } from "@mui/material"; // Import additional components
import { Box } from "@mui/system";

const SuggestionPage = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [requestSentSuccess, setRequestSentSuccess] = useState(false);
  const [Name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestSentAlready, setRequestSentAlready] = useState(false);

  const baseUrl = "https://dost-backend.onrender.com";

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/api/v1/users/suggest`, { withCredentials: true });
        const usersArray = Object.values(res.data.data);
        setSuggestedUsers(usersArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching suggestions:", error.message);
      }
    };

    fetchSuggestions();
  }, []);

  const handleRequestFriendship = async (userId) => {
    try {
      const res = await axios.post(`${baseUrl}/api/v1/users/friend-request`, { userId }, { withCredentials: true });

      console.log("Friend Request kaise ho : ", res.data);

      if (res.data.success !== false) {
        setRequestSentSuccess(true);
      } else {
        setRequestSentAlready(true);
      }
    } catch (error) {
      console.error("Error sending friendship request:", error.message);
    }
  };

  const handleRemoveFromSuggestions = async (userId) => {
    try {
      const res = await axios.delete(`${baseUrl}/api/v1/users/suggest/${userId}`, { withCredentials: true });
      const updatedSuggestions = suggestedUsers.filter(
        (user) => user._id !== userId
      );
      setSuggestedUsers(updatedSuggestions);
    } catch (error) {
      console.error("Error removing user from suggestions:", error.message);
    }
  };

  return (
    <Box sx={{ bgcolor: "#ced4da", minHeight: "100vh" }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#343a40", padding: "20px" }}
      >
        Connect with potential friends!
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap", margin: "20px" }}>
        {requestSentSuccess && (
          <AlertComponent
            request={setRequestSentSuccess}
            name={Name}
            str={"Request Sent Successfully to"}
            severityType={"success"}
          />
        )}
        {requestSentAlready && (
          <AlertComponent
            request={setRequestSentAlready}
            name={Name}
            str={"Already Sent Request to"}
            severityType={"warning"}
          />
        )}
        {loading ? (
          <Loader />
        ) : suggestedUsers.length === 0 ? (
          <Box>
            <Typography variant="h6" component="h2" align="center">
              Oops! It seems like our suggestion box is feeling a bit shy today.{" "}
              <br />
              Don't worry, you can still have a great time with your existing friends!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {suggestedUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                <Card sx={{ backgroundColor: "#495057", borderRadius: 4 }}>
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={
                          user.cloudinaryImageUrl
                            ? user.cloudinaryImageUrl
                            : "/default-avatar.png"
                        } // Handle missing profile picture
                        sx={{ width: 60, height: 60, marginRight: "10px" }}
                      />
                      <div>
                        <Typography variant="h6" component="h2">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" component="p">
                          {user.email}
                        </Typography>
                        {user.participatedInHackathon && (
                          <Chip
                            label="Hackathon Participant"
                            variant="outlined"
                            size="small"
                            sx={{ margin: "5px" }}
                          />
                        )}
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
                        sx={{ backgroundColor: "#343a40", color: "#f5ebe0" }}
                        onClick={() => {
                          handleRequestFriendship(user._id);
                          setName(user.name);
                        }}
                      >
                        Request Friendship
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{ backgroundColor: "#8d99ae", color: "#f5ebe0" }}
                        onClick={() => handleRemoveFromSuggestions(user._id)}
                      >
                        Remove from Suggestions
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

export default SuggestionPage;
