export function maskWhatsapp(phone: string) {

  if (!phone) return "";

  const clean = phone.replace(/\D/g, "");

  if (clean.length < 8) {
    return phone;
  }

  return clean.replace(
    /^(\d{2})(\d{4,5})(\d{4})$/,
    "($1) $2-****"
  );

}