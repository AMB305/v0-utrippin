import { Slider as UISlider } from "@/components/ui/slider";

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const Slider = ({ min, max, value, onChange, label }: SliderProps) => {
  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-center">
        {label}
      </label>
      <UISlider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={100}
        className="w-full"
      />
    </div>
  );
};

export default Slider;
