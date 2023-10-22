import { createContext } from "react";

const UserRoleContext = createContext({
  roleData: "",
  data: {} as any,
});

export default UserRoleContext;
