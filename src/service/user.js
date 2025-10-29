import axios from "axios";

const api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
    headers: {"Content-Type": "application/json"},
});


export const usersApi = {
    // get
    async list(limit = 10) {
        const response = await api.get(
            "/users", 
            {"params": 
                {
                    "_limit": limit
                }
            }
        )
        return response.data;
    },

    // post
    async create(payload) {
        const response = await api.post("/users", payload);
        return response.data;
    },

    // put
    async update(id, payload) {
        const response = await api.put(`/users/${id}`, payload);
        return response.data;
    },

    // delete
    async remove(id) {
        await api.delete(`/users/${id}`);
        return id;
    },
};
