import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import "./index.css";
import "./App.css";
import ReservationForm from "./components/ReservationForm";
import OrderConfirmation from "./components/OrderConfirmation";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-start py-12 px-2">
          <div className="w-full max-w-4xl">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reserve/:vin" element={<ReservationForm />} />
              <Route
                path="/confirmation/:vin"
                element={<OrderConfirmation />}
              />
              <Route
                path="*"
                element={<div className="text-mclaren">Page Not Found</div>}
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
