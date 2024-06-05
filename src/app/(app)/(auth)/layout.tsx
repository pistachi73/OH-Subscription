const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="items-center h-ful flex justify-center p-32">
      {children}
    </div>
  );
};

export default AuthLayout;
