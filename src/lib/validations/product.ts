import * as Yup from "yup";

export const productSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  sku: Yup.string().required("SKU is required"),
  category: Yup.number()
    .required("Category is required")
    .integer("Category must be a valid category"),
  description: Yup.string(),
  unit_price: Yup.string()
    .required("Unit price is required")
    .test(
      "positive-price",
      "Unit price must be greater than 0",
      (value) => value !== undefined && Number(value) > 0
    ),
  low_stock_threshold: Yup.number()
    .required("Low stock threshold is required")
    .integer("Low stock threshold must be a whole number")
    .min(0, "Low stock threshold cannot be negative"),
  is_active: Yup.boolean(),
});
