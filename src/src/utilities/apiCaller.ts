import axios from "axios";
import {
  authApiUrl,
  approvalUrl,
  chatSupportUrl,
  uploadFilesApiUrl,
  cmsServiceUrl
} from "../config/variables";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";
axios.defaults.headers.patch["Content-Type"] = "application/json";
axios.defaults.headers.get["Content-Type"] = "application/json";
axios.defaults.headers.delete["Content-Type"] = "application/json";

interface apiRequest {
  fileType?: string;
  endpoint: string;
  token: string;
}

// terms of service
const authPrivateGet = (arg: apiRequest) => {
  const apiConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${arg.token}`
    }
  };
  return axios
    .get(`${authApiUrl}/${arg.endpoint}`, apiConfig)
    .then((response) => {
      return response;
    });
};

// chat service
const chatPrivateGet = (arg: apiRequest) => {
  const apiConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${arg.token}`
    }
  };
  return axios
    .get(`${chatSupportUrl}/${arg.endpoint}`, apiConfig)
    .then((response) => {
      return response;
    });
};

const chatPrivatePost = (arg: apiRequest, body: any) => {
  const apiConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${arg.token}`
    }
  };
  return axios
    .post(`${chatSupportUrl}/${arg.endpoint}`, body, apiConfig)
    .then((response) => {
      return response;
    });
};

const approvalPrivateGet = (arg: apiRequest) => {
  const apiConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${arg.token}`
    }
  };
  return axios
    .get(`${approvalUrl}/${arg.endpoint}`, apiConfig)
    .then((response) => {
      return response;
    });
};

const approvalPrivatePost = (arg: apiRequest, body: any) => {
  const apiConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${arg.token}`
    }
  };
  return axios
    .post(`${approvalUrl}/${arg.endpoint}`, body, apiConfig)
    .then((response) => {
      return response;
    });
};

const approvalPrivatePut = (arg: apiRequest, body: any) => {
  const apiConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${arg.token}`
    }
  };
  return axios
    .put(`${approvalUrl}/${arg.endpoint}`, body, apiConfig)
    .then((response) => {
      return response;
    });
};

const approvalPrivateDelete = (arg: apiRequest) => {
  const apiConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${arg.token}`
    }
  };
  return axios
    .delete(`${approvalUrl}/${arg.endpoint}`, apiConfig)
    .then((response) => {
      return response;
    });
};

// new file upload------

const uploadPrivatePost = (arg: apiRequest, body: any) => {
  const apiConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${arg.token}`
    }
  };
  return axios
    .post(`${uploadFilesApiUrl}/${arg.endpoint}`, body, apiConfig)
    .then((response) => {
      return response;
    });
};

const uploadPrivatePut = (arg: apiRequest, body: any) => {
  const apiConfig = {
    headers: {
      "content-type": `${arg?.fileType}`
    }
  };
  return axios.put(`${arg.endpoint}`, body, apiConfig).then((response) => {
    return response;
  });
};

const uploadPrivateGet = (arg: apiRequest) => {
  const apiConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${arg.token}`
    }
  };
  return axios
    .get(`${uploadFilesApiUrl}/${arg.endpoint}`, apiConfig)
    .then((response) => {
      return response;
    });
};

const uploadPrivateDelete = (arg: apiRequest) => {
  const apiConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${arg.token}`
    }
  };
  return axios
    .delete(`${uploadFilesApiUrl}/${arg.endpoint}`, apiConfig)
    .then((response) => {
      return response;
    });
};

const cmsPrivateGet = (arg: apiRequest) => {
  const apiConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${arg.token}`
    }
  };
  return axios
    .get(`${cmsServiceUrl}/${arg.endpoint}`, apiConfig)
    .then((response) => {
      return response;
    });
};

const axiosMethods = {
  authPrivateGet,
  chatPrivateGet,
  chatPrivatePost,

  approvalPrivateGet,
  approvalPrivatePost,
  approvalPrivatePut,
  approvalPrivateDelete,

  uploadPrivateGet,
  uploadPrivatePost,
  uploadPrivatePut,
  uploadPrivateDelete,

  cmsPrivateGet
};

export default axiosMethods;
