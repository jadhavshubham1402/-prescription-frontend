import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css"; // Import the default styles
import * as Yup from "yup";
import {
  createPrescription,
  getAllConsultant,
  getOnePrescription,
  updatePrescription,
} from "../axios/axiosInstance";
import { formatDate, generatePDF } from "../helper/function";
import { errorToast, successToast } from "../toastConfig";
import LoaderComponent from "./loader";

function ConsultantList() {
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [userScores, setUserScore] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const [modalShow, setModalShow] = useState(false);
  const [PrescriptionData, setPrescriptionData] = useState({});
  const [data, setData] = useState({});
  const initialValues = {
    careToBeTaken: PrescriptionData?.careToBeTaken || "",
    medicines: PrescriptionData?.medicines || "",
  };

  const validationSchema = Yup.object().shape({
    careToBeTaken: Yup.string().required("Care To Be Taken is required"),
    medicines: Yup.string().required("Medicines is required"),
  });

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleClick = async (consultData) => {
    try {
      setLoader(true);
      const res = await getOnePrescription({ consultationId: consultData._id });
      if (res.status == 200) {
        if (user.type == "doctor") {
          setPrescriptionData(res.data.data);
          setModalShow(true);
        }

        if (res.data.data && user.type != "doctor") {
          generatePDF(
            res.data.data.doctorName,
            res.data.data.speciality,
            formatDate(res.data.data.createdAt),
            res.data.data.careToBeTaken,
            res.data.data.medicines
          );
        } else if(user.type != "doctor") {
          errorToast(
            "Prescription not submitted yet by doctor, Kindly wait for the prescription"
          );
        }

        if (!res.data.data) {
          setData({
            consultationId: consultData._id,
            doctorId: consultData.doctorId,
            patientId: consultData.patientId,
          });
        }
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      errorToast(error?.response?.data?.message || error?.message);
    }
  };
  const handleClose = () => setModalShow(false);

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      setLoader(true);
      let res;
      if (PrescriptionData) {
        values = { ...values, id: PrescriptionData._id };
        res = await updatePrescription();
      } else {
        values = {
          ...values,
          consultationId: data.consultationId,
          doctorId: data.doctorId,
          patientId: data.patientId,
        };
        console.log(data, "heheheheheh");
        console.log(values);
        res = await createPrescription(values);
      }

      if (res.status == 200) {
        successToast(
          `Prescription form ${
            PrescriptionData ? "added" : "updated"
          } Successfully`
        );
        setModalShow(false);
        setData({});
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

      let getData = {
        page: currentPage,
      };

      if (user.type == "patient") {
        getData = { ...getData, patientId: user._id };
      } else if (user.type == "doctor") {
        getData = { ...getData, doctorId: user._id };
      }
      const res = await getAllConsultant(getData);
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
                className="w-[45%] rounded overflow-hidden shadow-lg"
                key={index}>
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">
                    Patient Name:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.patientName}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Patient Age:{" "}
                    <span className="font-semibold text-lg mx-2">{e.age}</span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Current Illness History:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.currentIllnessHistory || "N/A"}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Recent Surgery:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.recentSurgery ? formatDate(e.recentSurgery) : "N/A"}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Family Medical History:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.familyMedicalHistory || "N/A"}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Any Allergies:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.anyAllergies || "N/A"}
                    </span>
                  </div>
                  <div className="font-bold text-xl mb-2">
                    Others:{" "}
                    <span className="font-semibold text-lg mx-2">
                      {e.others || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4">
                  {user.type == "patient" ? (
                    <button
                      type="submit"
                      onClick={() => handleClick(e)}
                      className="linear text-gray-900 bg-blue-400 hover:bg-blue-800 active:bg-blue-900 hover:text-white active:text-white mt-2 w-full rounded-xl  py-[8px] text-lg font-medium">
                      Download
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onClick={() => handleClick(e)}
                      // disabled={isSubmitting}
                      className="linear text-gray-900 bg-blue-400 hover:bg-blue-800 active:bg-blue-900 hover:text-white active:text-white mt-2 w-full rounded-xl  py-[8px] text-lg font-medium">
                      Prescription
                    </button>
                  )}
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
        <div className="font-bold text-3xl my-4">Prescription Form</div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label
                  htmlFor="careToBeTaken"
                  className="mb-1 block text-lg font-medium text-gray-800">
                  Care To Be Taken
                </label>
                <Field
                  type="text"
                  as="textarea"
                  row={4}
                  id="careToBeTaken"
                  name="careToBeTaken"
                  placeholder="Enter your Care To Be Taken"
                  className="w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                />
                <ErrorMessage
                  name="careToBeTaken"
                  component="div"
                  className="mt-1 text-lg text-red-600"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="medicines"
                  className="mb-1 block text-lg font-medium text-gray-800">
                  Medicines
                </label>
                <Field
                  type="text"
                  as="textarea"
                  row={4}
                  id="medicines"
                  name="medicines"
                  placeholder="Enter your Medicines"
                  className="w-full rounded-lg border-2 border-gray-200 p-2 outline-none placeholder:text-lg hover:border-gray-500 focus:border-gray-500 active:border-gray-500"
                />
                <ErrorMessage
                  name="medicines"
                  component="div"
                  className="mt-1 text-lg text-red-600"
                />
              </div>
              {user.type == "doctor" && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="linear text-gray-900 bg-blue-400 hover:bg-blue-800 active:bg-blue-900 hover:text-white active:text-white mt-2 w-full rounded-xl  py-[8px] text-lg font-medium">
                  Submit
                </button>
              )}
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default ConsultantList;
