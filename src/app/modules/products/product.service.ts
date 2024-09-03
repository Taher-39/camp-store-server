import { TProduct } from './product.interface';
import Product from './product.model';

export const createProduct = async (payload: TProduct): Promise<TProduct> => {
  const result = await Product.create(payload);
  return result;
};

export const getAllProducts = async (): Promise<TProduct[]> => {
  const result = await Product.find({ isDeleted: false });
  return result;
};
export const getBestSellingProducts = async (): Promise<TProduct[]> => {
  // Fetch the top 3 best-selling products based on sellCount
  let bestSellingProducts = await Product.find({ isDeleted: false }).sort({ sellCount: -1 }).limit(3);

  // If no products have a sellCount > 0, return the first 3 products
  if (bestSellingProducts.length === 0 || bestSellingProducts.every(product => product.sellCount === 0)) {
    bestSellingProducts = await Product.find().limit(3);
  }
  return bestSellingProducts;
};

export const getProductById = async (id: string): Promise<TProduct | null> => {
  const result = await Product.findById(id).where('isDeleted').equals(false);
  return result;
};

export const updateProduct = async (
  id: string,
  payload: Partial<TProduct>,
): Promise<TProduct | null> => {
  const result = await Product.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  })
    .where('isDeleted')
    .equals(false);
  return result;
};

export const updateProductSalesAndStock = async (products: any) => {
  const results = [];


  for (const product of products) {
    const { productId, quantity } = product;

    const productToUpdate = await Product.findById(productId);
    if (!productToUpdate) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Update the sellCount and quantity
    productToUpdate.sellCount += quantity;
    productToUpdate.quantity -= quantity;

    // Update status based on quantity
    if (productToUpdate.quantity <= 0) {
      productToUpdate.status = 'out-of-stock';
      productToUpdate.quantity = 0; // Ensure quantity does not go negative
    } else {
      productToUpdate.status = 'in-stock';
    }

    const updatedProduct = await productToUpdate.save();
    results.push(updatedProduct);
  }

  return results;
};


export const softDeleteProduct = async (
  id: string,
): Promise<TProduct | null> => {
  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};
