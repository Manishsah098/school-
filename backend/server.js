const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const seedDatabase = require('./seed');
const { User, Student, Teacher, Attendance, Homework, Fee, Notice } = require('./models');

const app = express();
const PORT = 8080;
const JWT_SECRET = 'smartSchoolPortal2026SecretKey';

// Helper to hash passwords using built-in crypto
function hashPassword(pass) {
  return crypto.createHash('sha256').update(pass).digest('hex');
}

// ======================== MIDDLEWARE ========================
app.use(cors());
app.use(express.json());

// JWT Auth Middleware
function authMiddleware(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// ======================== AUTH ROUTES ========================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const hashedInput = hashPassword(password);
    if (hashedInput !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET, { expiresIn: '24h' }
    );

    res.json({ token, id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already exists' });

    const hashed = hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role: role || 'student' });

    res.json({ message: 'User registered', id: user._id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ======================== ADMIN ROUTES ========================
app.get('/api/admin/stats', authMiddleware(['admin']), async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalFeesPaid = await Fee.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalFeesPending = await Fee.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalStudents,
      totalTeachers,
      feesPaid: totalFeesPaid[0]?.total || 0,
      feesPending: totalFeesPending[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Students CRUD
app.get('/api/admin/students', authMiddleware(['admin']), async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.json(students);
});

app.post('/api/admin/students', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, classId, email } = req.body;
    const code = 'S.' + (3180 + await Student.countDocuments());
    const student = await Student.create({ name, classId, email, studentCode: code });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student' });
  }
});

app.delete('/api/admin/students/:id', authMiddleware(['admin']), async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: 'Student deleted' });
});

// Teachers CRUD
app.get('/api/admin/teachers', authMiddleware(['admin']), async (req, res) => {
  const teachers = await Teacher.find().sort({ createdAt: -1 });
  res.json(teachers);
});

app.post('/api/admin/teachers', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, subject, assignedClass, email } = req.body;
    const teacher = await Teacher.create({ name, subject, assignedClass, email });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add teacher' });
  }
});

app.delete('/api/admin/teachers/:id', authMiddleware(['admin']), async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id);
  res.json({ message: 'Teacher deleted' });
});

// Fees
app.get('/api/admin/fees', authMiddleware(['admin']), async (req, res) => {
  const fees = await Fee.find().sort({ date: -1 });
  // Attach student names
  const students = await Student.find();
  const studentMap = {};
  students.forEach(s => { studentMap[s._id.toString()] = s.name; });

  const enriched = fees.map(f => ({
    id: f._id, studentId: f.studentId, studentName: studentMap[f.studentId] || 'Unknown',
    amount: f.amount, status: f.status, date: f.date
  }));
  res.json(enriched);
});

app.patch('/api/admin/fees/:id/pay', authMiddleware(['admin']), async (req, res) => {
  await Fee.findByIdAndUpdate(req.params.id, { status: 'paid' });
  res.json({ message: 'Fee marked as paid' });
});

// Notices
app.get('/api/admin/notices', authMiddleware(['admin']), async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  const result = notices.map(n => ({
    id: n._id, title: n.title, message: n.message,
    classId: n.classId, createdAt: n.createdAt.toISOString().split('T')[0]
  }));
  res.json(result);
});

