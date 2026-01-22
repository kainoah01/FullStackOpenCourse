import axios from "axios";

const baseUrl = "/api/persons";

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then((response) => response.data);
};

const deleteUser = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const modifyUser = (id, newPersonObject) => {
  return axios
    .put(`${baseUrl}/${id}`, newPersonObject)
    .then((response) => response.data);
};

export default { getAll, create, deleteUser, modifyUser };
