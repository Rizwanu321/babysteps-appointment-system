import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to BabySteps
      </h1>
      <p className="text-gray-600 mb-8">
        Schedule your appointments with our experienced doctors
      </p>
      <Link
        to="/doctors"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Book an Appointment
      </Link>
    </div>
  );
};

export default Home;
