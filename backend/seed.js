const crypto = require('crypto');
const { User, Student, Teacher, Attendance, Homework, Fee, Notice } = require('./models');

function hashPassword(pass) {
  return crypto.createHash('sha256').update(pass).digest('hex');
}

async function seedDatabase() {
  // Check if already seeded
  const adminExists = await User.findOne({ email: 'admin@school.com' });
  if (adminExists) {
    console.log('✅ Database already seeded — skipping.');
    return;
  }

  console.log('🌱 Seeding database with initial data...');

  // --- Users ---
  const adminUser = await User.create({
    name: 'Admin', email: 'admin@school.com',
    password: hashPassword('Admin@123'), role: 'admin'
  });
  const teacherUser = await User.create({
    name: 'Rahul Sharma', email: 'teacher@school.com',
    password: hashPassword('Teacher@123'), role: 'teacher'
  });
  const studentUser = await User.create({
    name: 'Krish Kumar Sah', email: 'student@school.com',
    password: hashPassword('Student@123'), role: 'student'
  });

  // --- Teacher ---
  await Teacher.create({
    name: 'Rahul Sharma', subject: 'Mathematics',
    assignedClass: 'Class-10A', email: 'teacher@school.com',
    userId: teacherUser._id
  });

  // --- Students ---
  const studentNames = [
    'Krish Kumar Sah', 'Amit Verma', 'Priya Singh', 'Sneha Patel',
    'Rohit Gupta', 'Anjali Yadav', 'Vikram Joshi', 'Neha Kumari',
    'Arjun Reddy', 'Pooja Mehta'
  ];

  const students = [];
  for (let i = 0; i < studentNames.length; i++) {
    const s = await Student.create({
      name: studentNames[i],
      studentCode: `S.${3180 + i}`,
      classId: 'Class-10A',
      email: i === 0 ? 'student@school.com' : `student${i}@school.com`,
      userId: i === 0 ? studentUser._id : undefined
    });
    students.push(s);
  }

  // --- Attendance (last 30 days for all students) ---
  const today = new Date();
  for (const s of students) {
    for (let d = 1; d <= 30; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      await Attendance.create({
        studentId: s._id.toString(),
        date: date.toISOString().split('T')[0],
        status: Math.random() > 0.15 ? 'present' : 'absent',
        classId: 'Class-10A',
        markedBy: teacherUser._id.toString()
      });
    }
  }

  // --- Homework ---
  const hwData = [
    { title: 'Algebra Practice Set 5', description: 'Solve exercises 5.1 to 5.4 from NCERT Mathematics textbook. Show all working steps.', classId: 'Class-10A', date: getFutureDate(3) },
    { title: 'Trigonometry Worksheet', description: 'Complete the trigonometry worksheet distributed in class. Include diagrams for all proofs.', classId: 'Class-10A', date: getFutureDate(5) },
    { title: 'Statistics Project', description: 'Collect data on heights of 20 classmates and calculate mean, median, mode. Present as a chart.', classId: 'Class-10A', date: getFutureDate(7) },
    { title: 'Previous Year Questions', description: 'Solve Chapter 3 previous year board exam questions (2020-2025).', classId: 'Class-10A', date: getPastDate(2) },
  ];
  for (const hw of hwData) {
    await Homework.create({ ...hw, createdBy: teacherUser._id.toString() });
  }

  // --- Fees ---
  for (const s of students) {
    await Fee.create({ studentId: s._id.toString(), amount: 15000, status: 'paid', date: '2026-04-01' });
    await Fee.create({ studentId: s._id.toString(), amount: 15000, status: 'paid', date: '2026-05-01' });
    await Fee.create({ studentId: s._id.toString(), amount: 15000, status: Math.random() > 0.3 ? 'paid' : 'pending', date: '2026-06-01' });
    await Fee.create({ studentId: s._id.toString(), amount: 15000, status: 'pending', date: '2026-07-01' });
  }

  // --- Notices ---
  const noticeData = [
    { title: 'Annual Day Celebration', message: 'Annual Day function will be held on 25th July 2026. All students must participate in at least one activity. Practice sessions start from Monday.', classId: 'all' },
    { title: 'Summer Vacation Homework', message: 'Summer vacation homework sheets have been uploaded. Please complete all assignments before the school reopens.', classId: 'all' },
    { title: 'Math Olympiad Registration', message: 'Students interested in Math Olympiad 2026 should register with their class teacher by 20th July.', classId: 'Class-10A' },
    { title: 'Parent-Teacher Meeting', message: 'PTM scheduled for 28th July 2026 from 10 AM to 1 PM. All parents are requested to attend.', classId: 'all' },
    { title: 'Sports Day Trials', message: 'Sports day trials for track and field events will be conducted on 22nd July. Report to the ground by 8 AM.', classId: 'Class-10A' },
  ];
  for (const n of noticeData) {
    await Notice.create({ ...n, createdBy: adminUser._id.toString() });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`   → ${studentNames.length} students`);
  console.log(`   → 1 teacher`);
  console.log(`   → ${hwData.length} homework assignments`);
  console.log(`   → ${students.length * 4} fee records`);
  console.log(`   → ${noticeData.length} notices`);
  console.log(`   → ~${students.length * 22} attendance records`);
}

function getFutureDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

module.exports = seedDatabase;
