import * as Yup from "yup";

export const addStockSchema = Yup.object({
  warehouse: Yup.number()
    .required("Select a warehouse")
    .positive("Select a valid warehouse"),

  product: Yup.number()
    .required("Select a product")
    .positive("Select a valid product"),

  quantity: Yup.number()
    .required("Quantity is required")
    .integer("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),

  reason: Yup.string().max(500, "Reason cannot exceed 500 characters"),
});

export const removeStockSchema = Yup.object({
  warehouse: Yup.number()
    .required("Select a warehouse")
    .positive("Select a valid warehouse"),

  product: Yup.number()
    .required("Select a product")
    .positive("Select a valid product"),

  quantity: Yup.number()
    .required("Quantity is required")
    .integer("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),

  reason: Yup.string()
    .trim()
    .required("Reason is required")
    .max(500, "Reason cannot exceed 500 characters"),
});

export const transferStockSchema = Yup.object({
  from_warehouse: Yup.number()
    .required("Select the source warehouse")
    .positive("Select a valid warehouse"),

  product: Yup.number()
    .required("Select a product")
    .positive("Select a valid product"),

  quantity: Yup.number()
    .required("Quantity is required")
    .integer("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),

  destination_type: Yup.string()
    .oneOf(["warehouse", "shop"])
    .required("Select a destination type"),

  to_warehouse: Yup.number().when("destination_type", {
    is: "warehouse",
    then: (schema) =>
      schema
        .required("Select the destination warehouse")
        .positive("Select a valid warehouse"),

    otherwise: (schema) => schema.notRequired(),
  }),

  to_shop: Yup.number().when("destination_type", {
    is: "shop",
    then: (schema) =>
      schema
        .required("Select the destination shop")
        .positive("Select a valid shop"),

    otherwise: (schema) => schema.notRequired(),
  }),

  reason: Yup.string().max(500, "Reason cannot exceed 500 characters"),
});
