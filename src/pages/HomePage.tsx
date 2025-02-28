import { Box } from "@mui/material";
import Banner from "../components/Home/Banner";

const HomePage = () => {
  return (
    <div
      className="home"
      style={{
        minHeight: "100vh",
        paddingTop: "100px",
        backgroundColor: "#1B1B1F",
      }}
    >
      <Box>
        <Banner></Banner>
      </Box>
    </div>
  );
};

export default HomePage;
