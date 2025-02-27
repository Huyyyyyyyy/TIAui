import axios, { AxiosError } from "axios";
import {
  FaucetUsdcPayload,
  HistoryPayload,
  TransactionPayload,
} from "../types/user";
import { BASE_URL } from "../const/const";

export const sendTransferPayload = async (payload: TransactionPayload) => {
  let res;
  try {
    const response = await axios.post(`${BASE_URL}/crypto/process`, payload);
    if (response.data.status === 200) {
      res = response;
    }
  } catch (error: AxiosError | any) {
    const errorRes = JSON.parse(error.request.response);
    res = errorRes;
  }
  return res;
};

export const sendSwapPayload = async (payload: TransactionPayload) => {
  let res;
  try {
    const response = await axios.post(
      `${BASE_URL}/crypto/swapProcess`,
      payload
    );
    if (response.data.status === 200) {
      res = response;
    }
  } catch (error: AxiosError | any) {
    const errorRes = JSON.parse(error.request.response);
    res = errorRes;
  }
  return res;
};

export const getHistory = async (payload: HistoryPayload) => {
  let res;
  try {
    const response = await axios.post(
      `${BASE_URL}/history/transaction`,
      payload
    );
    if (response.data.status === 200) {
      res = response;
    }
  } catch (error: AxiosError | any) {
    const errorRes = JSON.parse(error.request.response);
    res = errorRes;
  }
  return res;
};

export const getUsdcFaucet = async (payload: FaucetUsdcPayload) => {
  let res;
  try {
    const response = await axios.post(`${BASE_URL}/fiat/transaction`, payload);
    if (response.data.status === 200) {
      res = response;
    }
  } catch (error: AxiosError | any) {
    const errorRes = JSON.parse(error.request.response);
    res = errorRes;
  }
  return res;
};
