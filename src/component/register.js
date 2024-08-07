import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { register } from "../axios/axiosInstance";
import LoaderComponent from "./loader";
import { errorToast, successToast } from "../toastConfig";
import { useDropzone } from "react-dropzone";

const Register = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    speciality: "",
    age: "",
    yearOfExperience: "",
    type: "",
    historyOfSurgery: "",
    historyOfIllness: "",
    file: null,
    password: "",
    confirmPass: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
        "Password must contain at least one uppercase letter, one symbol, and one number"
      ),
    confirmPass: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    file: Yup.mixed()
      .required("file is required")
      .test("fileType", "Only images are allowed", (value) => {
        return (
          value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
        );
      }),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      setLoader(true);
      delete values.confirmPass;
      const res = await register(values);

      if (res.status == 200) {
        successToast("User Created");
        navigate("/");
      }
      setLoader(false);
      setSubmitting(false);
    } catch (error) {
      setLoader(false);
      setSubmitting(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };

  const FileInput = ({ field, form: { setFieldValue } }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        setFieldValue(field.name, acceptedFiles[0]);
      },
      accept: "image/jpeg, image/png, image/gif",
      multiple: false,
    });

    return (
      <div
        {...getRootProps({
          className:
            "dropzone border-2 border-gray-300 border-dashed rounded-md p-4 text-center cursor-pointer",
        })}>
        <input {...getInputProps()} />
        {field.value ? (
          <p className="text-sm text-gray-600">
            File selected: {field.value.name}
          </p>
        ) : isDragActive ? (
          <p className="text-sm text-gray-600">Drop the image here ...</p>
        ) : (
          <p className="text-sm text-gray-600">
            Drag 'n' drop image here, or click to select image
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {loader && <LoaderComponent />}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="my-3 text-3xl font-bold text-navy-700">Register</div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}>
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="mb-1 block text-lg font-medium text-gray-800">
                    Profile Image
                  </label>
                  <Field name="file" component={FileInput} />
                  <ErrorMessage
                    name="file"
                    component="div"
                    className="mt-1 text-lg text-red-600"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="name"
                    className="mb-1 block text-lg font-medium text-gray-800">
                    Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="mt-1 text-lg text-red-600"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="mb-1 block text-lg font-medium text-gray-800">
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your Email"
                    className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-lg text-red-600"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="phoneNumber"
                    className="mb-1 block text-lg font-medium text-gray-800">
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter your Phone Number"
                    className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="mt-1 text-lg text-red-600"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="speciality"
                    className="mb-1 block text-lg font-medium text-gray-800">
                    Speciality
                  </label>
                  <Field
                    type="text"
                    id="speciality"
                    name="speciality"
                    placeholder="Enter your speciality"
                    className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                  />
                  <ErrorMessage
                    name="speciality"
                    component="div"
                    className="mt-1 text-lg text-red-600"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="yearOfExperience"
                    className="mb-1 block text-lg font-medium text-gray-800">
                    Year Of Experience
                  </label>
                  <Field
                    type="text"
                    id="yearOfExperience"
                    name="yearOfExperience"
                    placeholder="Enter your Year Of Experience"
                    className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                  />
                  <ErrorMessage
                    name="yearOfExperience"
                    component="div"
                    className="mt-1 text-lg text-red-600"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="mb-1 block text-lg font-medium text-gray-800">
                    Password
                  </label>
                  <div className="flex items-center rounded-lg border-2 border-gray-200 px-2 py-1 hover:border-gray-500 focus:border-gray-500">
                    <Field
                      type={showPass ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter your Password"
                      className="h-7 w-full rounded-lg border-none outline-none placeholder:text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="ml-2 focus:outline-none">
                      {showPass ? (
                        <FaEyeSlash className="text-gray-400" />
                      ) : (
                        <FaEye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-lg text-red-600"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="confirmPass"
                    className="mb-1 block text-lg font-medium text-gray-800">
                    Confirm password
                  </label>
                  <div className="flex items-center rounded-lg border-2 border-gray-200 px-2 py-1 hover:border-gray-500 focus:border-gray-500">
                    <Field
                      type={showConfirmPass ? "text" : "password"}
                      id="confirmPass"
                      name="confirmPass"
                      placeholder="Enter your Confirm password"
                      className="h-7 w-full rounded-lg border-none outline-none placeholder:text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="ml-2 focus:outline-none">
                      {showConfirmPass ? (
                        <FaEyeSlash className="text-gray-400" />
                      ) : (
                        <FaEye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPass"
                    component="div"
                    className="mt-1 text-lg text-red-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="linear text-gray-900 bg-blue-400 hover:bg-blue-800 active:bg-blue-900 hover:text-white active:text-white mt-2 w-full rounded-xl  py-[8px] text-lg font-medium">
                  Register
                </button>
                <div
                  className="mb-3 ml-auto flex cursor-pointer items-center justify-center px-2 text-lg text-blue-400"
                  onClick={() => navigate("/")}>
                  Back to Login
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Register;
