import { Form } from "@remix-run/react";

export default function FormComponent({
  title = "",
  method,
  children,
  action = "",
}) {
  return (
    <Form method={method} action={action}>
      <div className="form">
        <h1>{title}</h1>
        {children}
        {/* <div>{error ? error?.message : null}</div> */}
      </div>
    </Form>
  );
}
