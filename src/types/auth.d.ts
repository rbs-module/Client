export type User = {
  name: string;
  phone: string;
  // password: string;
  status: "active" | "inactive" | "blocked" | "pending";
  is_verified: boolean;
  role: (
    | "user"
    | "customer"
    | "supplier"
    | "super-admin"
    | "admin"
    | "employee"
    | "guest"
  )[];
  organization_id: string;
  email: string;
  _id: string;
};
type LoginBody = {
  email: string;
  password: string;
};
type LoginResponse = {
  message: string;
  access_token: string;
};

type RegistrationBody = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  organization_id: string;
};
