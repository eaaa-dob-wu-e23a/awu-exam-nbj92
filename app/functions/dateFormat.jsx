export function dateFormat(date, edit = false) {
  const year = date.getFullYear();

  const day =
    date.getDate().toString().length === 1
      ? `0${date.getDate()}`
      : date.getDate();
  const month =
    date.getMonth().toString().length === 1
      ? `0${date.getMonth() + 1}`
      : date.getMonth() + 1;

  return edit ? `${year}-${month}-${day}` : `${day}-${month}-${year}`;
}
