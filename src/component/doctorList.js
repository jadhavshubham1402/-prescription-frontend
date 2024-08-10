import React, { useEffect, useState } from "react";
import { createConsultant, getAllUser } from "../axios/axiosInstance";
import ReactPaginate from "react-paginate";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css"; // Import the default styles
import { errorToast, successToast } from "../toastConfig";
import LoaderComponent from "./loader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";

function DoctorList() {
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [userScores, setUserScore] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const [modalShow, setModalShow] = useState(false);
  const [id, setId] = useState("");
  const initialValues = {
    currentIllnessHistory: "",
    recentSurgery: "",
    familyMedicalHistory: "",
    anyAllergies: "",
    others: "",
  };

  const validationSchema = Yup.object().shape({
    currentIllnessHistory: Yup.string().required(
      "Current Illness History is required"
    ),
    recentSurgery: Yup.string().optional(),
    familyMedicalHistory: Yup.string().required(
      "Family Medical History is required"
    ),
    anyAllergies: Yup.string().optional(),
    others: Yup.string().optional(),
  });

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleClick = (id) => {
    setModalShow(true);
    setId(id);
  };
  const handleClose = () => setModalShow(false);

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      setLoader(true);
      values = { ...values, doctorId: id, patientId: user._id };
      const res = await createConsultant(values);
      if (res.status == 200) {
        successToast("Consulant form added Successfully");
        setModalShow(false);
        setId("");
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };

  const getAllUserData = async () => {
    try {
      setLoader(true);
      const res = await getAllUser({ type: "doctor", page: currentPage });
      if (res.status == 200) {
        setUserScore(res.data.data || []);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    getAllUserData();
  }, [currentPage]);

  return (
    <>
      {loader && <LoaderComponent />}
      <div className="flex flex-wrap w-full gap-4 justify-start bg-gray-100 p-4">
        {userScores &&
          userScores.map((e, index) => {
            return (
              <div
                className="w-[30%] rounded overflow-hidden shadow-lg"
                key={index}>
                <img
                  className="aspect-square h-40 w-40 my-auto mx-8 items-center cursor-pointer rounded-full object-cover object-top"
                  src={`http://localhost:5000/${e.profile}`}
                  alt="uhdisfiks"
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">
                    Name:{" "}
                    <span className="font-semibold text-lg mx-2">{e.name}</span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Speciality:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.speciality}
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <button
                    type="submit"
                    onClick={() => handleClick(e._id)}
                    // disabled={isSubmitting}
                    className="linear text-gray-900 bg-blue-400 hover:bg-blue-800 active:bg-blue-900 hover:text-white active:text-white mt-2 w-full rounded-xl  py-[8px] text-lg font-medium">
                    Consult
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      <ReactPaginate
        className="item-center flex justify-end gap-2 pt-3 text-lg drop-shadow-sm"
        previousLabel={
          <p className="px-2 py-0.5 border rounded-sm border-white-300 bg-white text-[#000000] flex item-center justify-center hover:bg-blue-800 hover:text-white min-w-8">
            Prev
          </p>
        }
        nextLabel={
          <p className="px-2 py-0.5 border rounded-sm border-white-300 bg-white text-[#000000] flex item-center justify-center hover:bg-blue-800 hover:text-white min-w-8">
            Next
          </p>
        }
        breakLabel="..."
        breakClassName="break-me"
        pageCount={Math.ceil(userScores.length / 10)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        activeClassName={"custom-active"}
        pageClassName={
          "rounded-sm custom-page flex item-center justify-center hover:bg-blue-800 hover:text-white"
        }
        pageLinkClassName={
          "px-2 py-0.5 rounded-sm min-w-8 flex items-center justify-center hover:bg-blue-800 hover:text-white"
        }
        onPageActive={(data) => (
          <p className="px-2 py-0.5 rounded-sm min-w-8 flex items-center justify-center hover:bg-blue-800 hover:text-white">
            {data.page + 1} {/* Assuming page indexes start from 0 */}
          </p>
        )}
      />
      <Modal open={modalShow} onClose={handleClose} className="w-[30%]" center>
        <div className="font-bold text-3xl my-4">Consult Form</div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label
                  htmlFor="currentIllnessHistory"
                  className="mb-1 block text-lg font-medium text-gray-800">
                  Current Illness History
                </label>
                <Field
                  type="text"
                  id="currentIllnessHistory"
                  name="currentIllnessHistory"
                  placeholder="Enter your Current Illness History"
                  className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                />
                <ErrorMessage
                  name="currentIllnessHistory"
                  component="div"
                  className="mt-1 text-lg text-red-600"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="recentSurgery"
                  className="mb-1 block text-lg font-medium text-gray-800">
                  Recent Surgery
                </label>
                <Field
                  type="date"
                  id="recentSurgery"
                  name="recentSurgery"
                  placeholder="Enter your Current Illness History"
                  className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                  max={new Date().toISOString().split("T")[0]}
                  />
                <ErrorMessage
                  name="recentSurgery"
                  component="div"
                  className="mt-1 text-lg text-red-600"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="familyMedicalHistory"
                  className="mb-1 block text-lg font-medium text-gray-800">
                  Family Medical History
                </label>
                <label className="inline mx-2">
                  <Field
                    type="radio"
                    id="historyOption1"
                    name="familyMedicalHistory"
                    value="Diabetics"
                    className="mr-2"
                  />
                  <span>Diabetics</span>
                </label>

                <label className="inline mx-2">
                  <Field
                    type="radio"
                    id="historyOption2"
                    name="familyMedicalHistory"
                    value="Non-Diabetics"
                    className="mr-2"
                  />
                  <span>Non-Diabetics</span>
                </label>
                <ErrorMessage
                  name="familyMedicalHistory"
                  component="div"
                  className="mt-1 text-lg text-red-600"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="anyAllergies"
                  className="mb-1 block text-lg font-medium text-gray-800">
                  Any Allergies
                </label>
                <Field
                  type="text"
                  id="anyAllergies"
                  name="anyAllergies"
                  placeholder="Enter your Any Allergies"
                  className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                />
                <ErrorMessage
                  name="anyAllergies"
                  component="div"
                  className="mt-1 text-lg text-red-600"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="others"
                  className="mb-1 block text-lg font-medium text-gray-800">
                  others
                </label>
                <Field
                  type="text"
                  id="others"
                  name="others"
                  placeholder="Enter your others"
                  className="h-9 w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                />
                <ErrorMessage
                  name="others"
                  component="div"
                  className="mt-1 text-lg text-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="linear text-gray-900 bg-blue-400 hover:bg-blue-800 active:bg-blue-900 hover:text-white active:text-white mt-2 w-full rounded-xl  py-[8px] text-lg font-medium">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default DoctorList;
