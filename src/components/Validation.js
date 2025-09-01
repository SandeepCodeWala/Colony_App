var phoneNoReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let unrealisticPhoneNumberRegex = /^[a-zA-Z0-9\-().\s]{6,15}$/;
// let passwordReg=/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[(?=.*_!@#$%^&*-_)]).{8,}/
let passwordReg =
  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,}/;
let nameReg = /^[a-zA-Z ]+$/;
let pinRegex = /^\d+$/;

export function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validateName(name, text) {
  var re = /^[a-zA-Z ]+$/;

  return re.test(String(name).toLowerCase());
}
export function validatePhone(phone) {
  var re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return re.test(String(phone));
}

export function validateUrl(url) {
  var regex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  return regex.test(String(url));
}

export const checkNormalData = (value, text) => {
  if (value === '' || value === null) {
    return {
      status: true,
      text: text,
    };
  } else {
    return { status: false, text: '' };
  }
};

export const checkName = (name, text) => {
  if (!name.match(nameReg)) {
    return {
      status: true,
      text: text,
    };
  } else {
    return { status: false, text: '' };
  }
};

export const checkEmail = (email, text) => {
  if (!email.match(emailReg)) {
    return {
      status: true,
      text: text,
    };
  } else {
    return { status: false, text: '' };
  }
};
export const checkMobile = (mobile, text) => {
  if (!mobile.match(phoneNoReg)) {
    return {
      status: true,
      text: text,
    };
  } else {
    return { status: false, text: '' };
  }
};

export const checkPassword = (mobile, text) => {
  if (!mobile.match(passwordReg)) {
    return {
      status: true,
      text: text,
    };
  } else {
    return { status: false, text: '' };
  }
};

export const checkConfirmPassword = (pass, confPass, text) => {
  if (pass.localeCompare(confPass)) {
    return {
      status: true,
      text: text,
    };
  } else {
    return { status: false, text: '' };
  }
};

export const checkPinCode = (password, text) => {
  if (!(password.length == 4)) {
    // if (!password.match(pinRegex)) {
    return {
      status: true,
      text: text,
    };
  } else {
    return { status: false, text: '' };
  }
};
