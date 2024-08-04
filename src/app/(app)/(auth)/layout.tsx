const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="items-center flex justify-center xs:p-14 py-0 px-0">
      {children}
    </div>
  );
};

export default AuthLayout;
