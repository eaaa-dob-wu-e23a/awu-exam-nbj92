export default function InputComponent({
  name,
  children,
  defaultValue = "",
  onChangeHandler = null,
  type = "text",
}) {
  return (
    <label htmlFor={name}>
      <span>{children}</span>
      <input
        type={type}
        name={name}
        id={name}
        onChange={onChangeHandler}
        defaultValue={defaultValue}
      />
    </label>
  );
}
