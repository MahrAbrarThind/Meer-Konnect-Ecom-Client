import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const AddToCartAlert = (cart, setCart) => {
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        setCart([...cart, { ...product, quantity: 1 }]);
        localStorage.setItem('cart', JSON.stringify([...cart, { ...product, quantity: 1 }]));

        Swal.fire({
            title: 'Item added to cart',
            text: 'Would you like to view your cart or continue shopping?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Go to Cart',
            cancelButtonText: 'Continue Shopping',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/cart');
            }
        });
    };

    return handleAddToCart;
};
