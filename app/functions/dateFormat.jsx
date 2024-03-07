export function dateFormat(date) {
  // const eventDate = new Date(event?.date);

  const year = date.getFullYear();

  const day =
    date.getDate().toString().length === 1
      ? `0${date.getDate()}`
      : date.getDate();
  const month =
    date.getMonth().toString().length === 1
      ? `0${date.getMonth() + 1}`
      : date.getMonth() + 1;

  return `${year}-${month}-${day}`;
}
