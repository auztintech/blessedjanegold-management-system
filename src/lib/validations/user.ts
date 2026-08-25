import * as Yup from "yup";

export const createUserSchema = (isEdit: boolean) =>
  Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    phone_number: Yup.string().required("Phone number is required"),
    password: isEdit
      ? Yup.string().notRequired()
      : Yup.string()
          .min(8, "Password must be at least 8 characters")
          .required("Password is required"),
    role: Yup.string()
      .oneOf(["SUPER_ADMIN", "SALES_PERSON", "WAREHOUSE_KEEPER"])
      .required("Role is required"),
    shop_id: Yup.number().when("role", {
      is: "SALES_PERSON",
      then: (schema) => (isEdit ? schema : schema.required("Assign a shop")),
    }),
    warehouse_id: Yup.number().when("role", {
      is: "WAREHOUSE_KEEPER",
      then: (schema) =>
        isEdit ? schema : schema.required("Assign a warehouse"),
    }),
  });
