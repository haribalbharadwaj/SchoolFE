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

const ClassAnalytics = ({ handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [selectedClass, setSelectedClass] = useState(""); // Track selected class filter
  const [classes, setClasses] = useState([]); // New state to store classes data

  const backendUrl = 'https://schoolbe-lcox.onrender.com'; 

  // Fetch all students and classes from the backend
  const fetchAllData = async () => {
    setLoading(true);

    try {
      // Fetch all students
      const studentResponse = await axios.get(`${backendUrl}/student`);
      const classResponse = await axios.get(`${backendUrl}/class`); // Fetch all classes

      console.log("Fetched All Students:", studentResponse.data);
      console.log("Fetched All Class:", classResponse.data);

      if (Array.isArray(studentResponse.data)) {
        setStudents(studentResponse.data); // Store students
        setFilteredStudents(studentResponse.data); // Initially show all students

        // Set class data
        setClasses(classResponse.data); // Store class data
        
        // Set gender counts based on all students
        calculateGenderCounts(studentResponse.data);
      } else {
        console.log("Data structure is incorrect");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
    fetchAllData(); // Fetch all data on component mount
  }, []);

  // Function to get the teacher and year for a specific class
  const getClassDetails = (className) => {
    const classInfo = classes.find(c => c.className === className);
    if (classInfo) {
      return { teacher: classInfo.teacherName, year: classInfo.year };
    }
    return { teacher: 'N/A', year: 'N/A' };
  };

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
      <button onClick={handleClose} className="text-red-500 hover:text-red-700 font-semibold mb-4">Close</button>
  
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
                    <th className="border px-4 py-2">Teacher</th>
                    <th className="border px-4 py-2">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => {
                    const { teacher, year } = getClassDetails(student.className);
                    return (
                      <tr key={index}>
                        <td className="border px-4 py-2">{student.studentName}</td>
                        <td className="border px-4 py-2">{student.gender}</td>
                        <td className="border px-4 py-2">{new Date(student.dob).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">{student.feesPaid ? 'Yes' : 'No'}</td>
                        <td className="border px-4 py-2">{student.className}</td>
                        <td className="border px-4 py-2">{teacher}</td>
                        <td className="border px-4 py-2">{year}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No students available for the selected class.</p>
            )}
          </div>
  
          {/* Chart for Gender Distribution */}
          <div className="chart-container w-full">
            <h2 className="text-xl">Gender Distribution</h2>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: 'top' },
                  datalabels: { display: true },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
  
};

export default ClassAnalytics;
