import bcrypt from 'bcrypt';
import { query } from './src/db.js';

async function fixAdminPassword() {
  try {
    // Generate proper hash for 'admin123'
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Update the admin user password
    await query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, 'admin@vccs.edu']
    );
    
    console.log('✅ Admin password updated successfully!');
    console.log('Email: admin@vccs.edu');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error updating password:', error);
  }
}

fixAdminPassword();
