const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (Validator.isEmpty(data.username)) errors.username = "Username required.";
  if (Validator.isEmpty(data.password)) errors.password = "Password Required.";
  if (!Validator.isLength(data.password, { min: 6, max: 30 }))
    errors.password = "Password must be atleast 6 characters.";
  if (!Validator.equals(data.password, data.password2))
    errors.password2 = "Password doesn't match.";
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
