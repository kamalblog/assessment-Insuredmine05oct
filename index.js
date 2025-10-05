const express = require('express');
const server = express();
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const { Worker } = require('worker_threads');
const PORT = process.env.PORT;
let conn = require('./config/db');
import policyRoutes from "./routes/policyRoutes";
import schedulerRoute from "./routes/schedulerRoute.js";


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  
  const worker = new Worker(path.join(__dirname, 'worker.js'), {
    workerData: {
      filePath: req.file.path
    }
  });

  worker.on('message', msg => res.send({ message: 'Data inserted successfully', insertedCount: msg }));

  worker.on('error', err => res.status(500).send({ error: 'Worker error', details: err.message }));

  worker.on('exit', code => {
    if (code !== 0) console.error(`Worker exited with code ${code}`);
  });
});



// Search API (Task 2)
app.get('/policy', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const data = await DataModel.find({ username: { $regex: new RegExp(username, 'i') } });

    if (data.length === 0) {
      return res.status(404).json({ message: 'No policy found for this username' });
    }

    res.status(200).json({
      total: data.length,
      policies: data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.use(express.json());

server.use('/api/policy',policyRoutes);
server.use('/api/schedulerRoute',schedulerRoute);


let startserver = async () => {
await conn();

server.listen(PORT,()=>{
    console.log('server is running on ',PORT);
})
};

startserver();



