let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export const getDay = (timestamp) => {
  let date = new Date(timestamp);
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

export const getFullDay = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const getYear = (timestamp) => {
  let date = new Date(timestamp);
  return `${date.getYear()}`;
};

export const getFullYear = (timestamp) => {
  let date = new Date(timestamp);
  return `${date.getFullYear()}`;
};
export const getMonth = (timestamp) => {
  let date = new Date(timestamp);
  return `${date.getMonth()}`;
};
