import { CommonProps } from "@mui/material/OverridableComponent";

const Banner = () => {
  const style: CommonProps = {
    style: {
      width: "100%",
      height: "150px",
      minHeight: "800px",
      backgroundColor: "#1B1B1F",
      textAlign: "center",
      color: "#FFFFF5DB",
    },
  };
  return (
    <div {...style} className="banner">
      <h1>Celestia</h1>
      <span>A place to manage your wallet</span>
    </div>
  );
};

export default Banner;
