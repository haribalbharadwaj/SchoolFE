import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Importing Bar chart from chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Switch from 'react-switch';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = ({ handleClose }) => {
  const backendUrl = 'https://schoolbe-lcox.onrender.com';
  const [teacherData, setTeacherData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [viewMode, setViewMode] = useState('monthly'); // Default view is monthly

  const fetchAnalyticsData = async () => {
    try {
      const teacherResponse = await axios.get(`${backendUrl}/teacher`);
      const classResponse = await axios.get(`${backendUrl}/class`);
      console.log('classResponse:', classResponse);

      const teacherSalaries = teacherResponse.data;
      const classData = classResponse.data;

      console.log('teacherSalaries:',teacherSalaries);

      setTeacherData(teacherSalaries);
      setClassData(classData); // Set class data here
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [viewMode]);

  useEffect(() => {
    console.log('classData:', classData); // Log the data to see if it's populated correctly
  }, [classData]);

  const handleToggle = () => {
    setViewMode(viewMode === 'monthly' ? 'yearly' : 'monthly');
  };

  // Data for Teacher Salary Bar Chart
  const teacherSalaryData = {
    labels: teacherData.map(teacher => teacher.teacherName), // Display teacher names on the x-axis
    datasets: [{
      label: 'Teacher Salaries',
      data: viewMode === 'monthly'
        ? teacherData.map(teacher => teacher.salary) // Monthly salary data
        : teacherData.map(teacher => teacher.salary * 12), // Yearly salary data
      backgroundColor: 'rgba(75, 192, 192, 0.7)', // Color for bars
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      plugins: [ChartDataLabels],
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value, context) => {
          const teacher = teacherData[context.dataIndex];
          return teacher ? teacher.teacherName : ''; // Return teacher name as the label
        },
      },
    }],
  };

  // Data for Student Fees Bar Chart
  const classFeesData = {
    labels: classData.map(classItem => classItem.className), // Display class names on the x-axis
    datasets: [{
      label: 'Class Fees',
      data: viewMode === 'monthly'
        ? classData.map(classItem => classItem.studentFees) // Monthly fee data
        : classData.map(classItem => classItem.studentFees), // Same fee for yearly
      backgroundColor: 'rgba(153, 102, 255, 0.7)', // Color for bars
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
      plugins: [ChartDataLabels],
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value, context) => {
          const classItem = classData[context.dataIndex];
          return classItem ? classItem.className : ''; // Return class name as the label
        },
      },
    }],
  };

  return (
    <div>
      <h2>Teacher Analytics</h2>
      <button onClick={handleClose} className="text-red-500 hover:text-red-700 font-semibold mb-4">Close</button>
      <div>
        <label>Toggle View: </label>
        <Switch
          onChange={handleToggle}
          checked={viewMode === 'yearly'}
          uncheckedIcon={false}
          checkedIcon={false}
          height={20}
          width={40}
        />
        <span>{viewMode === 'monthly' ? 'Monthly' : 'Yearly'}</span>
      </div>

      <h3>Teacher Salaries</h3>
      <Bar data={teacherSalaryData} />

      <h3>Student Fees</h3>
      <Bar data={classFeesData} />

      <h2>Teacher Salaries Table</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Teacher Name</th>
            <th>Assigned Class</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {teacherData.map((teacher) => (
            <tr key={teacher._id}>
              <td>{teacher.teacherName}</td>
              <td>{teacher.assignedClass}</td>
              <td>{teacher.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Class Fees Table</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Max Students</th>
            <th>Fees</th>
          </tr>
        </thead>
        <tbody>
          {classData.map((classItem) => (
            <tr key={classItem._id}>
              <td>{classItem.className}</td>
              <td>{classItem.maxStudents}</td>
              <td>{classItem.studentFees}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Analytics;
