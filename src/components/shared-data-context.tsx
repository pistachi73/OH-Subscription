import { type ReactNode, createContext, useContext, useState } from "react";

type SharedDataContextType<T> = {
  data: T;
};

type SharedDataProviderProps<T> = {
  children: ReactNode;
  data: T;
};

const createSharedDataContext = <T,>() => {
  const context = createContext<SharedDataContextType<T> | undefined>(
    undefined,
  );

  const SharedDataProvider: React.FC<SharedDataProviderProps<T>> = ({
    children,
    data: initialData,
  }) => {
    const [data] = useState(initialData);
    return <context.Provider value={{ data }}>{children}</context.Provider>;
  };

  const useSharedDataContext = (): SharedDataContextType<T> => {
    const contextValue = useContext(context);
    if (!contextValue) {
      throw new Error(
        "useSharedDataContext must be used within a SharedDataProvider",
      );
    }
    return contextValue;
  };

  return [SharedDataProvider, useSharedDataContext] as const;
};

export default createSharedDataContext;
