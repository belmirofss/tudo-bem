import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

interface OnboardingData {
  name: string;
  emergencyContactName: string;
  emergencyContactWhatsapp: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateName: (name: string) => void;
  updateEmergencyContactName: (name: string) => void;
  updateEmergencyContactWhatsapp: (whatsapp: string) => void;
  resetOnboarding: () => void;
  isValidName: boolean;
  isValidEmergencyContactName: boolean;
  isValidEmergencyContactWhatsapp: boolean;
}

const defaultOnboardingData: OnboardingData = {
  name: "",
  emergencyContactName: "",
  emergencyContactWhatsapp: "",
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

  const updateEmergencyContactWhatsapp = (whatsapp: string) => {
    setData((prev) => ({ ...prev, emergencyContactWhatsapp: whatsapp }));
  };

  const resetOnboarding = () => {
    setData(defaultOnboardingData);
  };

  const isValidName = useMemo(() => data.name.trim().length >= 3, [data.name]);
  const isValidEmergencyContactName = useMemo(
    () => data.emergencyContactName.trim().length >= 3,
    [data.emergencyContactName],
  );
  const isValidEmergencyContactWhatsapp = useMemo(
    () =>
      /^\(\d{2}\) \d{5}-\d{4}$|^\(\d{2}\) \d{4}-\d{4}$/.test(
        data.emergencyContactWhatsapp,
      ),
    [data.emergencyContactWhatsapp],
  );

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateName,
        updateEmergencyContactName,
        updateEmergencyContactWhatsapp,
        resetOnboarding,
        isValidName,
        isValidEmergencyContactName,
        isValidEmergencyContactWhatsapp,
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
