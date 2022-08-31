import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/commons/Header";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import ForgotPassword from "./components/user/ForgotPassword";
import VerifyAccount from "./components/user/VerifyAccount";
import { ToastContainer } from "react-toastify";
import ConfirmEmail from "./components/user/ConfirmEmail";
import ResetPassword from "./components/user/ResetPassword";
import Profile from "./components/user/Profile";
import Account from "./components/user/Account";
import Purchases from "./components/user/Purchases";
import Settings from "./components/user/Settings";
import AccessData from "./components/user/AccessData";
import ChangeEmail from "./components/user/ChangeEmail";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Header />

          <Routes>
            {/* Auth Related routes*/}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/account/verify" element={<VerifyAccount />} />
            <Route
              path="/confirmation/:email/:token"
              element={<ConfirmEmail />}
            />
            <Route path="/password/reset/:token" element={<ResetPassword />} />

            {/* Account Related Routes */}
            <Route path="/user" element={<Account />}>
              <Route index element={<Purchases />} />
              <Route path="purchases" element={<Purchases />} />
              <Route path="profile" element={<Profile />} />
              {/* <Route path="accessdata" element={<AccessData />} />
              </Route> */}
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/user/profile/access-data" element={<AccessData />} />
            <Route
              path="/user/profile/access-data/change-email"
              element={<ChangeEmail />}
            />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
