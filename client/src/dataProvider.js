import axios from "axios";
const TOKEN = sessionStorage.getItem('token')

// ?? what name ?
const uploadAudioFile = (path) => {
  return axios
    .get(`${process.env.REACT_APP_URI}/audio/${path}`, {
      headers: { "x-access-token": TOKEN },
    })
    .then( (response) => {
      return response.data.data
    })
    .catch( (error) => {
      console.log(error);
    });
}
const uploadAudioFiles = (formData, onUploadProgress) => {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_URI}/audio`,
    data: formData,
    headers: {
      "x-access-token": TOKEN,
      "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => onUploadProgress(progressEvent)
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

const getAudioFile = (url, fileName) => {
    return axios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        const blob = res.data;

        const file = new File([blob], fileName, {
          type: "audio/wav",
          lastModified: new Date().getTime(),
        });

        const formData = new FormData();

        formData.append("uploads[]", file, file.name.toLowerCase()+'.'+file.type.split("/").pop());
        return {file, formData};
      })
      .catch((err) => console.error(err));
};

const getAllAudioFiles = () => {
  return axios
    .get(`${process.env.REACT_APP_URI}/audio`, {
      headers: { "x-access-token": TOKEN },
    })
    .then( (res) => {
      console.log(res.data)
      return res.data;
    })
    .catch( (err) => {
      console.log(err);
    });
};

const deleteAudioFile = (sha, path) => {
  return axios.delete(`${process.env.REACT_APP_URI}/audio/`, {
    headers: { "x-access-token": TOKEN },
    data: {
      sha,
      path,
    }
  })
    .then( (response) =>{
      console.log(response);
      return response;
    })
    .catch( (error)=> {
      console.log(error);
    });
}

export {
  getAudioFile,
  getAllAudioFiles,
  deleteAudioFile,
  uploadAudioFile,
  uploadAudioFiles
 };
