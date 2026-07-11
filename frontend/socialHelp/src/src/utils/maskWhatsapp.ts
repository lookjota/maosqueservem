export function maskWhatsapp(phone: string) {
  if (!phone) return "";

  return "(**) *****-****";
}