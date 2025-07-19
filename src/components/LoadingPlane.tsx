import { Plane } from "lucide-react";

const LoadingPlane = () => {
  return (
    <div className="flex items-center justify-center">
      <Plane className="w-12 h-12 text-primary animate-plane" />
    </div>
  );
};

export default LoadingPlane;