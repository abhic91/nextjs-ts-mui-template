import axios from 'axios';
import { baseAPIURL } from 'config';

export type RegisterWithBankSuccessResponse = {
  sessionId: string;
};

type VerifyOTPSuccessResponse = {
  message: string;
  mobileNumber: string;
  fullKYCCompleted: string;
};

export async function registerWithBankApi(payload: { mobile: string }) {
  try {
    const res = await axios.post<RegisterWithBankSuccessResponse>(`${baseAPIURL}/cardholders/yesbank/register`, payload);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function verifyOTPApi(payload: { otp: string; mobile: string; sessionId: string }) {
  try {
    const res = await axios.post<VerifyOTPSuccessResponse>(`${baseAPIURL}/cardholders/yesbank/verify`, payload);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}
