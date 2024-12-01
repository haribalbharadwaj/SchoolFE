import React, { useState, useEffect } from 'react';
import Form from '../components/Form';
import '../src/index.css';
import axios from 'axios';
import Table from '../components/Table';
import ClassAnalytics from '../pages/ClassAnalytics';
import TeacherAnalytics from '../pages/TeacherAnalytics.jsx';

const Dashboard = () => {
  const [formType, setFormType] = useState(null);
  const [dataList, setDataList] = useState([]); // State to hold the fetched data
  const [errors, setErrors] = useState({}); // Track validation errors
  const [editingItemId, setEditingItemId] = useState(null); // Track editing ID
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [teachers,setTeachers] = useState([]);
  
  const initialFormData = {
    className: '',
    year: '',
    teacher: '',
    studentFees: '',
    maxStudents: '',
    studentName: '',
    gender: '',
    dob: '',
    contactDetails:{
      email: '',
      phone: '',
    },
    feesPaid: false,
    class: '',
    teacherName: '',
    salary: '',
    assignedClass: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const backendUrl = 'https://schoolbe-lcox.onrender.com';
  console.log('backendUrl :',backendUrl );

  // Fetch classes from the backend when component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/class`);
        setClasses(response.data); // Store fetched classes
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/teacher`);
        console.log('teachersResponse.data:', response.data); // Ensure the correct data is returned
        setTeachers(response.data); // Update teachers state
        console.log('updated teachers:',teachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
  
    fetchTeachers();
  }, []); 

  useEffect(() => {
    console.log('Updated teachers state:', teachers);
  }, [teachers]);  // This will log the state whenever 'teachers' changes
  
  

  const handleChange = (field, value, isNested = false, nestedField = '') => {
    console.log(field.options); // Check this log to see if label and value are defined
    setFormData((prevData) => {
      if (isNested && nestedField) {
        return {
          ...prevData,
          [field]: {
            ...prevData[field],
            [nestedField]: value,
          },
        };
      }
      return {
        ...prevData,
        [field]: value,
      };
    });
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '', // Clear error when the user starts typing
    }));
  };
  

  const classFields = [
    { label: 'Class Name', name: 'className', type: 'text', value: formData.className, onChange: (e) => handleChange('className', e.target.value) },
    { label: 'Year', name: 'year', type: 'number', value: formData.year, onChange: (e) => handleChange('year', e.target.value) },
    { 
      label: 'Select Teacher', 
      name: 'teacher', 
      type: 'select', 
      options: teachers && teachers.length > 0 ? 
        teachers.map((teacher) => ({ label: teacher.teacherName, value: teacher._id })) : 
        [{ label: 'No teachers available', value: '' }],
      value: formData.teacher,
      onChange: (e) => handleChange('teacher', e.target.value)
    },          
    { label: 'Student Fees', name: 'studentFees', type: 'number', value: formData.studentFees, onChange: (e) => handleChange('studentFees', e.target.value) },
    { label: 'Max Students', name: 'maxStudents', type: 'number', value: formData.maxStudents, onChange: (e) => handleChange('maxStudents', e.target.value) },
  ];

  const studentFields = [
    { label: 'Student Name', name: 'studentName', type: 'text', value: formData.studentName, onChange: (e) => handleChange('studentName', e.target.value) },
    { label: 'Gender', name: 'gender', type: 'select',  options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ], value: formData.gender, onChange: (e) => handleChange('gender', e.target.value) },
    { label: 'Date of Birth', name: 'dob', type: 'date', value: formData.dob ? formData.dob.slice(0, 10) : '', onChange: (e) => handleChange('dob', e.target.value) },
    { label: 'Email', name: 'email', type: 'email', value: formData.contactDetails?.email || '',onChange: (e) => handleChange('contactDetails', e.target.value, true, 'email') },
    { label: 'Phone', name: 'phone', type: 'text', value: formData.contactDetails?.phone || '', onChange: (e) => handleChange('contactDetails', e.target.value, true, 'phone') },
    { label: 'Fees Paid', name: 'feesPaid', type: 'checkbox', value: formData.feesPaid || false, onChange: (e) => handleChange('feesPaid', e.target.checked) },
  //  { label: 'Class ID', name: 'class', type: 'text', value: formData.class, onChange: (e) => handleChange('class', e.target.value) },
    { 
      label: 'Select Class', 
      name: 'class', 
      type: 'select', 
      options: classes.map((cls) => ({ label: cls.className, value: cls._id })), // Map the fetched classes to select options
      value: formData.class,
      onChange: (e) => handleChange('class', e.target.value)
    },
  ];
  

  const teacherFields = [
    { label: 'Teacher Name', name: 'teacherName', type: 'text', value: formData.teacherName, onChange: (e) => handleChange('teacherName', e.target.value) },
    { label: 'Gender', name: 'gender', type: 'select',  options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ], value: formData.gender, onChange: (e) => handleChange('gender', e.target.value) },
    { label: 'Date of Birth', name: 'dob', type: 'date', value: formData.dob ? formData.dob.slice(0, 10) : '', onChange: (e) => handleChange('dob', e.target.value) },
    { label: 'Email', name: 'email', type: 'email', value: formData.contactDetails?.email || '', onChange: (e) => handleChange('contactDetails', e.target.value, true, 'email') },
    { label: 'Phone', name: 'phone', type: 'phone', value: formData.contactDetails?.phone || '', onChange: (e) => handleChange('contactDetails', e.target.value, true, 'phone') },
    { label: 'Salary', name: 'salary', type: 'number', value: formData.salary, onChange: (e) => handleChange('salary', e.target.value) },
    { label: 'Assigned Class ID', name: 'assignedClass', type: 'text', value: formData.assignedClass, onChange: (e) => handleChange('assignedClass', e.target.value) },
  ];

  const handleComponentSwitch = (component) => {
    setActiveComponent(component); // Switch between ClassAnalytics and TeacherAnalytics
  };

  const validateForm = (fields) => {
    let valid = true;
    const newErrors = {};
  
    fields.forEach((field) => {
      const value = field.name === 'email' || field.name === 'phone'
        ? formData.contactDetails[field.name] // For email/phone, check contactDetails
        : formData[field.name]; // For other fields, check directly in formData
  
      // Validate email and phone separately for format
      if (field.name === 'email' || field.name === 'phone') {
        if (!value) {
          valid = false;
          newErrors[field.name] = `${field.label} is required.`;
        } else {
          // Email format validation
          if (field.name === 'email' && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
            valid = false;
            newErrors[field.name] = 'Please enter a valid email.';
          }
          // Phone number format validation (basic check)
          if (field.name === 'phone' && !/^\d{10}$/.test(value)) {
            valid = false;
            newErrors[field.name] = 'Please enter a valid phone number.';
          }
        }
      } else {
        // For non-email/phone fields, validate if the value is required
        if (value === undefined || value === null || value === '') {
          valid = false;
          newErrors[field.name] = `${field.label} is required.`;
        }
      }
    });
  
    return { valid, errors: newErrors };
  };
  

  
  const fetchData = async (type) => {
    console.log('Type:', type);
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/${type}`);
      setDataList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanData = (data, formType) => {
    if (formType === 'class') {
      return {
        className: data.className,
        year: data.year,
        teacher: data.teacher, // ID of the teacher assigned
        teacherName: data.teacherName,
        studentFees: data.studentFees,
        maxStudents: data.maxStudents,
        students: data.students || [], // Array of student IDs
      };
    }
  
    // If it's not a class form, handle other form types (teacher/student)
    return {
      studentName: data.studentName || '',
      class: data.class || data.class || '',
      dob: data.dob || null,
      email: data.contactDetails?.email || '',
      phone: data.contactDetails?.phone || '',
      gender: data.gender || '',
      feesPaid: data.feesPaid || false,
      contactDetails: {
        email: data.contactDetails?.email || '',
        phone: data.contactDetails?.phone || '',
      },
      teacherName: data.teacherName || '',
      salary: data.salary || '',
      assignedClass:  String(data.assignedClass || ''), 
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure formType is selected
    if (!formType) {
      console.error("Form type is not selected");
      setFormError("Form type is not selected"); 
      return;
    }

    setFormError("");
    setErrors({}); 

    let fieldsToValidate = formType === 'class' ? classFields : formType === 'teacher' ? teacherFields : studentFields;
    const { valid, errors } = validateForm(fieldsToValidate);

    if (!valid) {
      setErrors(errors);  // Set the validation errors in state
      return;
    }
  
    // Clean data based on the form type
    const cleanedData = cleanData(formData, formType);
    console.log("Cleaned Data:", cleanedData);  // Log cleaned data for debugging

    // Skip email and phone validation if formType is 'class'
    if (formType !== 'class') {
      if (!cleanedData.contactDetails.email || !cleanedData.contactDetails.phone) {
        console.error('Both email and phone are required in contactDetails');
        return;
      }
    }
  
   
  
    try {
      let apiUrl;
      let method = 'post'; // Default to POST for create
  
      if (editingItemId) {
        // If editing an existing item, update the URL and method
        apiUrl = `${backendUrl}/${formType}/${editingItemId}`; // Use editingItemId for update
        method = 'put'; // PUT request for update
      } else {
        apiUrl = `${backendUrl}/${formType}/create`; // Default to create endpoint
      }

  
      const response = await axios({
        method: method,
        url: apiUrl,
        data: cleanedData, // Send cleaned data to the backend
      });
  
      console.log('Response from backend:', response.data); // Log backend response
      setFormData(initialFormData); // Reset form data after successful submit
      setEditingItemId(null); // Clear editing item ID
      fetchData(formType); // Fetch updated data
      setFormError(''); // Clear form error state
      setShowForm(false);
  
    } catch (error) {
      // Handle error response from the server
      if (error.response) {
        console.error('Error submitting form:', error.response.data);
        if (error.response.data.error === 'Email already exists') {
          setFormError('The email you entered already exists. Please use a different email.');
        } else {
          setFormError(error.response.data.error || 'An error occurred. Please try again later.');
        }
      } else {
        console.error('Error submitting form:', error.message);
        setFormError('Network error. Please check your internet connection.');
      }
    }
  };
  
  
  const handleEdit = (item) => {
    setShowForm(true);
    console.log('Editing item:', item);
  
    const isClass = item.class;
  
    const formData = {
      className: isClass ? item.class || '' : '',
      year: isClass ? item.year || '' : '',
      teacher: isClass ? item.teacher || '' : '',
      studentFees: isClass ? item.studentFees || '' : '',
      maxStudents: isClass ? item.maxStudents || '' : '',
      students: isClass ? item.students || [] : [],
      studentName: !isClass ? item.studentName || '' : '',
      gender: !isClass ? item.gender || '' : '',
      dob: !isClass ? (item.dob ? item.dob.slice(0, 10) : '') : '',
      contactDetails: !isClass
        ? {
            email: item.contactDetails?.email || '',
            phone: item.contactDetails?.phone || '',
          }
        : {},
      feesPaid: !isClass ? item.feesPaid || true : true,
      class: !isClass ? item.class || '' : '',
      teacherName: !isClass ? item.teacherName || '' : '',
      salary: !isClass ? item.salary || '' : '',
      assignedClass: !isClass ? item.assignedClass || '' : '',
    };
  
    console.log("Form Data to be set: ", formData); // Check form data
  
    setFormData(formData);
    setEditingItemId(item._id);
  };
  
  
  
  const handleDelete = async (itemId) => {
    console.log("Deleting student with ID:", itemId);
    if (!formType) return;
    try {
      await axios.delete(`${backendUrl}/${formType}/${itemId}`);
      fetchData(formType);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  useEffect(() => {
    if (editingItemId) {
      const fetchEditData = async () => {
        try {
          const response = await axios.get(`${backendUrl}/${formType}/${editingItemId}`);
          setFormData(response.data); // Make sure the data includes all necessary fields
        } catch (error) {
          console.error('Error fetching data for edit:', error);
        }
      };
      fetchEditData();
    }
  }, [editingItemId, formType]);

  const handleCreate = () => {
    setShowForm(true); // Show the form when create button is clicked
  };

  const handleClose = () => {
    setShowForm(false); // Close the form when close button is clicked
  };

  useEffect(() => {
    if (formType) {
      fetchData(formType);// Fetch data on page load based on formType
    } 
  }, [formType]);

  const handleIconClick = (type) => {
    setFormType(type); // Change formType to the selected type
  };


  const handleClassClick = () => {
    handleComponentSwitch('classAnalytics'); // Switch to ClassAnalytics when class icon is clicked
    fetchData('class'); 
  };

  const handleTeacherClick = () => {
    handleComponentSwitch('teacherAnalytics'); // Switch to TeacherAnalytics when teacher icon is clicked
    fetchData('teacher');
  };

  const handleCloseClassAnalytics = () => {
    setActiveComponent(null); // Set to null or any other default to hide ClassAnalytics
  };

  // Function to handle closing the TeacherAnalytics component
  const handleCloseTeacherAnalytics = () => {
    setActiveComponent(null); // Set to null or any other default to hide TeacherAnalytics
  };

  // Function to render the active component based on the state
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'classAnalytics':
        return <ClassAnalytics handleClose={handleCloseClassAnalytics} />; // Pass handleClose to ClassAnalytics
      case 'teacherAnalytics':
        return <TeacherAnalytics handleClose={handleCloseTeacherAnalytics} />; // Pass handleClose to TeacherAnalytics
      default:
        return <Table data={dataList} />; // Render the table if no active component
    }
  };

  const handleFormTypeChange = (type) => {
    setFormType(type); // Set formType based on the selection
    setActiveComponent(null); // Reset the active component when changing form type
  };

 

  return (
    <div className="relative min-h-screen">
      {/* Greyed-out background when a component is active */}
      {activeComponent && (
        <div className="absolute inset-0 bg-gray-500 opacity-50 backdrop-blur-sm z-10"></div> 
      )}
  
      <div className="p-6 relative z-20"> {/* This ensures the content (header, selector, buttons) is above the greyed-out background */}
        
  
        <div className="max-w-4xl mx-auto p-6">
        <h1 class="text-4xl md:text-5xl font-bold text-center text-gray-800 mt-12 mb-8 leading-tight">
            School Management Application
        </h1>

          {/* Form Type Selector */}
          <div className="mb-6">
            <label className="block text-xl font-medium text-gray-700 mb-2">Select Form Type:</label>
            <select 
             onChange={(e) => handleFormTypeChange(e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-md ${activeComponent ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={activeComponent} // Disable when a component is active
            >
              <option >Select</option>
              <option value="class">Class</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            {formError && (
                <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                  {formError}
                </div>
            )}

           
          </div>
  
          {/* Icons Section */}
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveComponent('classAnalytics')}
                className={`bg-blue-500 text-white p-6 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ${activeComponent ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeComponent} // Disable when a component is active
              >
                <i className="fas fa-chalkboard-teacher text-3xl"></i>
              </button>
              <p className={`mt-2 text-lg ${activeComponent ? 'opacity-50' : ''}`}>Class</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleIconClick('student')}
                className={`bg-green-500 text-white p-6 rounded-full shadow-lg hover:bg-green-600 transition duration-300 ${activeComponent ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeComponent} // Disable when a component is active
              >
                <i className="fas fa-user-graduate text-3xl"></i>
              </button>
              <p className={`mt-2 text-lg ${activeComponent ? 'opacity-50' : ''}`}>Student</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveComponent('teacherAnalytics')}
                className={`bg-yellow-500 text-white p-6 rounded-full shadow-lg hover:bg-yellow-600 transition duration-300 ${activeComponent ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeComponent} // Disable when a component is active
              >
                <i className="fas fa-user-tie text-3xl"></i>
              </button>
              <p className={`mt-2 text-lg ${activeComponent ? 'opacity-50' : ''}`}>Teacher</p>
            </div>
          </div>
  
          {/* Create Button */}
          <div className="mt-8 flex justify-center">
            <button
              className={`bg-indigo-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300 ${activeComponent ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleCreate}
              disabled={activeComponent} // Disable when a component is active
            >
              Create {formType ? formType.charAt(0).toUpperCase() + formType.slice(1) : ''}
            </button>
          </div>
        </div>
  
        {/* Component Section */}
        <div className="mt-8 bg-white p-6 shadow-lg rounded-lg relative z-00">
          {renderActiveComponent()} {/* Render the active component */}
        </div>
  
        {activeComponent === null && showForm && (
          <div className="mt-8 bg-white p-6 shadow-lg rounded-lg relative z-30">
            <button
              onClick={handleClose}
              className="text-red-500 hover:text-red-700 font-semibold mb-4"
            >
              Close
            </button>
  
            <Form
              formFields={formType === 'class' ? classFields : formType === 'teacher' ? teacherFields : studentFields}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              errors={errors}
            />
            {formError && <div style={{ color: 'red' }}>{formError}</div>}
          </div>
        )}
  
        <Table
          loading={loading}
          formType={formType}
          dataList={dataList}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
  
}  

export default Dashboard;
