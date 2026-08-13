const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ============ USER ============
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

// ============ STUDENT ============
const studentSchema = new Schema({
  name: { type: String, required: true },
  studentCode: { type: String, unique: true },
  classId: { type: String, required: true },
  email: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
const Student = mongoose.model('Student', studentSchema);

// ============ TEACHER ============
const teacherSchema = new Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  assignedClass: { type: String, required: true },
  email: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
const Teacher = mongoose.model('Teacher', teacherSchema);

// ============ ATTENDANCE ============
const attendanceSchema = new Schema({
  studentId: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
  classId: { type: String },
  markedBy: { type: String },
}, { timestamps: true });
const Attendance = mongoose.model('Attendance', attendanceSchema);

// ============ HOMEWORK ============
const homeworkSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  classId: { type: String, required: true },
  date: { type: String, required: true },
  createdBy: { type: String },
}, { timestamps: true });
const Homework = mongoose.model('Homework', homeworkSchema);

// ============ FEE ============
const feeSchema = new Schema({
  studentId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
  date: { type: String, required: true },
}, { timestamps: true });
const Fee = mongoose.model('Fee', feeSchema);

// ============ NOTICE ============
const noticeSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  classId: { type: String, default: 'all' },
  createdBy: { type: String },
}, { timestamps: true });
const Notice = mongoose.model('Notice', noticeSchema);

module.exports = { User, Student, Teacher, Attendance, Homework, Fee, Notice };
