import dotenv from 'dotenv';
import app from './app';
import mongoDBConnection from './config/db_config';


dotenv.config();

const PORT = process.env.PORT || 8000;


mongoDBConnection();
app.listen(() => {
    console.log(`Server is running at http://localhost:${PORT}`)
})