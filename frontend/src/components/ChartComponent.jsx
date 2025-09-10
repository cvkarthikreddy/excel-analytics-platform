import React, { useRef } from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data, type }) => {
  const chartRef = useRef(null);

  const downloadChart = (format) => {
    const chart = chartRef.current;
    if (!chart) return;

    html2canvas(chart).then((canvas) => {
      if (format === 'png') {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'chart.png';
        link.click();
      } else if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('chart.pdf');
      }
    });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Chart: ${data.datasets[0].label}`,
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar options={options} data={data} />;
      case 'line':
        return <Line options={options} data={data} />;
      case 'pie':
        return <Pie options={options} data={data} />;
      case 'scatter':
        return <Scatter options={options} data={data} />;
      default:
        return <Bar options={options} data={data} />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div ref={chartRef}>{renderChart()}</div>
      <div className="mt-4 flex space-x-2">
        <button onClick={() => downloadChart('png')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Download PNG
        </button>
        <button onClick={() => downloadChart('pdf')} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ChartComponent;
