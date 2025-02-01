import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PostalCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PostalCodeInput = ({ value, onChange }: PostalCodeInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="postal-code">Postal Code</Label>
      <Input
        id="postal-code"
        type="text"
        placeholder="Enter your postal code"
        value={value}
        onChange={handleChange}
        className="max-w-[200px]"
      />
    </div>
  );
};

export default PostalCodeInput;