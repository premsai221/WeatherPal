import axios from "axios"

const axiosClient = axios.create({
    baseURL: "https://6xl0rvk173.execute-api.ap-south-1.amazonaws.com/default/weatherpallambda",
    withCredentials: false
})

export default axiosClient