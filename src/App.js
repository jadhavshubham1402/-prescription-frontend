// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Login from "./component/Login";
import AdminPanel from "./component/AdminPanel";
import { Provider } from "react-redux";
import store from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import Register from "./component/register";
import DoctorList from "./component/doctorList";
import ProtectedRoute from "./ProtectedRoute";
import ConsultantList from "./component/consultList";
import Profile from "./component/profile";

function App() {
  let persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminPanel />}>
                <Route path="/admin/doctorList" element={<DoctorList />} />
                <Route
                  path="/admin/consultantList"
                  element={<ConsultantList />}
                />
                <Route path="/admin/profile" element={<Profile />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
