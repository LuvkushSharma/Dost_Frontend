import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Chip,
  Button,
  Input,
  Grid,
  Container,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { fetchUserData } from "../helper/userAPI";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [programmingLanguages, setProgrammingLanguages] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const baseUrl = "https://dost-backend.onrender.com/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData();
        setName(userData.name);
        setEmail(userData.email);
        setProgrammingLanguages(userData.programmingLanguages);
        setFrameworks(userData.frameworks);
        setLibraries(userData.libraries);
        setTitle(userData.title);
        setImageUrl(userData.cloudinaryImageUrl);
      } catch (error) {
        console.error("Profile fetch failed:", error);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (event) => {
    console.log("event.target.files[0]", event.target.files[0].name);
    setImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "dost_luvkush");
      formData.append("cloud_name", "dx2vel6vy");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dx2vel6vy/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const cloudinaryImageUrl = response.data.secure_url; // Extract Cloudinary image URL

      console.log("Image uploaded successfully:", cloudinaryImageUrl);

      // Update user schema with the Cloudinary image URL
      await axios.patch(
        `${baseUrl}/api/v1/users/update`,
        { cloudinaryImageUrl },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setImageUrl(cloudinaryImageUrl);
      setUploading(false);
      console.log("Image uploaded successfully:", response.data.imageUrl);
      // Optionally, you can update the profile picture in the UI after successful upload
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploading(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 5,
        background: "linear-gradient(to bottom right, #00203FFF, #ADEFD1FF)",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 5,
          p: 5,
        }}
      >
        <Card
          sx={{
            maxWidth: 350,
            p: 4,
            mb: 3,
            borderRadius: 10,
            backgroundColor: "#1c4e80",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            transform: "scale(1)",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <CardContent>
            <CardMedia
              component="img"
              sx={{ pt: 2, height: 250, borderRadius: "5%", transition: "transform 0.3s ease-in-out" }}
              image={imageUrl ? imageUrl : "/default-avatar.png"}
              alt="Profile Picture"
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
            <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 700, color: "#FFF" }}>
              {name}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1.5, color: "#EEE" }}
            >
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#DDD" }}>
              {email}
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                bgcolor: "#343a40",
                textAlign: "center",
                borderRadius: 10,
                padding: 1,
                color: "#fff",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              Technical Skills
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ color: "#FFF" }} gutterBottom>
              Programming Languages:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {programmingLanguages.map((language) => (
                <Chip
                  key={language}
                  label={language}
                  variant="outlined"
                  sx={{
                    color: "#FFF",
                    borderColor: "#FFF",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ color: "#FFF" }} gutterBottom>
              Frameworks:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {frameworks.map((framework) => (
                <Chip
                  key={framework}
                  label={framework}
                  variant="outlined"
                  sx={{
                    color: "#FFF",
                    borderColor: "#FFF",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ color: "#FFF" }} gutterBottom>
              Libraries:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {libraries.map((library) => (
                <Chip
                  key={library}
                  label={library}
                  variant="outlined"
                  sx={{
                    color: "#FFF",
                    borderColor: "#FFF",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Input type="file" onChange={handleImageChange} />
          <Button
            variant="contained"
            onClick={handleImageUpload}
            disabled={uploading}
            sx={{
              ml: 2,
              backgroundColor: uploading ? "#adb5bd" : "#343a40",
              color: uploading ? "#6c757d" : "#fff",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: uploading ? "#adb5bd" : "#495057",
                transform: "scale(1.1)",
              },
              "&:active": {
                transform: "scale(0.9)",
              },
            }}
          >
            {uploading ? <CircularProgress size={24} /> : "Upload Image"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
