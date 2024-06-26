async function subscribeToPushMessages() {
  if (!window.navigator || !navigator.serviceWorker) {
    logError("not support navigator or serviceWorker");
    return;
  }

  const serviceWorkerRegistration = await navigator.serviceWorker.ready;
  let pushSubscription = "";

  try {
    // Subscribe the user to push notifications
    pushSubscription = await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.WEB_PUSH_PUBLIC_KEY),
    });
    const subscription = await pushSubscription;
    const data = subscription.toJSON();
    console.log("===== sub =====");
    console.log(JSON.stringify(data));
    console.log("===============");
    return data;
  } catch (err) {
    // The subscription wasn't successful.
    console.log("Error", err);
  }
}

// Utility function for browser interoperability
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default subscribeToPushMessages;
