import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AlertComponent from "./../components/AlertComponent";
import Loader from "./../components/Loader";
import { Avatar, Chip } from "@mui/material";
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
        const res = await axios.get(`${baseUrl}/api/v1/users/suggest`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
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
      const res = await axios.post(`${baseUrl}/api/v1/users/friend-request`, { userId }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

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
      const res = await axios.delete(`${baseUrl}/api/v1/users/suggest/${userId}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      const updatedSuggestions = suggestedUsers.filter(
        (user) => user._id !== userId
      );
      setSuggestedUsers(updatedSuggestions);
    } catch (error) {
      console.error("Error removing user from suggestions:", error.message);
    }
  };

  return (
    <Box sx={{ background: "linear-gradient(to bottom right, #00203FFF, #ADEFD1FF)", minHeight: "100vh", padding: "20px" }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#FFF", padding: "20px" }}
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
            <Typography variant="h6" component="h2" align="center" sx={{ color: "#FFF" }}>
              Oops! It seems like our suggestion box is feeling a bit shy today.{" "}
              <br />
              Don't worry, you can still have a great time with your existing friends!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {suggestedUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                <Card sx={{ backgroundColor: "#1c4e80", borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column", color: "#FFF" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={
                          user.cloudinaryImageUrl
                            ? user.cloudinaryImageUrl
                            : "/default-avatar.png"
                        }
                        sx={{ width: 60, height: 60, marginRight: "10px" }}
                      />
                      <div>
                        <Typography variant="h6" component="h2" sx={{ color: "#FFF" }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" component="p" sx={{ color: "#EEE" }}>
                          {user.email}
                        </Typography>
                        {user.participatedInHackathon && (
                          <Chip
                            label="Hackathon Participant"
                            variant="outlined"
                            size="small"
                            sx={{ margin: "5px", color: "#FFF", borderColor: "#FFF" }}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "auto",
                        gap: "10px"
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
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
                        }}
                        onClick={() => {
                          handleRequestFriendship(user._id);
                          setName(user.name);
                        }}
                      >
                        Request Friendship
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: "#FFF",
                          color: "#FFF",
                          "&:hover": {
                            borderColor: "#555",
                          },
                        }}
                        onClick={() => handleRemoveFromSuggestions(user._id)}
                      >
                        Remove
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
