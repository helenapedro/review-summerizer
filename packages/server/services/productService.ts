import { productRepository } from "../repositories/productRepository";

export const productService = {
  getProducts() {
    return productRepository.findMany();
  },
};
