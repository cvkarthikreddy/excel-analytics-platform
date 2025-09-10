import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
    LineElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js/dist/plotly-basic.min.js'; // <-- THIS IS THE CORRECTED LINE
import jsPDF from 'jspdf';
import { Download, FileText, Maximize2, Minimize2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const AnalysisPage = () => {
    const { currentFile } = useSelector((state) => state.files);
    const [is3D, setIs3D] = useState(false);
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const [zAxis, setZAxis] = useState('');

    const { labels, numericHeaders, chartData } = useMemo(() => {
        if (!currentFile || !currentFile.rows) return { labels: [], numericHeaders: [], chartData: {} };
        const labelHeader = currentFile.headers[0];
        const labels = currentFile.rows.map(row => row[labelHeader] || 'N/A');
        const numericHeaders = currentFile.headers.filter(header =>
            header !== labelHeader && currentFile.rows.some(row =>
                row[header] !== null && row[header] !== '' && !isNaN(parseFloat(row[header]))
            )
        );
        const chartData = {};
        numericHeaders.forEach(header => {
            chartData[header] = currentFile.rows.map(row => {
                const value = parseFloat(row[header]);
                return isNaN(value) ? null : value;
            });
        });
        return { labels, numericHeaders, chartData };
    }, [currentFile]);

    useEffect(() => {
        if (numericHeaders.length > 0) {
            setXAxis(numericHeaders[0]);
            setYAxis(numericHeaders.length > 1 ? numericHeaders[1] : numericHeaders[0]);
            setZAxis(numericHeaders.length > 2 ? numericHeaders[2] : numericHeaders[0]);
        }
    }, [numericHeaders]);

    if (!currentFile) return <Navigate to="/dashboard" />;

    const chartJsData = {
        labels,
        datasets: [{
            label: yAxis,
            data: chartData[yAxis] || [],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
    };

    const scatter2DData = {
        datasets: [{
            label: `${yAxis} vs ${xAxis}`,
            data: (chartData[xAxis] || []).map((xVal, index) => ({
                x: xVal,
                y: (chartData[yAxis] || [])[index]
            })),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }],
    };

    const plotly3DScatterData = [{
        x: chartData[xAxis], y: chartData[yAxis], z: chartData[zAxis],
        mode: 'markers', type: 'scatter3d',
        marker: { color: 'rgba(255, 99, 132, 0.8)', size: 5 },
    }];

    const plotly3DSurfaceData = [{
        x: chartData[xAxis], y: chartData[yAxis], z: chartData[zAxis],
        type: 'mesh3d', opacity: 0.7,
    }];

    return (
        <div className="space-y-6 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                <h1 className="text-3xl font-bold text-gray-800">
                    Analysis for: <span className="text-blue-600">{currentFile.fileInfo.originalName}</span>
                </h1>
                <Link to="/dashboard" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    {numericHeaders.length > 0 ? (
                        <>
                            <AxisSelector label="X-Axis" value={xAxis} onChange={setXAxis} headers={numericHeaders} />
                            <AxisSelector label="Y-Axis" value={yAxis} onChange={setYAxis} headers={numericHeaders} />
                            {is3D && <AxisSelector label="Z-Axis" value={zAxis} onChange={setZAxis} headers={numericHeaders} />}
                        </>
                    ) : (
                        <p className="font-semibold text-red-500">No numeric data found in this file to plot.</p>
                    )}
                </div>
                <div className="flex items-center space-x-3 bg-gray-100 p-1 rounded-full">
                    <button onClick={() => setIs3D(false)} className={`px-4 py-1 text-sm font-bold rounded-full transition-colors ${!is3D ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}>2D View</button>
                    <button onClick={() => setIs3D(true)} className={`px-4 py-1 text-sm font-bold rounded-full transition-colors ${is3D ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}>3D View</button>
                </div>
            </div>

            {numericHeaders.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {is3D ? (
                        <>
                            <ChartContainer title="3D Scatter Plot" chartId="plotly3DScatter" isPlotly>
                                <Plot data={plotly3DScatterData} layout={{ title: `${zAxis} vs ${yAxis} vs ${xAxis}`, autosize: true }} style={{ width: '100%', height: '100%' }} useResizeHandler />
                            </ChartContainer>
                            <ChartContainer title="3D Surface Plot" chartId="plotly3DSurface" isPlotly>
                                <Plot data={plotly3DSurfaceData} layout={{ title: '3D Surface Representation', autosize: true }} style={{ width: '100%', height: '100%' }} useResizeHandler />
                            </ChartContainer>
                        </>
                    ) : (
                        <>
                            <ChartContainer title="Bar Chart" chartId="barChart"><Bar data={chartJsData} options={{ maintainAspectRatio: false, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } }} /></ChartContainer>
                            <ChartContainer title="Line Chart" chartId="lineChart"><Line data={chartJsData} options={{ maintainAspectRatio: false }} /></ChartContainer>
                            <ChartContainer title="Scatter Plot" chartId="scatterChart"><Scatter data={scatter2DData} options={{ maintainAspectRatio: false }} /></ChartContainer>
                            <ChartContainer title="Pie Chart" chartId="pieChart"><Pie data={chartJsData} options={{ maintainAspectRatio: false }} /></ChartContainer>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const AxisSelector = ({ label, value, onChange, headers }) => (
    <div className="w-36">
        <label className="block text-sm font-medium text-gray-700 mr-2">{label}:</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            {headers.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
    </div>
);

const ChartContainer = ({ title, children, chartId }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const isPlotly = chartId.toLowerCase().includes('plotly');

    const handleDownloadImage = () => {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) return;

        if (isPlotly) {
            const plotDiv = chartElement.querySelector('.js-plotly-plot');
            if (plotDiv) Plotly.toImage(plotDiv, { format: 'png', width: 1200, height: 800 }).then(dataUrl => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${title.replace(/ /g, '_')}.png`;
                link.click();
            });
        } else {
            const canvas = chartElement.querySelector('canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `${title.replace(/ /g, '_')}.png`;
                link.click();
            }
        }
    };

    const handleDownloadPDF = () => {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) return;
        
        const canvas = isPlotly ? chartElement.querySelector('.js-plotly-plot .main-svg') : chartElement.querySelector('canvas');
        if (!canvas) return;
        
        const processImage = (imgData) => {
            const pdf = new jsPDF({ orientation: 'landscape' });
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
            pdf.save(`${title.replace(/ /g, '_')}.pdf`);
        };

        if(isPlotly) {
            Plotly.toImage(canvas, { format: 'png', width: 1200, height: 800 }).then(processImage);
        } else {
            processImage(canvas.toDataURL('image/png'));
        }
    };

    return (
        <>
            <div id={chartId} className={`bg-white p-4 rounded-lg shadow-md flex flex-col ${isExpanded ? 'hidden' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                    <div className="flex space-x-3 items-center">
                        <Download size={16} className="cursor-pointer text-blue-600 hover:text-blue-800" onClick={handleDownloadImage} title="Download as PNG" />
                        <FileText size={16} className="cursor-pointer text-green-600 hover:text-green-800" onClick={handleDownloadPDF} title="Download as PDF" />
                        <Maximize2 size={16} className="cursor-pointer text-gray-600 hover:text-gray-800" onClick={() => setIsExpanded(true)} title="Expand" />
                    </div>
                </div>
                <div className="relative flex-grow h-80">{children}</div>
            </div>

            {isExpanded && (
                <div className="fixed inset-0 bg-white z-50 p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
                        <Minimize2 size={24} className="cursor-pointer text-gray-600 hover:text-gray-800" onClick={() => setIsExpanded(false)} title="Minimize" />
                    </div>
                    <div className="relative flex-grow">{children}</div>
                </div>
            )}
        </>
    );
};

export default AnalysisPage;