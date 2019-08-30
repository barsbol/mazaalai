const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.username))
    errors.username = "Нэвтрэх нэр хоосон байна.";

  if (Validator.isEmpty(data.password))
    errors.password = "Нууц үгээ оруулна уу.";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
