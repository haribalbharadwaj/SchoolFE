import React, { useState } from 'react';

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Table = ({ loading, formType, dataList, handleEdit, handleDelete }) => {
  const [filterClass, setFilterClass] = useState(''); // State for filtering by class (for students)
  const [sortOrder, setSortOrder] = useState({ field: '', direction: '' }); // State for sorting
  const [showModal, setShowModal] = useState(false); // State to show/hide modal
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Filtered and sorted data based on filterClass and sortOrder
  const filteredData = (dataList|| [])
    .filter((item) => {
      // Apply filtering for 'student' formType
      if (formType === 'student' && filterClass) {
        return item.class === filterClass;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder.field === 'name') {
        return sortOrder.direction === 'asc'
          ? a.studentName.localeCompare(b.studentName)
          : b.studentName.localeCompare(a.studentName);
      }
      if (sortOrder.field === 'created') {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

  // Function to handle sorting
  const handleSort = (field) => {
    setSortOrder((prevSortOrder) => {
      if (prevSortOrder.field === field) {
        return {
          field,
          direction: prevSortOrder.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { field, direction: 'asc' };
    });
  };

  const openDeleteModal = (id) => {
    setDeleteItemId(id);
    setShowModal(true);
  };

  // Confirm delete action and close modal
  const confirmDelete = () => {
    handleDelete(deleteItemId); // Execute the handleDelete function with the stored ID
    setShowModal(false); // Close the modal
  };

  // Cancel delete action and close modal
  const cancelDelete = () => {
    setDeleteItemId(null); // Clear the item ID
    setShowModal(false); // Close the modal
  };


  // Function to render table based on formType
  const renderTable = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (formType === 'student') {
      return (
        <>
          {/* Class Filter */}
          <div className="mb-4">
            <label htmlFor="filterClass" className="mr-2">Filter by Class:</label>
            <select
              id="filterClass"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="border border-gray-300 px-2 py-1"
            >
              <option value="">All</option>
              {Array.from(new Set(dataList.map(item => item.class))) // Create unique class options
                .map(classOption => (
                  <option key={classOption} value={classOption}>
                    Class {classOption}
                  </option>
              ))}
            </select>
          </div>

          {/* Sorting Options */}
          <div className="mb-4">
            <label className="mr-2">Sort by:</label>
            <button onClick={() => handleSort('name')} className="mr-2">
              Name {sortOrder.field === 'name' && (sortOrder.direction === 'asc' ? '↑' : '↓')}
            </button>
            <button onClick={() => handleSort('created')} className="mr-2">
              Created {sortOrder.field === 'created' && (sortOrder.direction === 'asc' ? '↑' : '↓')}
            </button>
          </div>

          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border px-4 py-2">Student Name</th>
                <th className="border px-4 py-2">Class</th>
                <th className="border px-4 py-2">Gender</th>
                <th className="border px-4 py-2">Date of Birth</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Fees Paid</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.studentName}</td>
                  <td className="border px-4 py-2">{item.class}</td>
                  <td className="border px-4 py-2">{item.gender}</td>
                  <td className="border px-4 py-2">{formatDate(item.dob)}</td>
                  <td className="border px-4 py-2">{item.contactDetails?.email}</td>
                  <td className="border px-4 py-2">{item.contactDetails?.phone}</td>
                  <td className="border px-4 py-2">{item.feesPaid ? 'Yes' : 'No'}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-500">Edit</button>
                    <button onClick={() => openDeleteModal(item._id)} className="text-red-500 ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    }

    if (formType === 'class') {
      return (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">Class Name</th>
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Teacher</th>
              <th className="border px-4 py-2">Student Fees</th>
              <th className="border px-4 py-2">Max Students</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.className}</td>
                <td className="border px-4 py-2">{item.year}</td>
                <td className="border px-4 py-2">{item.teacher}</td>
                <td className="border px-4 py-2">{item.studentFees}</td>
                <td className="border px-4 py-2">{item.maxStudents}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-500">Edit</button>
                  <button onClick={() => openDeleteModal(item._id)} className="text-red-500 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (formType === 'teacher') {
      return (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">Teacher Name</th>
              <th className="border px-4 py-2">Gender</th>
              <th className="border px-4 py-2">Date of Birth</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Salary</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.teacherName}</td>
                <td className="border px-4 py-2">{item.gender}</td>
                <td className="border px-4 py-2">{formatDate(item.dob)}</td>
                <td className="border px-4 py-2">{item.contactDetails?.email}</td>
                <td className="border px-4 py-2">{item.contactDetails?.phone}</td>
                <td className="border px-4 py-2">{item.salary}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-500">Edit</button>
                  <button onClick={() => openDeleteModal(item._id)} className="text-red-500 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return <div></div>;
  };

  return (
    <div>
      {renderTable()}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this item?</h2>
            <div className="flex justify-end">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;