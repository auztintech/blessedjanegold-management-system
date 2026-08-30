import * as Yup from "yup";

export const changePasswordSchema = Yup.object({
  old_password: Yup.string().required("Current password is required"),
  new_password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("New password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password")], "Passwords do not match")
    .required("Please confirm your new password"),
});
