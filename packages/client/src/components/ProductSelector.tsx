import type { Product } from "../types";

type ProductSelectorProps = {
  isLoading: boolean;
  products: Product[];
  selectedProductId: number;
  onProductSelect: (productId: number) => void;
};

export const ProductSelector = ({
  isLoading,
  products,
  selectedProductId,
  onProductSelect,
}: ProductSelectorProps) => (
  <div className="product-selector">
    <label htmlFor="product-picker">Product</label>
    <select
      id="product-picker"
      value={selectedProductId}
      onChange={(event) => onProductSelect(Number(event.target.value))}
      disabled={isLoading || products.length === 0}
    >
      {products.map((product) => (
        <option key={product.id} value={product.id}>
          {product.name}
        </option>
      ))}
    </select>
  </div>
);
