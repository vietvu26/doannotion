// validation format email
const FORMAT_EMAIL =
  /^[a-zA-Z0-9._%+-]+[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// regex tax code
const REGEX_TAX_CODE = '^[0-9]{10}$|^[0-9]{10}\\-[0-9]{3}$';
const REGEX_TAX_CODE_10 = '^[0-9]{10}\\-[0-9]{3}$';

// regex phone number

const REGEX_PHONE_NUMBER = /^\d{10,}$/;
const REGEX_PHONE_NUMBER_9 = /^\d{9,}$/;
const REGEX_SPECIAL_CHAR =
  /.*[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\<\.\>\/\?].*/;

export default {
  FORMAT_EMAIL,
  REGEX_TAX_CODE,
  REGEX_TAX_CODE_10,
  REGEX_PHONE_NUMBER,
  REGEX_PHONE_NUMBER_9,
  REGEX_SPECIAL_CHAR,
};
