import { useState, useEffect } from "react";
import packages from "@/data/experiencePackages.json";

interface ExperiencePackage {
  name: string;
  description: string;
  link: string;
  image: string;
  category: string;
}

export const useExperiencePackages = (): ExperiencePackage[] => {
  const [experiencePackages, setExperiencePackages] = useState<ExperiencePackage[]>([]);

  useEffect(() => {
    // For now, use static JSON data
    // In the future, this could fetch from an API or RSS feed
    setExperiencePackages(packages);
  }, []);

  return experiencePackages;
};
