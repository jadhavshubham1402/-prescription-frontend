import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "react-responsive-modal/styles.css"; // Import the default styles
import { errorToast } from "../toastConfig";
import LoaderComponent from "./loader";
import { getOneUser } from "../axios/axiosInstance";
import { formatHeader } from "../helper/function";

function Profile() {
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState({});
  const { user } = useSelector((store) => store.auth);
  console.log(user);

  const getAllUserData = async () => {
    try {
      setLoader(true);
      const res = await getOneUser({ email: user.email });
      if (res.status == 200) {
        setUserData(res.data.data || []);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    getAllUserData();
  }, []);

  return (
    <>
      {loader && <LoaderComponent />}
      <div className="flex flex-wrap w-full gap-4 justify-start bg-gray-100 p-4">
        <div className="w-[40%] rounded overflow-hidden shadow-lg">
          <img
            className="aspect-square h-40 w-40 my-auto mx-8 cursor-pointer rounded-full object-cover object-top"
            src={`http://localhost:5000/${userData.profile}`}
            alt="uhdisfiks"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">
              Name:{" "}
              <span className="font-semibold text-lg mx-2">
                {userData.name}
              </span>
            </div>

            {user.type == "doctor" && (
              <div className="font-bold text-xl mb-2">
                Speciality:{" "}
                <span className="font-semibold text-lg mx-2">
                  {userData.speciality}
                </span>
              </div>
            )}

            {user.type == "patient" && (
              <div className="font-bold text-xl mb-2">
                Age:{" "}
                <span className="font-semibold text-lg mx-2">
                  {userData.age}
                </span>
              </div>
            )}

            <div className="font-bold text-xl mb-2">
              Email:{" "}
              <span className="font-semibold text-lg mx-2">
                {userData.email}
              </span>
            </div>
            
            <div className="font-bold text-xl mb-2">
              Phone Number:{" "}
              <span className="font-semibold text-lg mx-2">
                {userData.phoneNumber}
              </span>
            </div>
            <div className="font-bold text-xl mb-2">
              Type:{" "}
              <span className="font-semibold text-lg mx-2">
                {formatHeader(userData.type)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
