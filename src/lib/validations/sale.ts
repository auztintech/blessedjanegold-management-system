import * as Yup from "yup";

export const createSaleSchema = Yup.object({
  shop: Yup.string().required("Select a shop"),

  payment_method: Yup.string()
    .oneOf(["CASH", "CARD", "MOBILE_MONEY", "BANK_TRANSFER"])
    .required("Select a payment method"),

  customer_name: Yup.string().trim().required("Customer name is required"),

  customer_phone: Yup.string().trim().required("Customer phone is required"),

  items: Yup.array()
    .of(
      Yup.object({
        product: Yup.string().required("Select a product"),

        quantity: Yup.number()
          .min(1, "Minimum quantity is 1")
          .required("Quantity is required"),

        unit_price: Yup.string().required("Unit price is required"),
      })
    )
    .min(1, "Add at least one item")
    .required("Add at least one item"),
});
