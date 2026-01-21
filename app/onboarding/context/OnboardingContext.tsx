import React, { createContext, ReactNode, useContext, useState } from "react";

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

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateName,
        updateEmergencyContactName,
        updateEmergencyContactWhatsapp,
        resetOnboarding,
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
