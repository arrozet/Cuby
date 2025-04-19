// Crear archivo levelEncoder.js en la carpeta utils
export class LevelEncoder {
  static encode(jsonData) {
    try {
      // Convertir el objeto a JSON string
      const jsonString = JSON.stringify(jsonData);
      // Convertir a Base64
      return btoa(unescape(encodeURIComponent(jsonString)));
    } catch (error) {
      console.error('Error encoding level:', error);
      return null;
    }
  }

  static decode(encodedString) {
    try {
      // Convertir de Base64 a string
      const jsonString = decodeURIComponent(escape(atob(encodedString)));
      // Convertir string a objeto
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error decoding level:', error);
      return null;
    }
  }
}