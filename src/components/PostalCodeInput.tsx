import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PostalCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PostalCodeInput = ({ value, onChange }: PostalCodeInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase();
    
    // Format: first 4 characters must be numbers, last 2 must be letters
    const numbers = input.slice(0, 4).replace(/[^0-9]/g, "");
    const letters = input.slice(4, 6).replace(/[^A-Z]/g, "");
    
    const formattedValue = `${numbers}${letters}`;
    onChange(formattedValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="postal-code">Postal Code</Label>
      <Input
        id="postal-code"
        type="text"
        placeholder="1234AB"
        value={value}
        onChange={handleChange}
        maxLength={6}
        className="max-w-[200px] uppercase"
      />
    </div>
  );
};

export default PostalCodeInput;