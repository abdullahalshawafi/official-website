import axios from "axios";
import configs from "globals/config";

const login = ({ email, password }) => {
    return axios
        .post(`${configs.HOST}login`, {
            email,
            password,
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

export default {
    login,
    logout
};