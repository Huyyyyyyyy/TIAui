import { Box } from "@mui/material";
import HistoryComponent from "../components/History/HisotryComponent";

const HistoryPage = () => {
  return (
    <div
      className="login-form"
      style={{ padding: "10px 50px", minHeight: "800px" }}
    >
      <Box>
        <HistoryComponent />
      </Box>
    </div>
  );
};

export default HistoryPage;
