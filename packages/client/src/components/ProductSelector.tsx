import { Search } from "lucide-react";
import type { FormEvent } from "react";

type ProductSelectorProps = {
  inputValue: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
};

export const ProductSelector = ({
  inputValue,
  isLoading,
  onInputChange,
  onSubmit,
}: ProductSelectorProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="product-selector" onSubmit={handleSubmit}>
      <label htmlFor="product-id">Product ID</label>
      <div className="product-selector-row">
        <input
          id="product-id"
          type="number"
          min="1"
          step="1"
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          <Search aria-hidden="true" />
          <span>{isLoading ? "Loading" : "Load"}</span>
        </button>
      </div>
    </form>
  );
};
