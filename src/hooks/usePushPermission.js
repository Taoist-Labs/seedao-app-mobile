import { useState, useEffect, useMemo } from "react";

const checkNotificationSupport = () => {
  if (!window.Notification) {
    console.error("not support navigator");
    return;
  }
  return true;
};

const askPermission = () => {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== "granted") {
      throw new Error("We weren't granted permission.");
    }
  });
};

export default function usePushPermission() {
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if (!checkNotificationSupport()) {
      return;
    }

    const handlePermission = (permission) => {
      setPermission(permission);
    };

    Notification.requestPermission()
      .then(handlePermission)
      .catch((err) => console.error("permission failed", err));
  }, []);

  const handlePermission = (callback) => {
    if (permission === "granted") {
      callback && callback();
    }
    if (!checkNotificationSupport()) {
      callback && callback();
      return Promise.reject("not support navigator");
    }
    return askPermission()
      .then((res) => {
        console.log("you agreed permission");
        setPermission("granted");
      })
      .catch((err) => {
        console.error("you denied permission");
      })
      .finally(() => {
        callback && callback();
      });
  };

  return handlePermission;
}