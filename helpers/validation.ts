export const isValidName = (name: string): boolean => {
  return name.trim().length >= 3;
};

export const isValidEmergencyContactName = (name: string): boolean => {
  return name.trim().length >= 3;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidProfile = (
  name: string,
  emergencyContactName: string,
  emergencyContactEmail: string,
): boolean => {
  return (
    isValidName(name) &&
    isValidEmergencyContactName(emergencyContactName) &&
    isValidEmail(emergencyContactEmail)
  );
};
