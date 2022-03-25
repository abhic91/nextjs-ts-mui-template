import axios from 'axios';
import { TKYCForm, IDType } from 'pages/kyc/index';
import { baseAPIURL } from 'config';

export async function submitKYCDetailsApi(payload: TKYCForm) {
  let reqBody: { [key: string]: string } = {
    mobile: payload.mobile,
    name: payload.name,
    // panNumber:payload.,
    dateOfBirth: payload.dob,
    address: `${payload.address}`,
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
    reqBody = { ...reqBody, panNumber: payload.panNumber!.toUpperCase() };
  }
  try {
    const res = await axios.post(`${baseAPIURL}/cardholders/yesbank/${idType}`, reqBody);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}
