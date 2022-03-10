import axios from 'axios';
import { baseAPIURL } from '../config';
import { TKYCForm, IDType } from '../pages/kyc/index';

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
export async function submitKYCDetailsApi(payload: TKYCForm) {
  let reqBody: { [key: string]: string } = {
    mobile: `91${payload.mobile}`,
    name: payload.name,
    // panNumber:payload.,
    dateOfBirth: payload.dob,
    address: payload.address,
    pinCode: payload.pinCode,
    gender: payload.gender,
    // aadhaarNumber: '',
    // panNumber: '',
  };
  let idType = '';
  if (payload.idType === IDType.AADHAAR) {
    reqBody = { ...reqBody, aadhaarNumber: payload.aadhaarNumber! };
    idType = 'aadhaar';
  } else {
    idType = 'pan';
    reqBody = { ...reqBody, panNumber: payload.panNumber! };
  }
  try {
    const res = await axios.post(`${baseAPIURL}/cardholders/yesbank/${idType}`, reqBody);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}
