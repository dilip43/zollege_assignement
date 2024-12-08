import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './PayoutCalculator.css';
import { gapi } from 'gapi-script';

const PayoutCalculator = ({ articles }) => {
  const [payoutRates, setPayoutRates] = useState(() => {
    const savedRates = localStorage.getItem('payoutRates');
    return savedRates ? JSON.parse(savedRates) : {};
  });

  const [defaultPayout, setDefaultPayout] = useState(() => {
    const savedDefault = localStorage.getItem('defaultPayout');
    return savedDefault ? parseFloat(savedDefault) : 10;
  });

  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);

    // Load the Google API client on component mount
    const clientId = '256744844728-hfsjfat7q9r0b3hcmkjcegajugqakcul.apps.googleusercontent.com'; // Replace with your Google client ID
    gapi.load('client:auth2', () => {
      gapi.auth2.init({ client_id: clientId });
    });
  }, [darkMode]);

  const calculateTotalPayout = () => {
    return articles.reduce((sum, article) => {
      const payout = payoutRates[article.title] || defaultPayout;
      return sum + payout;
    }, 0);
  };

  const [totalPayout, setTotalPayout] = useState(calculateTotalPayout());

  useEffect(() => {
    setTotalPayout(calculateTotalPayout());
    localStorage.setItem('payoutRates', JSON.stringify(payoutRates));
    localStorage.setItem('defaultPayout', defaultPayout);
  }, [payoutRates, defaultPayout, articles]);

  const handleRateChange = (articleTitle, value) => {
    setPayoutRates((prevRates) => ({
      ...prevRates,
      [articleTitle]: parseFloat(value) || 0,
    }));
  };

  const handleDefaultPayoutChange = (value) => {
    setDefaultPayout(parseFloat(value) || 0);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text('Payout Report', 14, 10);
      autoTable(doc, {
        head: [['Article Title', 'Author', 'Date', 'Payout']],
        body: articles.map((article) => [
          article.title,
          article.author || 'Unknown',
          new Date(article.publishedAt).toLocaleDateString(),
          (payoutRates[article.title] || defaultPayout).toFixed(2),
        ]),
      });
      doc.text(`Total Payout: $${totalPayout.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
      doc.save('payout_report.pdf');
    } catch (error) {
      alert('Failed to export to PDF. Please try again.');
      console.error('PDF Export Error:', error);
    }
  };

  const exportToCSV = () => {
    try {
      const csvData = [
        ['Article Title', 'Author', 'Date', 'Payout'],
        ...articles.map((article) => [
          article.title,
          article.author || 'Unknown',
          new Date(article.publishedAt).toISOString().split('T')[0],
          (payoutRates[article.title] || defaultPayout).toFixed(2),
        ]),
        ['Total Payout', '', '', totalPayout.toFixed(2)],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(csvData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Payout Report');
      XLSX.writeFile(workbook, 'payout_report.csv');
    } catch (error) {
      alert('Failed to export to CSV. Please try again.');
      console.error('CSV Export Error:', error);
    }
  };

  const exportToGoogleSheets = () => {
    const auth2 = gapi.auth2.getAuthInstance();

    auth2.signIn().then(() => {
      const params = {
        spreadsheetId: '1KncW3W60KdbryhDq0L82qxqd9-V8hjX812_u52AjnUk',
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
      };

      const valueRangeBody = {
        majorDimension: 'ROWS',
        values: [
          ['Article Title', 'Author', 'Date', 'Payout'],
          ...articles.map((article) => [
            article.title,
            article.author || 'Unknown',
            new Date(article.publishedAt).toISOString().split('T')[0],
            (payoutRates[article.title] || defaultPayout).toFixed(2),
          ]),
          ['Total Payout', '', '', totalPayout.toFixed(2)],
        ],
      };

      gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody).then(
        (response) => {
          alert('Data successfully exported to Google Sheets!');
        },
        (error) => {
          console.error('Error exporting data to Google Sheets:', error);
          alert('Failed to export to Google Sheets. Please try again.');
        }
      );
    });
  };

  return (
    <div className='payout-calculator-container'>
      <h3 className='section-title'>Payout Calculator</h3>
      <div className='default-payout'>
        <label>
          Default Payout Rate ($):
          <input
            type='number'
            value={defaultPayout}
            onChange={(e) => handleDefaultPayoutChange(e.target.value)}
            className='input-field'
          />
        </label>
      </div>

      {articles.length === 0 ? (
        <p className='no-articles'>No articles available to calculate payouts.</p>
      ) : (
        <>
          <div className='payout-table-container'>
            <table className='payout-table'>
              <thead>
                <tr>
                  <th>Article Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Payout Rate ($)</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.title}>
                    <td>{article.title}</td>
                    <td>{article.author || 'Unknown'}</td>
                    <td>{new Date(article.publishedAt).toLocaleDateString()}</td>
                    <td>
                      <input
                        type='number'
                        value={payoutRates[article.title] || defaultPayout}
                        onChange={(e) => handleRateChange(article.title, e.target.value)}
                        className='input-field payout-input'
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='total-payout'>
            <p>Total Articles: {articles.length}</p>
            <p>Total Payout: ${totalPayout.toFixed(2)}</p>
          </div>

          <div className='export-buttons'>
            <button onClick={exportToPDF} className='btn export-btn'>
              Export to PDF
            </button>
            <button onClick={exportToCSV} className='btn export-btn'>
              Export to CSV
            </button>
            <button onClick={exportToGoogleSheets} className='btn export-btn'>
              Export to Google Sheets
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PayoutCalculator;
