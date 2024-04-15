"use client";

import { useEffect, useState } from "react";

export const useTabFocus = () => {
  const [focus, setFocus] = useState(true);

  useEffect(() => {
    const onFocus = () => setFocus(true);
    const onBlur = () => setFocus(false);

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return focus;
};
