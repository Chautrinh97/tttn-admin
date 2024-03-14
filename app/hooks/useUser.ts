import { storage } from "./../utils/storage";
import { useState, useLayoutEffect } from "react";

export const useUser = () => {
  const [user, setUser] = useState<any>();

  useLayoutEffect(() => {
    if (localStorage) {
      setUser(JSON.parse(storage.get("USER") || "{}"));
    }
  }, []);

  return { user };
};
