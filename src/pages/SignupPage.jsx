import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import MultipleSelectCheckmarks from "../components/MultipleSelectCheckmarks";

const languages = [
  "JavaScript",
  "Python",
  "Java",
  "C/C++",
  "C#",
  "PHP",
  "Dart",
  "Other",
];
const frameworksLists = [
  "React",
  "Angular",
  "Vue.js",
  "Express",
  "Django",
  "Flask",
  "Other",
];

const librariesLists = ["Pandas", "Numpy", "Matplotlib", "Seaborn", "Other"];

const titles = [
  "Data Scientist",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Mobile App Developer",
  "DevOps Engineer",
  "UI/UX Designer",
  "QA",
  "Cloud Engineer",
  "B.Tech Hons. Student",
];

const SignupPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [programmingLanguages, setProgrammingLanguages] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [hobbies, setHobbies] = useState("");
  const [participatedInHackathon, setHackathon] = useState(false);
  const [title, setTitle] = useState("");

  const [isFailed, setIsFailed] = useState(false);
  const [timerStarts, setTimerStarts] = useState(false);

  const baseUrl = "https://dost-backend.onrender.com";

  const handleSignup = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/users/signup`, {
        name,
        email,
        password,
        passwordConfirm,
        programmingLanguages,
        frameworks,
        libraries,
        hobbies,
        participatedInHackathon,
        title,
      }, { withCredentials: true });

      localStorage.setItem('jwt', JSON.stringify(response.data.token));

      setIsFailed(false);
      setTimerStarts(true);

      setTimeout(() => {
        console.log("Signup Successful!");
        setTimerStarts(false);
        navigate("/home", { replace: true });
      }, 3000);
    } catch (error) {
      setIsFailed(true);
      console.error(
        "Signup failed:",
        error.response ? error.response.data.message : error.message
      );
      // Handle signup error
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <video
        src="/videos/loginPage.mp4"
        autoPlay
        loop
        muted
        style={{
          width: "100%", // Video occupies full width of the screen
          height: "100%", // Video occupies full height of the screen
          objectFit: "cover",
          position: "fixed", // Fix the video position
          top: 0,
          left: 0,
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%", // Full width of the screen
          height: "100%", // Full height of the screen
          backdropFilter: "blur(5px)", // Blur effect
        }}
      >
        <Box
          sx={{
            zIndex: 1, // Ensure login form is above the video
            width: { xs: "100%", sm: "60%", md: "65%", lg: "50%" },
            padding: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
            position: "absolute",
            textAlign: "center", // Center the content horizontally
            borderRadius: "20px", // Rounded corners
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)", // Add shadow effect
          }}
        >
          <Typography variant="h5" align="center" sx={{ marginBottom: "10px" }}>
            Signup
          </Typography>

          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            InputProps={{
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                marginRight: "1rem",
              },
            }}
          />

          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            InputProps={{
              style: { backgroundColor: "rgba(255, 255, 255, 0.5)" },
            }}
          />

          <br></br>

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                marginRight: "1rem",
              },
            }}
          />

          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            margin="normal"
            InputProps={{
              style: { backgroundColor: "rgba(255, 255, 255, 0.5)" },
            }}
          />

          <Grid
            container
            spacing={1}
            sx={{justifyContent: "space-around" }}
          >
            <MultipleSelectCheckmarks
              Lists={languages}
              label={"Programming Languages"}
              item={programmingLanguages}
              setItem={setProgrammingLanguages}
            />
            <MultipleSelectCheckmarks
              Lists={librariesLists}
              label={"Libraries"}
              item={libraries}
              setItem={setLibraries}
            />

            <MultipleSelectCheckmarks
              Lists={frameworksLists}
              label={"Frameworks"}
              item={frameworks}
              setItem={setFrameworks}
              style={{ width: "100%" }} // Adjusted width for responsiveness
            />
            <Select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              displayEmpty
              variant="outlined"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
              }}
            >
              <MenuItem value="" disabled>
                Select Title
              </MenuItem>
              {titles.map((title) => (
                <MenuItem key={title} value={title}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
            
            <Grid item xs={12} sm={4}>
              <TextField
                id="outlined-multiline-static"
                label="Hobbies"
                multiline
                rows={4} // Adjust rows as needed
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                margin="normal"
                InputProps={{
                  style: { backgroundColor: "rgba(255, 255, 255, 0.5)" },
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography variant="subtitle1">
                Participated in Hackathon
              </Typography>
              <Switch
                checked={participatedInHackathon}
                color="secondary"
                onChange={(e) => setHackathon(e.target.checked)}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Grid>
          </Grid>

          <Box mt={2}>
            {isFailed && <Alert severity="error">Enter Correct Details!</Alert>}
            {timerStarts && (
              <Alert severity="success">Signup Successful!</Alert>
            )}
          </Box>

          <Box mt={2}>
            <Button
              variant="contained"
              onClick={handleSignup}
              color="primary"
              sx={{ width: "100%" }}
            >
              Signup
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default SignupPage;


