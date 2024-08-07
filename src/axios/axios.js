import axios from "axios";
import store from "../redux/store";
import { logout, setToken } from "../redux/reducer/reducer";
import { errorToast } from "../toastConfig";

const publicApisPath = [
    "/api/login",
    "/api/register"
];

const Axios = axios.create({
    baseURL: "http://localhost:5000/", //todo add .env
});

Axios.interceptors.request.use(
    function (request) {
        // Do something before request is sent
        if (store.getState().auth.token && !publicApisPath.includes(request.url)) {
            request.headers["authorization"] = `Bearer ${store.getState().auth.token}`;
        }

        return request;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

Axios.interceptors.response.use(
    function (response) {
        // console.log('Interceptor Data :>> ', response.data)
        return response;
    },
    function (error) {
        console.log("Inside interceptor ===>", { error });
        const statusCode = error.response?.status || error.code;
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Something Went Wrong!!";

        switch (statusCode) {
            case 403:
            case 401:
                errorToast("Session Expired !");
                store.dispatch(setToken(null));
                store.dispatch(logout());
                break;
            case 404:
                console.log("404");
                return Promise.reject(error);
            case 500:
                console.log("Error 500 ===>", errorMessage, { statusCode });
                // if (errorMessage == "ERR_NETWORK")
                // errorToast(errorMessage);
                return Promise.reject(error);
            case "ERR_NETWORK":
                return Promise.reject(error);
            default:
                // Handle all other status codes
                // Optionally, you can reject the promise with the error
                // if you want the calling code to handle it further
                console.log("Error Default ===>", errorMessage, { statusCode });

                return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default Axios;
