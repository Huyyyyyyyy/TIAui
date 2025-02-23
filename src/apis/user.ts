import axios, { AxiosError } from "axios";
import { TUserLogin, TUserRegister } from "../types/user";
import { BASE_URL } from "../const/const";

export const createUser = async (createUserInput: TUserRegister) => {
  let res;
  try {
    const response = await axios.post(
      `${BASE_URL}/user/register`,
      createUserInput
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

export const login = async (userLoginInput: TUserLogin) => {
  let jsonRes;
  let loginStatus;
  try {
    let response;
    response = await axios.post(`${BASE_URL}/auth/sign-in`, userLoginInput);
    jsonRes = JSON.parse(response.request.response);
    loginStatus = jsonRes;
  } catch (error: AxiosError | any) {
    const errorRes = JSON.parse(error.request.response);
    loginStatus = {
      status: errorRes.statusCode,
      message: errorRes.message,
      data: {
        accessToken: "",
      },
    };
  }
  return loginStatus;
};

export const getUser = async (accessToken: string) => {
  const response = await axios.get(`${BASE_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};
