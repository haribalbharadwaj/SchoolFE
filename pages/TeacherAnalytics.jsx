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
  const [totalStudentFees, setTotalStudentFees] = useState(0);
  const [totalTeacherSalaries, setTotalTeacherSalaries] = useState(0);
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

       // Calculate total teacher salaries and total student fees
       const totalSalaries = teacherSalaries.reduce((sum, teacher) => sum + teacher.salary, 0);
       const totalFees = classData.reduce((sum, classItem) => sum + classItem.studentFees, 0);
 
       setTotalTeacherSalaries(totalSalaries);
       setTotalStudentFees(totalFees);
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

  const totalDifference = totalStudentFees - totalTeacherSalaries;
  const isProfit = totalDifference >= 0;

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

   // Data for Total Student Fees vs Teacher Salaries Graph
  /* const totalComparisonData = {
    labels: ['Total Student Fees', 'Total Teacher Salaries'], // Display the two categories on the x-axis
    datasets: [{
      label: 'Totals',
      data: [totalStudentFees, totalTeacherSalaries], // Use the calculated totals
      backgroundColor: ['rgba(255, 159, 64, 0.7)', 'rgba(54, 162, 235, 0.7)'], // Different colors for each bar
      borderColor: ['rgba(255, 159, 64, 1)', 'rgba(54, 162, 235, 1)'],
      borderWidth: 1,
      plugins: [ChartDataLabels],
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value, context) => {
          // Calculate the difference between student fees and teacher salaries
          const difference = totalStudentFees - totalTeacherSalaries;
          return context.dataIndex === 0 ? `Student Fees: ${totalStudentFees}` : `Teacher Salaries: ${totalTeacherSalaries}\nDifference: ${difference}`;
        },
      },
    }],
  };*/

  const totalComparisonData = {
    labels: ['Total Student Fees', 'Total Teacher Salaries'],
    datasets: [
      {
        label: 'Totals',
        data: [totalStudentFees, totalTeacherSalaries],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          isProfit ? 'rgba(75, 192, 75, 0.7)' : 'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          isProfit ? 'rgba(75, 192, 75, 1)' : 'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
        plugins: [ChartDataLabels],
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: (value, context) => {
            if (context.dataIndex === 0) {
              return `Fees: ₹${totalStudentFees}`;
            } else {
              const status = isProfit ? 'Profit' : 'Loss';
              const absDifference = Math.abs(totalDifference);
              return `Salaries: ₹${totalTeacherSalaries}\n${status}: ₹${absDifference}`;
            }
          },
        },
      },
    ],
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

      <div style={{ flex: 1, marginRight: '20px' }}>
          <Bar data={totalComparisonData} />
        </div>


      <h3>Total Student Fees vs Teacher Salaries</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Total Comparison Graph */}

        {/* Tables for Teacher Salaries and Class Fees */}
        <div style={{ flex: 1 }}>
          <h2>Teacher Salaries Table</h2>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th style={{ textAlign: 'center', padding: '8px' }}>Teacher Name</th>
        <th style={{ textAlign: 'center', padding: '8px' }}>Assigned Class</th>
        <th style={{ textAlign: 'center', padding: '8px' }}>Salary</th>
      </tr>
    </thead>
    <tbody>
      {teacherData.map((teacher) => (
        <tr key={teacher._id}>
          <td style={{ textAlign: 'center', padding: '8px' }}>{teacher.teacherName}</td>
          <td style={{ textAlign: 'center', padding: '8px' }}>{teacher.assignedClass}</td>
          <td style={{ textAlign: 'center', padding: '8px' }}>₹{teacher.salary}</td>
        </tr>
      ))}
    </tbody>
  </table>

  <h2>Class Fees Table</h2>
  <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th style={{ textAlign: 'center', padding: '8px' }}>Class Name</th>
        <th style={{ textAlign: 'center', padding: '8px' }}>Max Students</th>
        <th style={{ textAlign: 'center', padding: '8px' }}>Fees</th>
      </tr>
    </thead>
    <tbody>
      {classData.map((classItem) => (
        <tr key={classItem._id}>
          <td style={{ textAlign: 'center', padding: '8px' }}>{classItem.className}</td>
          <td style={{ textAlign: 'center', padding: '8px' }}>{classItem.maxStudents}</td>
          <td style={{ textAlign: 'center', padding: '8px' }}>₹{classItem.studentFees}</td>
        </tr>
      ))}
    </tbody>
  </table>
          
        </div>
      </div>
    </div>
  );
};

export default Analytics;
