import React from "react";

import {
  type AuthFormType,
  type LoginFormType,
  type RegisterFormType,
} from "./auth.types";

export const AuthContext = React.createContext<{
  parentForm: AuthFormType;
  childrenForm: RegisterFormType | LoginFormType;
  email: string;
  setParentForm: (formType: AuthFormType) => void;
  setChildrenForm: (formType: RegisterFormType | LoginFormType) => void;
  setEmail: (email: string) => void;
}>({
  parentForm: "login",
  childrenForm: "default",
  email: "",
  setParentForm: () => {},
  setChildrenForm: () => {},
  setEmail: () => {},
});

export const AuthProvider = ({
  initialFormType,
  children,
}: {
  initialFormType: AuthFormType;
  children: React.ReactNode;
}) => {
  const [parentForm, setParentForm] =
    React.useState<AuthFormType>(initialFormType);

  const [childrenForm, setChildrenForm] = React.useState<
    RegisterFormType | LoginFormType
  >("default");

  const [email, setEmail] = React.useState<string>("");
  return (
    <AuthContext.Provider
      value={{
        parentForm,
        childrenForm,
        email,
        setChildrenForm,
        setParentForm,
        setEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error(`useUtilContext must be used within a AuthProvider`);
  }

  return context;
};
