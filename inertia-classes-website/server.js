const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data.json');
const FEE_FILE = path.join(__dirname, 'fee.json');

// Helper function to read JSON file
function readJSONFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON file:', err);
    return [];
  }
}

// Helper function to write JSON file
function writeJSONFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing JSON file:', err);
  }
}

// Admission form submission
app.post('/api/admissions', (req, res) => {
  const admissions = readJSONFile(DATA_FILE);
  const namePart = req.body.name ? req.body.name.substring(0, 3).toUpperCase() : 'XXX';
  const phonePart = req.body.phone ? req.body.phone.slice(-3) : '000';
  const newAdmission = {
    id: namePart + phonePart,
    ...req.body,
    admissionDate: new Date().toISOString()
  };
  admissions.push(newAdmission);
  writeJSONFile(DATA_FILE, admissions);
  res.status(201).json({ message: 'Admission saved successfully', id: newAdmission.id });
});

// Get all admitted students
app.get('/api/students', (req, res) => {
  const admissions = readJSONFile(DATA_FILE);
  res.json(admissions);
});

// Delete student by id
app.delete('/api/students/:id', (req, res) => {
  let admissions = readJSONFile(DATA_FILE);
  const id = req.params.id;
  const initialLength = admissions.length;
  admissions = admissions.filter(student => student.id !== id);
  if (admissions.length === initialLength) {
    return res.status(404).json({ message: 'Student not found' });
  }
  writeJSONFile(DATA_FILE, admissions);
  res.json({ message: 'Student deleted successfully' });
});

// Update student by id
app.put('/api/students/:id', (req, res) => {
  let admissions = readJSONFile(DATA_FILE);
  const id = req.params.id;
  const index = admissions.findIndex(student => student.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }
  admissions[index] = { ...admissions[index], ...req.body };
  writeJSONFile(DATA_FILE, admissions);
  res.json({ message: 'Student updated successfully' });
});

// Fee details submission
app.post('/api/fees', (req, res) => {
  const fees = readJSONFile(FEE_FILE);
  const newFee = {
    id: Date.now().toString(),
    ...req.body,
    transactionDate: new Date().toISOString()
  };
  fees.push(newFee);
  writeJSONFile(FEE_FILE, fees);
  res.status(201).json({ message: 'Fee details saved successfully', id: newFee.id });
});

// Get fee details by studentId
app.get('/api/fees/:studentId', (req, res) => {
  const fees = readJSONFile(FEE_FILE);
  const studentFees = fees.filter(fee => fee.studentId === req.params.studentId);
  if (studentFees.length === 0) {
    return res.status(404).json({ message: 'No fee details found for this student' });
  }
  res.json(studentFees);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
