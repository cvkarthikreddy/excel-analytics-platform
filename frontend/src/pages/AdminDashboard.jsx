import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdminData } from '../features/admin/adminSlice';
import { setCurrentFile } from '../features/files/fileSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('files');
  
  const { stats, users, files, isLoading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminData());
  }, [dispatch]);

  const handleAdminAnalyze = (file) => {
    dispatch(setCurrentFile(file));
    navigate(`/analysis/${file._id}`);
  };

  // --- THIS FUNCTION IS UPDATED FOR DD/MM/YYYY FORMAT ---
  const formatDate = (isoDate) => {
    if (!isoDate) return 'Invalid date';

    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return <div className="text-center p-10 font-semibold">Loading Admin Data...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500 font-bold">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Total Files Uploaded" value={stats.files} />
        <StatCard title="Total Users" value={stats.users} />
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <TabButton name="files" activeTab={activeTab} setActiveTab={setActiveTab}>Files ({files.length})</TabButton>
          <TabButton name="users" activeTab={activeTab} setActiveTab={setActiveTab}>Users ({users.length})</TabButton>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'users' && (
          <Table title="Registered Users" headers={['Name', 'Email', 'Admin', 'Joined']}>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4"><AdminBadge isAdmin={user.isAdmin} /></td>
                <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </Table>
        )}

        {activeTab === 'files' && (
           <Table title="All Uploaded Files" headers={['File Name', 'Uploaded By', 'Upload Date']}>
            {files.map((file) => (
              <tr key={file._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">
                  <button onClick={() => handleAdminAnalyze(file)} className="text-blue-600 hover:underline text-left">
                    {file.fileInfo.originalName}
                  </button>
                </td>
                <td className="py-3 px-4">{file.user?.name || 'N/A'}</td>
                <td className="py-3 px-4">{formatDate(file.fileInfo.uploadDate)}</td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
};

// Helper components
const TabButton = ({ name, activeTab, setActiveTab, children }) => (
  <button
    onClick={() => setActiveTab(name)}
    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out ${
      activeTab === name
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {children}
  </button>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

const Table = ({ title, headers, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            {headers.map((header) => <th key={header} className="py-3 px-4 font-semibold uppercase text-gray-600">{header}</th>)}
          </tr>
        </thead>
        <tbody className="text-gray-600 divide-y divide-gray-200">{children}</tbody>
      </table>
    </div>
  </div>
);

const AdminBadge = ({ isAdmin }) => (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {isAdmin ? 'Yes' : 'No'}
    </span>
);

export default AdminDashboard;