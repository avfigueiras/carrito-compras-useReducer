import db from "../data/db"
import { CartItem, Guitar } from "../types/types"

export type CartActions =
    { type: 'add-to-cart', payload: { item: Guitar } } |
    { type: 'delete-from-cart', payload: { id: Guitar['id'] } } |
    { type: 'increase-quantity', payload: { id: Guitar['id'] } } |
    { type: 'decrease-quantity', payload: { id: Guitar['id'] } } |
    { type: 'clean-cart' }


export type CartState = {
    data: Guitar[],
    cart: CartItem[]
}

//para iniciar nuestro state con lo que tiene el localStorage 
export const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

//state inicial
export const initialState: CartState = {
    data: db,
    cart:initialCart()
}

const MAX_ITEMS = 5;
const MIN_ITEMS = 1;

export const cartReducer = (
    state: CartState = initialState,
    action: CartActions
) => {
    if (action.type === 'add-to-cart') {
        const itemExist = state.cart.find((element) => element.id === action.payload.item.id);
        let updatedCart: CartItem[] = []
        if (itemExist) {
          updatedCart = state.cart.map( item => {
            if(item.id === action.payload.item.id){
                if( item.quantity < MAX_ITEMS){
                    return {...item, quantity: item.quantity + 1}
                }else{
                    return item
                }
            }else{
                return item
            }
          })
        } else { 
         const newItem: CartItem = { ...action.payload.item, quantity: 1}
          updatedCart =[...state.cart, newItem];
        }

      return {
        ...state,
        cart: updatedCart
      }
    }

    if (action.type === 'delete-from-cart') {
         const updatedCart =  state.cart.filter((guitar) => guitar.id !== action.payload.id)
        return {
            ...state,
            cart: updatedCart
          }
    }

    if (action.type === 'decrease-quantity') {
        const decreased = state.cart.map((item) => {
            if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
              return {
                ...item,
                quantity: item.quantity - 1,
              };
            }
            return item;
          });
      
       return {
        ...state,
        cart: decreased
      }
    }

    if (action.type === 'increase-quantity') {
        const updateQuantity = state.cart.map((item) => {
            if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
              return {
                ...item,
                quantity: item.quantity + 1,
              };
            }
            return item;
          });
       return {
        ...state,
        cart:updateQuantity
      }
    }

    if (action.type === 'clean-cart') {
        return {
            ...state,
            cart:[]
          }
    }

    return state
}