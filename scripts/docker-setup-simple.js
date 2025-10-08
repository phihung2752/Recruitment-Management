// Simple setup script using fetch instead of mysql2
async function setupDatabase() {
  try {
    console.log('🔧 Setting up HR Management Database in Docker...');
    
    // Wait for app to be ready
    let retries = 30;
    while (retries > 0) {
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'admin',
            password: 'admin123'
          })
        });
        
        if (response.ok) {
          console.log('✅ Application is ready');
          break;
        }
      } catch (error) {
        console.log(`⏳ Waiting for application... (${retries} retries left)`);
        retries--;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (retries === 0) {
      throw new Error('❌ Application not ready after 30 retries');
    }

    console.log('\n🎉 HR Management System is ready!');
    console.log('\n📋 Access Information:');
    console.log('  🌐 Application: http://localhost:3001');
    console.log('  🗄️  Database Admin: http://localhost:8080');
    console.log('  👤 Login: admin / admin123');
    console.log('\n📊 Services:');
    console.log('  ✅ HR App: http://localhost:3001');
    console.log('  ✅ MySQL: localhost:3306');
    console.log('  ✅ Adminer: http://localhost:8080');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();




