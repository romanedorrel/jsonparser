# jsonparser

A lightweight JSON parser written in JavaScript (Node.js).
This project implements a custom lexer and recursive parser that validates and parses JSON data.

The goal was to deeply understand how structured data formats are tokenized, validated, and recursively interpreted.

✨ Features

Parses all valid JSON values:
- Objects { ... }
- Arrays [ ... ]
- Strings with escape sequences (\", \\, \n, \t, \uXXXX)
- Numbers with optional decimals and exponents (0, -42, 3.14, 1e10)
- Literals: true, false, null
- Allows top-level values (JSON does not require an object/array at the top)
Example:
"hello"
123
true
null

Strict validation rules:
- Rejects unescaped control characters in strings 
- Rejects leading zeros in numbers (e.g., 012 ❌)
- Rejects incomplete decimals (e.g., 1. ❌)
- Rejects incomplete exponents (e.g., 1e ❌)
- Rejects trailing commas in objects/arrays
- Detects unterminated strings and invalid escapes

CLI exit codes:
0 → valid JSON
1 → invalid JSON

🧠 How It Works

1. Lexer  
   Converts raw input into meaningful tokens (braces, brackets, strings, numbers, literals).

2. Recursive Descent Parser  
   Processes tokens according to JSON grammar rules and constructs nested structures.

3. Strict Validation  
   Enforces JSON specification rules including number formatting, escape handling, and structural correctness.

💡 What This Project Demonstrates

- Manual parsing and tokenization
- Recursive algorithm implementation
- Specification-driven validation
- Edge-case handling
- CLI tool design with exit codes
- Structured test coverage

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
ccjsonparser.js    # Main parser implementation
run_tests.sh       # Bash test runner
tests/
├── step1/         # Basic {} tests
├── step2/         # String keys and values
├── step3/         # Booleans, null, numbers
├── objects/       # Nested objects
├── arrays/        # Nested arrays
├── strings/       # Escape sequences and control characters
├── numbers/       # Numeric edge cases
└── top-level/     # Top-level literal tests

⚠️ Limitations
Large numbers may lose precision 