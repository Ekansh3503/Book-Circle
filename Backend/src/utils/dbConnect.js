import sequelize from '../config/db.js';
import dotenv from 'dotenv'
dotenv.config({ path: `${process.cwd()}/.env` })

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected successfully!');
  } catch (error) {
    console.error('DB connection failed:', error.message);
    process.exit(1); // Stop the app if DB fails
  }
};

export default connectToDB;
