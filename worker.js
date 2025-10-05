const { parentPort, workerData } = require('worker_threads');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const fs = require('fs');
const connectDB = require('./config/db')

(async () => {
  try {
    await connectDB(); 

    const DataModel = mongoose.model('Data', new mongoose.Schema({}, { strict: false }));

    const { filePath } = workerData;
    const ext = filePath.split('.').pop().toLowerCase();
    let data = [];

    if (ext === 'csv') {
      const csvContent = fs.readFileSync(filePath, 'utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim() !== '');
      const headers = lines[0].split(',');
      for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const values = lines[i].split(',');
        headers.forEach((h, idx) => obj[h] = values[idx]);
        data.push(obj);
      }
    } else if (ext === 'xlsx') {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      throw new Error('Unsupported file type');
    }

    const result = await DataModel.insertMany(data);

    parentPort.postMessage(result.length);

    fs.unlinkSync(filePath); // delete uploaded file after inserting
  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
})();
