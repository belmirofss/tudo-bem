export async function sendExpoPush(
  token: string,
  title: string,
  body: string,
): Promise<void> {
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: token,
        title,
        body,
      }),
    });
    console.log(`Expo push notification sent: ${title}`);
  } catch (error) {
    console.error(`Failed to send Expo push notification:`, error);
  }
}
