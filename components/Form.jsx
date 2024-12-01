import React from 'react';

const inputClassName = (error) =>
  `w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded`;

const Form = ({ formFields = [], errors = {}, handleSubmit, editingItemId = '' }) => {
  return (
    <div className="form-container">
      <h2 className="text-xl mb-4">
        {editingItemId ? 'Edit Item' : 'Create New Item'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map((field, index) => {
          const error = errors[field.name]; // Accessing the specific field's error

          console.log(field.options); 
          
          return (
            <div key={index} className="field-group">
              <label htmlFor={field.name} className="block font-semibold">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  className={inputClassName(error)}
                >
                  <option value="">Select {field.label}</option>
                  {console.log(field.options)} 
                  {field.options && field.options.length > 0 ? (
                    field.options.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))
                  ) : (
                    <option value="">No options available</option>
                  )}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  id={field.name}                     
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) =>
                    field.onChange({ target: { name: field.name, checked: e.target.checked } })
                  }
                  className={inputClassName(error)}
                />
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  value={field.value}
                  onChange={field.onChange}
                  className={inputClassName(error)}
                />
              )}
              {error && <span className="text-red-500 text-sm">{error}</span>}
            </div>
          );
        })}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md mt-4"
        >
          {editingItemId ? 'Update' : 'Save'}
        </button>
      </form>
    </div>
  );
}; 

export default Form;
