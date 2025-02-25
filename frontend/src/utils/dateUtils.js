import { format, parseISO } from "date-fns";

export const formatDate = (date) => {
  return format(parseISO(date), "MMMM d, yyyy");
};

export const formatTime = (date) => {
  return format(parseISO(date), "h:mm a");
};

export const formatDateTime = (date) => {
  return format(parseISO(date), "MMMM d, yyyy 'at' h:mm a");
};
