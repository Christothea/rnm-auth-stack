export const EmailRegex = RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
export const PasswordRegex = RegExp(/(?=.*\d)(?![.\n])((?=.*[a-z])|(?=.*[A-Z])).*$/);