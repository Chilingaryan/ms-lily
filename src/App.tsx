// src/App.tsx - Updated version
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import AdminLayout from "./layout/AdminLayout";
import styles from "./App.module.scss";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { checkAuthAsync } from "./store/store";

export default function App() {
  const { loggedIn, loading } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  // Check authentication status on app load
  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                  }}
                >
                  Loading...
                </div>
              ) : loggedIn ? (
                <AdminLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="products" element={<Products />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
