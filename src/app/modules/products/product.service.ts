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
