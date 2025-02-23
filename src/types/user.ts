export type TUser = {
  email: string;
};

export type TUserImport = {
  privateKey: string;
};

export type TUserStatus = "idle" | "loading" | "error" | "success";
