import React, { useEffect } from "react";
import {
  Typography,
  Container,
  Stack,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  keyframes,
  Button,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import FriendChart from "../components/FriendChart";


const pulseAnimation = keyframes`
  from {
    opacity: 0.7;
  }
  to {
    opacity: 1;
  }
`;

const AboutDost = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [navigateToSignup, setNavigateToSignup] = React.useState(false);

  useEffect(() => {
    if (navigateToSignup) {
      navigate("/signup");
    }
  }, [navigateToSignup]);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Stack spacing={3} sx={{ py: 8 }}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  height: isMobile ? "300px" : "500px",
                  animation: `${pulseAnimation} 5s infinite alternate`,
                }}
              >
                <video
                  autoPlay
                  loop
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                  }}
                >
                  <source src="/videos/Dost.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
            </Grid>
          </Grid>

          {/* About Dost Section */}
          <Grid container spacing={2} sx={{ bgcolor: "#2b2d42", padding: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" component="h1">
                  Dost: Find Your Tech Buddies!
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Dost is your one-stop platform to connect with fellow tech
                  enthusiasts. Network with developers, programmers, and
                  like-minded individuals who share your passion for the coding
                  world.
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Whether you're a seasoned professional or just starting your
                  coding journey, Dost helps you find friends who can motivate,
                  collaborate, and learn together.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1" }}>
                  <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                    Why Dost?
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: "20px",
                            height: "20px",
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: "50%",
                          }}
                        />
                        <Typography variant="body1">Find Your Tribe</Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Connect with people who share your interests in
                        programming languages, frameworks, and libraries.
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: "20px",
                            height: "20px",
                            backgroundColor: theme.palette.secondary.main,
                            borderRadius: "50%",
                          }}
                        />
                        <Typography variant="body1">
                          Expand Your Network
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Build meaningful connections that can lead to
                        friendships, collaborations, or even professional
                        opportunities.
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: "20px",
                            height: "20px",
                            backgroundColor: theme.palette.success.main,
                            borderRadius: "50%",
                          }}
                        />
                        <Typography variant="body1">
                          Learn and Grow Together
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Motivate and inspire each other, share knowledge, and
                        tackle coding challenges together.
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* User Stories Section */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h2" sx={{ mt: 4 }}>
                User Stories
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Hear what our users are saying about Dost:
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    "Dost helped me connect with a group of developers who share
                    my passion for Python. We now work on freelance projects
                    together, and it's been a fantastic learning experience!"
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontSize: 14 }}>
                    - Sarah, Web Developer
                  </Typography>
                </Card>
                <Card sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    "I found my coding buddy on Dost! We motivate each other to
                    stay on track and celebrate our coding milestones together.
                    It's made learning to code so much more fun."
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontSize: 14 }}>
                    - John, Aspiring Programmer
                  </Typography>
                </Card>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h2" sx={{ mt: 4 }}>
                Join the Dost Community!
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Over {/* Replace with your actual number */}10,000 tech
                enthusiasts have already found their coding buddies on Dost.
                Sign up today and start building your network!
              </Typography>
              <Button
                onClick={() => setNavigateToSignup(!navigateToSignup)}
                variant="contained"
                size="large"
                sx={{ mt: 2, bgcolor: "#4a4e69" }}
              >
                Wants to Create a new Account ?
              </Button>
            </Grid>
          </Grid>
        </Stack>
        <FriendChart />
      </Container>
    </>
  );
};

export default AboutDost;
