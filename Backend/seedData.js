import bcrypt from 'bcrypt';
import sequelize from './src/config/db.js';
import user from './src/models/user.js';
import club from './src/models/club.js';
import clubuser from './src/models/clubuser.js';

const seedData = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Create a sample club
    const sampleClub = await club.create({
      club_name: 'Book Lovers Club',
      club_contact_email: 'admin@booklovers.com',
      club_thumbnail_url: 'https://example.com/club-logo.png',
      club_location: 'New York, NY',
      club_status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Sample club created:', sampleClub.toJSON());

    // Hash password for sample user
    const hashedPassword = await bcrypt.hash('pass@123', 10);

    // Create a sample user
    const sampleUser = await user.create({
      profile_image: 'https://example.com/profile.jpg',
      name: 'John Doe',
      email: 'example@gmail.com',
      password: hashedPassword,
      phone_no: '1234567890',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Sample user created:', sampleUser.toJSON());

    // Create club-user association (role '1' is admin)
    const clubUserAssociation = await clubuser.create({
      clubId: sampleClub.id,
      userId: sampleUser.id,
      role: '0', // Admin role (ENUM value)
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Club-User association created:', clubUserAssociation.toJSON());

    console.log('\n✅ Sample data created successfully!');
    console.log('\n📋 Sample User Credentials:');
    console.log('Email: onendonly114@gmail.com');
    console.log('Password: pass@123');
    console.log('Club: Book Lovers Club');

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the seed function
seedData();
