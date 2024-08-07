import { FadeLoader } from "react-spinners";

const LoaderComponent = () => {
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };

    return (
        <div className="sweet-loading w-screen h-screen bg-slate-300 absolute">
            <FadeLoader
                className="flex items-center justify-center"
                color={"#000000"}
                cssOverride={override}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default LoaderComponent;
