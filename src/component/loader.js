import { FadeLoader } from "react-spinners";

const LoaderComponent = () => {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed", // Ensure it covers the whole screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    zIndex: 9999, // High z-index to appear above other content
  };

  const loaderStyle = {
    display: "block",
    margin: "0 auto",
    borderColor: "red", // This color is used for the border of the loader
  };

  return (
    <div style={containerStyle}>
      <FadeLoader
        color={"#000000"} // Color of the loader
        cssOverride={loaderStyle}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoaderComponent;
