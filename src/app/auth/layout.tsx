const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-items-center h-ful flex h-full min-h-[900px] justify-center bg-white py-12">
      {children}
    </div>
  );
};

export default AuthLayout;
