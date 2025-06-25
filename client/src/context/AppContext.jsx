import { Children, createContext, useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";


axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const currency = import.meta.env.VITE_CURRENCY;


  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({})
  const [searchQuery, setSearchQuery] = useState({})




  // fetch user auth status , user data and cart items


  const fetchUser = async (params) => {
    try {
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success) {
        console.log(data)

        setUser(data.user)
        setCartItems(data.user.cartItems)

      }

    } catch (error) {
      setUser(null)
    }
  }

  //fetch seller status

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth');
      if (data.success) {
        setIsSeller(true)
      }
      else {
        setIsSeller(false)

      }
    } catch (error) {
      setIsSeller(false)

    }
  }

  //fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list')
      if (data.success) {
        setProducts(data.products)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //add products to cart

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    }
    else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    console.log(cartData);
    toast.success("Added to Cart")

  }

  //update cart itme quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated")

  }

  //remove from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Delete from Cart")
    setCartItems(cartData);

  }

  // cart count 

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  }

  //total cart amount

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      console.log(items)
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }

    }
    console.log(totalAmount)
    return Math.floor(totalAmount * 100) / 100;
  }

  useEffect(() => {
    fetchUser()
    fetchSeller()
    fetchProducts()
  }, [])



  //update database cart items
  useEffect(() => {
    const updateCart = async (params) => {
      try {
        const { data } = await axios.post('/api/cart/update', { cartItems })
        if (!data.success) {
          toast.error(data.message)
        }
      } catch (error) {

        toast.error(error.message)
      }
    }

    if(user){
      updateCart()
    }
  }, [cartItems])



  const value = {
    navigate, user, setUser, setIsSeller, isSeller, showUserLogin, setShowUserLogin,
    products, currency, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery,
    getCartAmount, getCartCount, axios, fetchProducts,setCartItems
  };

  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>;
};


export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }

  return context;
}