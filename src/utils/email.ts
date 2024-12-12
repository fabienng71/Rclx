interface EmailParams {
  subject: string;
  body: string;
}

export function sendEmail({ subject, body }: EmailParams) {
  const outlookUrl = `ms-outlook:compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = outlookUrl;
}