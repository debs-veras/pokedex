import instance from "../configAxios";

function handleError(error: any) {
  if (!error.response) {
    return {
      sucesso: false,
      tipo: "error",
      mensagem: "Não foi possível conectar ao servidor.",
    };
  }
  return {
    sucesso: false,
    tipo: "error",
    mensagem: "Erro ao realizar operação",
  };
}

export const putRequest = async (url: string, obj: any) => {
  const axios = await instance();

  try {
    const response = await axios.put(url, obj);
    return {
      dados: response.data.dados,
      ...response.data,
    };
  } catch (error: any) {
    return handleError(error);
  }
};

export const postRequest = async (url: string, obj: any) => {
  const axios = await instance();

  try {
    const response = await axios.post(url, obj);
    return {
      dados: response.data.dados,
      ...response.data,
    };
  } catch (error: any) {
    return handleError(error);
  }
};

export const getRequest = async (url: string) => {
  const axios = await instance();

  try {
    const response = await axios.get(url);
    return { sucesso: true, data: response.data };
  } catch (error: any) {
    return handleError(error);
  }
};

export const deleteRequest = async (url: string) => {
  const axios = await instance();

  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const patchRequest = async (url: string, obj: any) => {
  const axios = await instance();

  try {
    const response = await axios.patch(url, obj);
    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};
