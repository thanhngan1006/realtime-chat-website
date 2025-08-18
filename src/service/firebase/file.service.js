import { withErrorHandler } from '../utils/error-handler';

class FileService {
  handleFileRead = withErrorHandler(async (event) => {
    const file = event.target.files[0];
    const base64 = await this.convertBase64(file);
    return {
      base64: base64,
      fileName: file.name,
    };
  });

  convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
}

export const fileService = new FileService();
