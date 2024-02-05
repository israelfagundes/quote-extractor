const fs = require("fs");

function run() {
  if (process.argv.length < 3) {
    console.log(`Usage: node ${process.argv[1]} FILENAME`);
    process.exit(1);
  }

  // Read the file and print it's contents
  const filename = process.argv[2];
  const output = process.argv[3];

  const readStream = fs.createReadStream(filename, "utf8");
  let dataBuffer = "";
  let insideParentheses = false;
  let extractedText = "";

  readStream
    .on("data", function (chunk) {
      dataBuffer += chunk;

      for (let i = 0; i < chunk.length; i++) {
        if (chunk[i] === "(") {
          insideParentheses = true;
        } else if (chunk[i] === ")") {
          insideParentheses = false;
          extractedText += "\n"; // Add a newline after each closing parenthesis
        } else if (insideParentheses) {
          extractedText += chunk[i];
        }
      }
    })
    .on("end", function () {
      const filteredText = extractedText
        .split("\n")
        .filter((text) => text.trim().length >= 4)
        .join("\n");

      // Write the extracted text to the output file
      fs.writeFileSync(`outputs/${output ?? "quotes.txt"}`, filteredText);

      console.log(
        `Text between parentheses extracted and saved to ./outputs/${
          output ?? "quotes.txt"
        }`
      );
    })
    .on("error", (err) => {
      console.error("Error reading the file:", err);
    });
}

run();
