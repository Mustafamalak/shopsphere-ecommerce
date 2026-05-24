import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("shopsphereCart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const saveCart = (items) => {
    localStorage.setItem("shopsphereCart", JSON.stringify(items));
    setCartItems(items);
  };

  const addToCart = (product, quantity = 1) => {
    const existing = cartItems.find((item) => item.product === product._id);

    if (existing) {
      const updated = cartItems.map((item) =>
        item.product === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );

      saveCart(updated);
      return;
    }

    saveCart([
      ...cartItems,
      {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      },
    ]);
  };

  const removeFromCart = (productId) => {
    saveCart(cartItems.filter((item) => item.product !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    const updated = cartItems.map((item) =>
      item.product === productId ? { ...item, quantity } : item
    );

    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);