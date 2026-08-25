import * as Yup from "yup";

export const locationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  location: Yup.string().required("Location is required"),
  is_active: Yup.boolean(),
});
