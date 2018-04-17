import csv from 'csv';

export default class CSVReader {
  static ReadFile(buffer) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        csv.parse(reader.result, (err, data) => {
          console.log(data[0]);
          resolve(data);
        });
      };
      reader.readAsBinaryString(buffer);
    });
  }
}