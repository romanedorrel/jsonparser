# jsonparser

A lightweight JSON parser written in JavaScript (Node.js).
This project implements a custom lexer and recursive parser that validates and parses JSON data.

✨ Features

Parses all valid JSON values:
Objects { ... }
Arrays [ ... ]
Strings with escape sequences (\", \\, \n, \t, \uXXXX)
Numbers with optional decimals and exponents (0, -42, 3.14, 1e10)
Literals: true, false, null
Allows top-level values (JSON does not require an object/array at the top)
Example:
"hello"
123
true
null

Strict validation rules:
Rejects unescaped control characters in strings
Rejects leading zeros in numbers (e.g., 012 ❌)
Rejects incomplete decimals (e.g., 1. ❌)
Rejects incomplete exponents (e.g., 1e ❌)
Rejects trailing commas in objects/arrays
Detects unterminated strings and invalid escapes

CLI exit codes:
0 → valid JSON
1 → invalid JSON

📦 Installation
Clone the repo:
git clone https://github.com/romanedorrel/jsonparser.git
cd jsonparser

🚀 Usage
Run the parser against a JSON file:
node ccjsonparser.js tests/step1/valid.json

Example output:

Valid JSON in tests/step1/valid.json:
{
  "key": "value"
}

Invalid JSON:
Invalid JSON in tests/step1/invalid.json: Invalid number: leading zeros are not allowed

You can also test top-level values:

echo '42' > number.json
node ccjsonparser.js number.json
Output:
Valid JSON in number.json:
42

🧪 Testing
A Bash script (run_tests.sh) is included to automatically test .json files.

Run all test subdirectories
./run_tests.sh tests

Run a single test step
./run_tests.sh tests/step2

Run tests in a leaf folder (no subdirectories)
./run_tests.sh tests/strings

📂 Project Structure
ccjsonparser.js    # main parser implementation
run_tests.sh       # bash test runner
tests/
  step1/           # basic {} tests
  step2/           # string keys and values
  step3/           # booleans, null, numbers
  objects/         # nested objects
  arrays/          # nested arrays
  strings/         # escape sequences and control chars
  numbers/         # numeric edge cases
  top-level/       # top-level literal tests

⚠️ Limitations
Large numbers may lose precision 