// src/components/dashboards/UserDashboard.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

/**
 * **User Dashboard Component**
 * 
 * Provides client functionality for pet owners
 * Includes pet management, appointment scheduling, and personal information
 *
 * @author gml
 * @version 1.0
 */
const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("my-pets");
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setPets([
      {
        id: 1,
        name: "Buddy",
        species: "DOG",
        breed: "Golden Retriever",
        age: 3,
      },
      { id: 2, name: "Mittens", species: "CAT", breed: "Siamese", age: 2 },
    ]);

    setAppointments([
      {
        id: 1,
        pet: "Buddy",
        date: "2024-01-20 10:00",
        type: "Annual Checkup",
        status: "Confirmed",
      },
      {
        id: 2,
        pet: "Mittens",
        date: "2024-01-25 14:00",
        type: "Vaccination",
        status: "Pending",
      },
    ]);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleRequestAppointment = () => {
    // Implement appointment request logic
    alert("Appointment request feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to Happy Paws Veterinary Clinic
              </h1>
              <p className="text-sm text-gray-500">
                Hello, {user?.username}! Manage your pets and appointments here.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {["my-pets", "appointments", "request-appointment", "profile"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.split("-").join(" ")}
                </button>
              )
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* My Pets Tab */}
          {activeTab === "my-pets" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    My Pets
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pets.map((pet) => (
                      <div
                        key={pet.id}
                        className="bg-gray-50 rounded-lg p-4 border"
                      >
                        <h4 className="text-lg font-semibold text-gray-900">
                          {pet.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {pet.species} • {pet.breed}
                        </p>
                        <p className="text-sm text-gray-500">
                          Age: {pet.age} years
                        </p>
                        <div className="mt-3 flex space-x-2">
                          <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                            View Details
                          </button>
                          <button className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                            Request Appointment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Add New Pet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  My Appointments
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {appointment.pet}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                appointment.status === "Confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              Reschedule
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Request Appointment Tab */}
          {activeTab === "request-appointment" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Request New Appointment
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Select Pet
                    </label>
                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option>Select a pet</option>
                      {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason for Visit
                    </label>
                    <textarea
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                    />
                  </div>
                  <button
                    onClick={handleRequestAppointment}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Request Appointment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
