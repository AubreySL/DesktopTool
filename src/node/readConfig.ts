import path from 'path'
import fs from 'node:fs';

export function readConfigFile(){
    try {
      const data = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
      // console.log(data);
      return data;
    } catch (err) {
      console.error(err);
    }
}

