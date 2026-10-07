import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
};

// "qui, 09 out · 18:40", or "hoje, 18:40" / "ontem, 18:40"
export const formatShortDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const time = format(date, "HH:mm");

  if (isToday(date)) {
    return `Hoje, ${time}`;
  }
  if (isYesterday(date)) {
    return `Ontem, ${time}`;
  }
  return `${format(date, "EEE, dd MMM", { locale: ptBR })} · ${time}`;
};

// "31h 12m"
export const formatRemaining = (milliseconds: number): string => {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
};

export const greeting = (date = new Date()): string => {
  const hour = date.getHours();
  if (hour < 12) {
    return "Bom dia,";
  }
  if (hour < 18) {
    return "Boa tarde,";
  }
  return "Boa noite,";
};
