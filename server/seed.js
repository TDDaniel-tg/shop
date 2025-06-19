const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rubolka', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected for seeding'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@rubolka.ru' });
    
    if (existingAdmin) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'Администратор',
      email: process.env.ADMIN_EMAIL || 'admin@rubolka.ru',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      isActive: true
    });
    
    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123');
    console.log('\nPlease change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin(); 