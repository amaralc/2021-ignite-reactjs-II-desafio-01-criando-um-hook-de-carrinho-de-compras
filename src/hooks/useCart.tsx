import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

type StoreProduct = Omit<Product, 'amount'>

interface StoreProductResponse {
  data: StoreProduct
}

interface StockResponse {
  data: Stock
}

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart];
      const productExistsInCart = updatedCart.find(product => product.id === productId);

      const { data: { amount: stockAmount } } = await api.get(`stock/${productId}`) as StockResponse;
      const currentAmount = productExistsInCart ? productExistsInCart.amount : 0;
      const desiredAmount = currentAmount + 1;

      if(desiredAmount > stockAmount){
        toast.error('Quantidade solicitada fora de estoque')
        return;
      }

      if(productExistsInCart){
        productExistsInCart.amount = desiredAmount;
      } else {
        const {data: product} = await api.get(`products/${productId}`) as StoreProductResponse;
        const newProduct = {...product, amount: 1}
        updatedCart.push(newProduct);
      }

      setCart(updatedCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))

    } catch (error){
      toast.error('Erro na adição do produto');      
    }
  };

  const removeProduct = (productId: number) => {
    try {
      TODO
    } catch {
      TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      TODO
    } catch {
      TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
