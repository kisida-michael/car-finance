export const formatPhoneNumber = (input) => {
  // Strip all non-digits
  const cleaned = ("" + input).replace(/\D/g, "");

  // Check if the input is greater than 10 characters
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }

  return input;
};


export const validateEmail = (email) => {
  // Regular expression for email validation
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  const re = /^\(\d{3}\) \d{3}-\d{4}$/;
  return re.test(String(phoneNumber));
};
