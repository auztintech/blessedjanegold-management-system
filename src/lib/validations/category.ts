import * as Yup from "yup";

export const categorySchema = Yup.object({
  name: Yup.string().required("Name is required").trim(),

  description: Yup.string().optional().default(""),
});
