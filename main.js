const fs = require("fs");

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        // console.log(data);
        resolve(data);
      }
    });
  });
}

function writeFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        // console.log(data);
        resolve(path);
      }
    });
  });
}

function appendNewLineToFile(path, line) {
  return new Promise((resolve, reject) => {
    const content = `${line.trim()}\n`;
    fs.appendFile(path, content, "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

function deleteFile(filesnamesArray){
    setTimeout(() => {
        for (let files in filesnamesArray) {
          if (filesnamesArray[files] != '') {
            fs.unlink(filesnamesArray[files], () => {
              console.log(`${filesnamesArray[files]} Deleted`);
            });
          }
          console.log(filesnamesArray[files]);
        }
      }, 5000);
}


// functions -> do one thing and do it well

async function main() {
  try {
    const data = await readFile("./lipsum.txt");
    const dataUpper = data.toUpperCase();
    // console.log(dataUpper);
    await writeFile("uppercase.txt", dataUpper);
    console.log("dataUpper written to uppercase.txt");
    await appendNewLineToFile("filenames.txt", "uppercase.txt");
    console.log("uppercase.txt appended to filenames.txt");
    const uppercaseDataReadFromFile = await readFile("./uppercase.txt");
    const lowercaseData = uppercaseDataReadFromFile.toLowerCase();
    // console.log(lowercaseData);
    const sentences = lowercaseData.split(". ");
    const sentencesFilesPromises = sentences.map((sentence, index) => {
      return writeFile(`./${index}.txt`, sentence);
    });
    const sentenceFilePaths = await Promise.all(sentencesFilesPromises);
    console.log(sentenceFilePaths);
    await sentenceFilePaths.map((path) => {
      return appendNewLineToFile("filenames.txt", path);
    });
    console.log("sentence files appended to filenames.txt");
  } catch (e) {
    console.error("Error: ", e);
  }
  const filesnamesArray = [];
        const contentofFilesnameFile = await readFile('./filenames.txt')
        contentofFilesnameFile.split('\n').forEach((filesName) => {
            filesnamesArray.push(filesName);
        });
  const getAllSentence = [];
    for (let files = 1; files < filesnamesArray.length; files++) {
        const src3 = filesnamesArray[files];
        if (src3 != '') {
            try{
                const dataLower = await readFile(src3);
                    getAllSentence.push(dataLower);
            }catch(error){
                console.log(error)
            }
        }
    }
    getAllSentence.sort();
    for (let i = 1; i < getAllSentence.length; i++) {
        const data = getAllSentence[i];
        if(data !== ' '){
            await appendNewLineToFile('./sorted.txt', data + '\n');
        }
    }
    let getSortedFileData = await fs.promises.readFile('./sorted.txt')
    writeFile('./sorted.txt',getSortedFileData)
    appendNewLineToFile('./filenames.txt', './sorted.txt');
    filesnamesArray.push('./sorted.txt');
    deleteFile(filesnamesArray)
}




main();
