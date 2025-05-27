import dotenv from 'dotenv';
import app from './app';
import mongoDBConnection from './config/db_config';

dotenv.config();

mongoDBConnection();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
