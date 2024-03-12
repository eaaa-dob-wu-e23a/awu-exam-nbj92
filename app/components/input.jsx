export default function InputComponent({
  name,
  children,
  defaultValue = "",
  placeholder = "",
  onChangeHandler = null,
  type = "text",
  required = false,
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
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}
