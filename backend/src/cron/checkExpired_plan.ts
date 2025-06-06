import cron from 'node-cron';
import User from '../models/auth/User_model';

export const runPlanExpirationCheck = () => {
  cron.schedule('*/2 * * * *', async () => {
    const now = new Date();
    try {
      const expired = await User.updateMany(
        { planEndDate: { $lt: now }, isPlanActive: true },
        { $set: { isPlanActive: false } }
      );

      if (expired.modifiedCount > 0) {
        console.log(`${expired.modifiedCount} user plans expired and deactivated.`);
      }
    } catch (error) {
      console.error('Plan expiration check failed:', error);
    }
  });
};
