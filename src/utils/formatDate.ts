export const formatDate = (date: string) => {
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

export const formatDobFromServer = (date?: string) => {
  const [year, month, day] = date ? date.split("-") : ["", "", ""];
  return date ? `${day}/${month}/${year}` : "";
};

export const formatTime = (time: string) => {
  return time.slice(0, 5);
};
