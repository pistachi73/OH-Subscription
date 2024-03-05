const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-y-10 ">
      Welcome
    </div>
  );
};

export default ProtectedLayout;
