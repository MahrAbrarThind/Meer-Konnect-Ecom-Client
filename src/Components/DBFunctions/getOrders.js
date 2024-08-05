import axios from "axios";

export const getAllOrders = async (auth) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/v1/order/get-all-orders`, {
            headers: {
                Authorization: auth?.token
            },
            params: {
                userMail: auth?.user?.email
            }
        });
        if (response.data.success) {
            return response.data;
        } else {
            return { error: { msg: response.data.msg || "Failed to fetch orders" } };
        }
    } catch (error) {
        if (error.response) {
            return { error: { status: error.response.status, msg: error.response.data.msg } };
        } else {
            return { error: { msg: "Server Error", status: 500 } };
        }
    }
};