app.post('/api/admin/notices', authMiddleware(['admin']), async (req, res) => {
  try {
    const { title, message, classId } = req.body;
    const notice = await Notice.create({
      title, message, classId: classId || 'all', createdBy: req.user.id
    });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

// ======================== TEACHER ROUTES ========================
app.get('/api/teacher/profile', authMiddleware(['teacher']), async (req, res) => {
  const teacher = await Teacher.findOne({ userId: req.user.id });
  if (!teacher) return res.status(404).json({ error: 'Teacher profile not found' });
  res.json(teacher);
});

app.get('/api/teacher/students', authMiddleware(['teacher']), async (req, res) => {
  const teacher = await Teacher.findOne({ userId: req.user.id });
  if (!teacher) return res.json([]);
  const students = await Student.find({ classId: teacher.assignedClass });
  res.json(students);
});

app.post('/api/teacher/attendance', authMiddleware(['teacher']), async (req, res) => {
  try {
    const { date, records } = req.body; // records: [{ studentId, status }]
    const teacher = await Teacher.findOne({ userId: req.user.id });

    for (const rec of records) {
      // Upsert: update if exists for that date+student, else create
      await Attendance.findOneAndUpdate(
        { studentId: rec.studentId, date },
        { status: rec.status, classId: teacher?.assignedClass, markedBy: req.user.id },
        { upsert: true, new: true }
      );
    }
    res.json({ message: `Attendance saved for ${records.length} students` });
  } catch (err) {
    console.error('Attendance error:', err);
    res.status(500).json({ error: 'Failed to save attendance' });
  }
});

app.get('/api/teacher/homework', authMiddleware(['teacher']), async (req, res) => {
  const hw = await Homework.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  const result = hw.map(h => ({
    id: h._id, title: h.title, description: h.description,
    classId: h.classId, date: h.date
  }));
  res.json(result);
});

app.post('/api/teacher/homework', authMiddleware(['teacher']), async (req, res) => {
  try {
    const { title, description, classId, date } = req.body;
    const hw = await Homework.create({
      title, description, classId, date, createdBy: req.user.id
    });
    res.json(hw);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload homework' });
  }
});

app.get('/api/teacher/notices', authMiddleware(['teacher']), async (req, res) => {
  const teacher = await Teacher.findOne({ userId: req.user.id });
  const notices = await Notice.find({
    $or: [{ classId: teacher?.assignedClass }, { classId: 'all' }]
  }).sort({ createdAt: -1 });
  const result = notices.map(n => ({
    id: n._id, title: n.title, message: n.message,
    classId: n.classId, createdAt: n.createdAt.toISOString().split('T')[0]
  }));
  res.json(result);
});

app.post('/api/teacher/notices', authMiddleware(['teacher']), async (req, res) => {
  try {
    const { title, message } = req.body;
    const teacher = await Teacher.findOne({ userId: req.user.id });
    const notice = await Notice.create({
      title, message, classId: teacher?.assignedClass || 'all', createdBy: req.user.id
    });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post notice' });
  }
});

// ======================== STUDENT ROUTES ========================
app.get('/api/student/profile', authMiddleware(['student']), async (req, res) => {
  const student = await Student.findOne({ userId: req.user.id });
  if (!student) return res.status(404).json({ error: 'Student profile not found' });
  res.json(student);
});

app.get('/api/student/attendance', authMiddleware(['student']), async (req, res) => {
  const student = await Student.findOne({ userId: req.user.id });
  if (!student) return res.json({ presentCount: 0, totalDays: 0, percentage: 0, logs: [] });

  const logs = await Attendance.find({ studentId: student._id.toString() }).sort({ date: 1 });
  const totalDays = logs.length;
  const presentCount = logs.filter(l => l.status === 'present').length;
  const percentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 100;

  res.json({
    presentCount, totalDays, percentage: Math.round(percentage * 10) / 10,
    logs: logs.map(l => ({ id: l._id, date: l.date, status: l.status }))
  });
});

app.get('/api/student/homework', authMiddleware(['student']), async (req, res) => {
  const student = await Student.findOne({ userId: req.user.id });
  if (!student) return res.json([]);

  const hw = await Homework.find({ classId: student.classId }).sort({ date: -1 });
  const result = hw.map(h => ({
    id: h._id, title: h.title, description: h.description,
    classId: h.classId, date: h.date
  }));
  res.json(result);
});

app.get('/api/student/notices', authMiddleware(['student']), async (req, res) => {
  const student = await Student.findOne({ userId: req.user.id });
  const classId = student?.classId || '';

  const notices = await Notice.find({
    $or: [{ classId }, { classId: 'all' }]
  }).sort({ createdAt: -1 });

  const result = notices.map(n => ({
    id: n._id, title: n.title, message: n.message,
    classId: n.classId, createdAt: n.createdAt.toISOString().split('T')[0]
  }));
  res.json(result);
});

app.get('/api/student/fees', authMiddleware(['student']), async (req, res) => {
  const student = await Student.findOne({ userId: req.user.id });
  if (!student) return res.json([]);

  const fees = await Fee.find({ studentId: student._id.toString() }).sort({ date: -1 });
  const result = fees.map(f => ({
    id: f._id, amount: f.amount, status: f.status, date: f.date
  }));
  res.json(result);
});

// ======================== START SERVER ========================
async function start() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/school_portal');
    console.log('✅ MongoDB connected');

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`\n🚀 Smart School Portal API running at http://localhost:${PORT}`);
      console.log('📡 Ready for frontend connections\n');
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    console.error('\n💡 Make sure MongoDB is running on mongodb://127.0.0.1:27017');
    process.exit(1);
  }
}

start();
