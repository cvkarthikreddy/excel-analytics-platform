import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadFile, deleteFile, setCurrentFile, fetchFilesHistory } from '../features/files/fileSlice'; 

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allFiles, loading, error } = useSelector((state) => state.files); 
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchFilesHistory());
  }, [dispatch]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    dispatch(uploadFile(formData))
      .unwrap()
      .then((uploadResult) => {
        navigate(`/analysis/${uploadResult.fileInfo._id}`);
      })
      .catch((err) => {
        console.error("Upload failed:", err);
      });
  };
  
  const handleDelete = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
        dispatch(deleteFile(fileId))
          .unwrap()
          .then(() => console.log('File deleted successfully'))
          .catch((err) => alert(`Could not delete file: ${err}`));
    }
  };
  
  const handleAnalyze = (file) => {
    dispatch(setCurrentFile(file));
    navigate(`/analysis/${file.fileInfo._id}`);
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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Upload a New Excel File</h2>
        <div className="flex items-center space-x-4">
            <input 
                type="file" 
                onChange={handleFileChange} 
                accept=".xlsx, .xls" 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button 
                onClick={handleUpload} 
                disabled={loading || !selectedFile} 
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Uploading...' : 'Upload & Analyze'}
            </button>
        </div>
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">My Upload History</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {(allFiles && allFiles.length > 0) ? (
            <div className="divide-y divide-gray-200">
              {allFiles.map((file) => (
                <div key={file.fileInfo._id} className="py-4 flex justify-between items-center">
                  <div 
                    className="cursor-pointer group"
                    onClick={() => handleAnalyze(file)}
                  >
                    <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{file.fileInfo.originalName}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded on: {formatDate(file.fileInfo.uploadDate)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(file.fileInfo._id); }} 
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't uploaded any files yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;