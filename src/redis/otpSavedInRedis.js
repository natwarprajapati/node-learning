import { redisClient } from "../config/redis.js";

export const otpSavedInRedis = async (key, value, expireTime) => {
  try {
    await redisClient.set(key, value, "EX", expireTime);
    console.log(
      `OTP saved in Redis for key: ${key} with expiration time: ${expireTime} seconds with this value: ${value}`,
    );
  } catch (error) {
    console.error("Error saving OTP in Redis:", error);
    throw error;
  }
};

export const getOtpFromRedis = async (key) => {
  try {
    const otp = await redisClient.get(key);
    console.log(`OTP fetched from Redis for key: ${key}`);
    return otp;
  } catch (error) {
    console.error("Error fetching OTP from Redis:", error);
    return null;
  }
};

export const verifyOtpInRedis = async (key, otp) => {
  try {
    const storedOtp = await redisClient.get(key);

    console.log(
      `OTP verified in Redis for key: ${key} - Stored OTP: ${storedOtp}, Provided OTP: ${otp}`,
    );

    if (storedOtp === String(otp)) {
      // OTP is valid, delete it from Redis so it cannot be reused
      await redisClient.del(key);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error verifying OTP in Redis:", error);
    throw error;
  }
};
