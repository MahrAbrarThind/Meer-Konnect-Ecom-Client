import axios from 'axios';

export const getAll_mainCategories = async () => {
    try {
        const response = await axios.get('http://localhost:4000/api/v1/get_main_categories');
        if (response.data.success) {
            return response.data || [];
        }
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            return {
                error: {
                    msg: data.msg,
                    status
                }
            };
        } else {
            return {
                error: {
                    msg: "Server Error",
                    status: 500
                }
            };
        }
    }
}

export const getAll_subCategories = async () => {
    try {
        const response = await axios.get('http://localhost:4000/api/v1/get_sub_categories');
        if (response.data.success) {
            return response.data || [];
        }
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            return {
                error: {
                    msg: data.msg,
                    status
                }
            };
        } else {
            return {
                error: {
                    msg: "Server Error",
                    status: 500
                }
            };
        }
    }
}