import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  isValidEmail as validateEmail,
  isValidEmergencyContactName as validateEmergencyContactName,
  isValidName as validateName,
} from "../../../helpers/validation";

interface OnboardingData {
  name: string;
  emergencyContactName: string;
  emergencyContactEmail: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateName: (name: string) => void;
  updateEmergencyContactName: (name: string) => void;
  updateEmergencyContactEmail: (email: string) => void;
  resetOnboarding: () => void;
  isValidName: boolean;
  isValidEmergencyContactName: boolean;
  isValidEmergencyContactEmail: boolean;
}

const defaultOnboardingData: OnboardingData = {
  name: "",
  emergencyContactName: "",
  emergencyContactEmail: "",
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);

  const updateName = (name: string) => {
    setData((prev) => ({ ...prev, name }));
  };

  const updateEmergencyContactName = (name: string) => {
    setData((prev) => ({ ...prev, emergencyContactName: name }));
  };

  const updateEmergencyContactEmail = (email: string) => {
    setData((prev) => ({ ...prev, emergencyContactEmail: email }));
  };

  const resetOnboarding = () => {
    setData(defaultOnboardingData);
  };

  const isValidName = useMemo(() => validateName(data.name), [data.name]);
  const isValidEmergencyContactName = useMemo(
    () => validateEmergencyContactName(data.emergencyContactName),
    [data.emergencyContactName],
  );
  const isValidEmergencyContactEmail = useMemo(
    () => validateEmail(data.emergencyContactEmail),
    [data.emergencyContactEmail],
  );

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateName,
        updateEmergencyContactName,
        updateEmergencyContactEmail,
        resetOnboarding,
        isValidName,
        isValidEmergencyContactName,
        isValidEmergencyContactEmail,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }

  return context;
}

export default OnboardingProvider;
