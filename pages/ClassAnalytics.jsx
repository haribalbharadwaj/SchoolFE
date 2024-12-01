import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

// Register the components that are used in the chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the plugin
);

const ClassAnalytics = ({ handleClose}) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [selectedClass, setSelectedClass] = useState(""); // Track selected class filter

  const backendUrl = 'https://schoolbe-lcox.onrender.com'; 

  // Fetch all students from the backend
  const fetchAllStudents = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${backendUrl}/student`); // Update endpoint if necessary
      console.log("Fetched All Students:", response.data);

      if (Array.isArray(response.data)) {
        setStudents(response.data); // Store all students in state

        // Initially, display all students
        setFilteredStudents(response.data);

        // Set gender counts based on all students
        calculateGenderCounts(response.data);
      } else {
        console.log("Data structure is incorrect");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate gender counts for a given set of students
  const calculateGenderCounts = (studentsList) => {
    const maleStudents = studentsList.filter(student => 
      student.gender && student.gender.trim().toLowerCase() === 'male'
    );
    const femaleStudents = studentsList.filter(student => 
      student.gender && student.gender.trim().toLowerCase() === 'female'
    );

    setMaleCount(maleStudents.length);
    setFemaleCount(femaleStudents.length);
  };

  // Handle class filter change
  const handleClassFilter = (selectedClass) => {
    setSelectedClass(selectedClass);

    // Filter students based on selected class
    const filtered = students.filter(student => student.className === selectedClass);
    setFilteredStudents(filtered);

    // Recalculate gender counts for the filtered students
    calculateGenderCounts(filtered);
  };

  // Handle filter for "All Classes"
  const handleAllClassesFilter = () => {
    setSelectedClass(""); // Reset to show all students
    setFilteredStudents(students); // Show all students
    calculateGenderCounts(students); // Recalculate gender counts for all students
  };

  useEffect(() => {
    fetchAllStudents(); // Fetch all students on component mount
  }, []);

  const chartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Number of Students",
        data: [maleCount, femaleCount],
        backgroundColor: ["#3498db", "#e74c3c"],
        borderColor: ["#2980b9", "#c0392b"],
        borderWidth: 1,
        datalabels: {
          color: '#fff',
          display: true,
          align: 'center',
          font: {
            weight: 'bold',
            size: 16
          },
          formatter: (value) => value
        }
      },
    ],
  };

  // Get a unique list of classes from all students
  const uniqueClasses = [...new Set(students.map(student => student.className))];

  return (
    <div className="class-analytics">
      <h1 className="text-2xl font-semibold mb-4">Class Analytics</h1>
      <button onClick={handleClose}  className="text-red-500 hover:text-red-700 font-semibold mb-4">Close</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex gap-8">
          {/* Class Filter Buttons */}
          <div className="class-filter flex flex-col gap-4">
            <h3 className="text-lg font-medium">Filter by Class</h3>
            <div className="flex flex-col gap-2">
              {uniqueClasses.map((classItem, index) => (
                <button
                  key={index}
                  onClick={() => handleClassFilter(classItem)}
                  className={`px-4 py-2 border rounded ${selectedClass === classItem ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Class {classItem}
                </button>
              ))}
              <button
                onClick={handleAllClassesFilter}
                className={`px-4 py-2 border rounded ${selectedClass === "" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                All Classes
              </button>
            </div>
          </div>

          {/* Table for filtered students */}
          <div className="student-list w-full">
            <h2 className="text-xl">Student List</h2>
            {filteredStudents.length > 0 ? (
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Gender</th>
                    <th className="border px-4 py-2">DOB</th>
                    <th className="border px-4 py-2">Fees Paid</th>
                    <th className="border px-4 py-2">Class</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{student.studentName}</td>
                      <td className="border px-4 py-2">{student.gender}</td>
                      <td className="border px-4 py-2">{new Date(student.dob).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{student.feesPaid ? 'Yes' : 'No'}</td>
                      <td className="border px-4 py-2">{student.className}</td>


                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No students available.</p>
            )}
          </div>

          {/* Graph for gender distribution of filtered students */}
          <div className="gender-distribution w-1/3">
            <h3 className="text-lg font-medium">Gender Distribution</h3>
            <Bar data={chartData} options={{ responsive: true }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassAnalytics;
