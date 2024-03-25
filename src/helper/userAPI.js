import axios from "axios";

const fetchUserData = async () => {
  try {
    const res = await axios.get("https://dost-backend.onrender.com/api/v1/users/profile", {
      withCredentials: true,
    });
    return res.data.data.user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Re-throw the error for handling in components
  }
};

export { fetchUserData };
