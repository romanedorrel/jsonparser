const fs = require("fs");
// It returns an array of tokens or an error if it encounters an unexpected character
// Tokens are objects with a type property, e.g., {type: "LBRACE
function lex(input){
    const tokens = [];
    let i = 0;

    const isWhitespace = (char) => /\s/.test(char);
    const isDigit = (char) => /[0-9]/.test(char);
    while (i < input.length) {
        const ch = input[i];

        if(isWhitespace(ch)){
            i++;
            continue;
        }

        if (ch === '{'){
            tokens.push({ type: "LBRACE"});
            i++;
            continue;
        }

        if (ch === '}'){
            tokens.push({ type: "RBRACE"});
            i++;
            continue;
        }

        if (ch === ':'){
            tokens.push({ type: "COLON"});
            i++;
            continue;
        }

        if (ch === ','){
            tokens.push({ type: "COMMA"});
            i++;
            continue;
        }

        if (ch === '"'){
            // Parse a string
            let str = "";
            i++;
            while (i < input.length && input[i] !== '"'){
                if (input[i] === "\\" ) {
                    i++;
                    if(i >= input.length){
                       return {tokens, error: "Unterminated escape sequence"};
                    }
                    const escapeChar = input[i++];
                    switch (escapeChar) {
                        case '"': str += '"'; break;
                        case "\\": str += "\\"; break;
                        case "/": str += "/"; break;
                        case "b": str += "\b"; break;
                        case "f": str += "\f"; break;
                        case "n": str += "\n"; break;
                        case "r": str += "\r"; break;
                        case "t": str += "\t"; break;
                        case "u":
                            if (i+4 > input.length){
                                return {tokens, error: "Invalid unicode escape sequence"};
                            }
                            const hex = input.slice(i, i + 4);
                            if (!/^[0-9a-fA-F]{4}$/.test(hex)){
                                return {tokens, error: "Invalid unicode escape sequence"};
                            }
                            str += String.fromCharCode(parseInt(hex, 16));
                            i += 4;
                            break;
                        default:
                            return {tokens, error: `Invalid escape character: \\${escapeChar}`};
                    }
                } else { 
                    if (input.charCodeAt(i) < 0x20){
                        return {tokens, error: "Invalid string: control characters must be escaped"};
                    }
                    str += input[i++];
                }
            }
             if(i >= input.length){
                return {tokens, error: "Unterminated string"};
             }          
            i++; // Skip closing quote
            tokens.push({ type: "STRING", value: str});
            continue;
        }

        if(input.startsWith("true", i)){
            tokens.push({ type: "TRUE", value: true});
            i += 4;
            continue;
        }

        if(input.startsWith("false", i)){
            tokens.push({ type: "FALSE", value: false});
            i += 5;
            continue;
        }

        if (input.startsWith("null", i)){
            tokens.push({ type: "NULL", value: null});
            i += 4;
            continue;
        }

        if( ch ==='['){
            tokens.push({type: "LBRACKET"});
            i++;
            continue;
        }

        if( ch ===']'){
            tokens.push({type: "RBRACKET"});
            i++;
            continue;
        }

        if( ch === '-' || isDigit(ch)){
            let numStr = "";
            if (ch === "-"){
                numStr += ch; 
            i++;   
        }
        if (ch === "0"){
            numStr += ch;
            i++;
            if(i <input.length && isDigit(input[i])){
         return {tokens, error: "Invalid number: leading zeros are not allowed"};
        }
               
            }

        while (i < input.length && isDigit(input[i])){
            numStr += input[i++];
        }
        if( i < input.length && input[i] === '.' ){
            numStr += input[i++];
            const decimalStart = i;
            while (i < input.length && isDigit(input[i])){
                numStr += input[i++];
            }
            if (decimalStart === i){
                return{tokens, error: "Invalid decimal missing digits"};
            }
        }
        if ( i < input.length && (input[i] === 'e' || input[i] === 'E')){
            numStr += input[i++];
            if( input[i] === '+' || input[i] === '-'){
                numStr += input[i++];
            }
            const expStart = i;
            while (i < input.length && isDigit(input[i])){
                numStr += input[i++];
            }
            if (expStart === i){
                return {tokens, error: "Invalid exponent missing digits"};
            }
        }
        tokens.push({ type: "NUMBER", value: Number(numStr)});
        continue;
    }

        // If we reach here, it's an unexpected character
        return {tokens, error: `Unexpected character: '${ch}' at position ${i}`};
    }
    tokens.push({ type: "EOF"});
    return {tokens, error: null};
}

// A simple parser that checks for balanced braces in the token stream
// It returns true if the braces are balanced, false otherwise
function parse(tokens){
    let pos = 0;

    const peek = () => tokens[pos];
    const consume = (type) => {
        if (peek()?.type === type) return tokens[pos++];
        throw new Error(`Expected ${type} but found ${peek()?.type || "EOF"}`);
    };

    function parseValue(){
        switch (peek().type) {
            case "STRING":
                return consume("STRING").value;
            case "NUMBER":
                return consume("NUMBER").value;
            case "TRUE":
                return consume("TRUE").value;
            case "FALSE":
                return consume("FALSE").value;
            case "NULL":
                return consume("NULL").value;
            case "LBRACE":
                return parseObject();
            case "LBRACKET":
                return parseArray();        
            default:
                throw new Error(`Expected value but found ${peek()?.type || "EOF"}`);
        }
    }
    function parseObject(){ 
    consume("LBRACE");
    const obj = {};

    if (peek().type === 'RBRACE'){
        consume("RBRACE");
        return obj;
    }

    while (true){
        // parse one or more key-value pairs
        if (peek().type !== "STRING"){
            throw new Error(`Expected STRING but found ${peek()?.type || "EOF"}`);
        }
        const key = consume("STRING").value;

        consume("COLON");

        obj[key] = parseValue();

        if (peek().type === "COMMA"){
            consume("COMMA");
            continue;
        } 

        if (peek().type === "RBRACE"){
            consume("RBRACE");
            break;
        }
        throw new Error(`Expected COMMA or RBRACE but found ${peek()?.type || "EOF"}`);
    }
    return obj;
    }
    function parseArray(){
    consume("LBRACKET");
    const arr = [];

    if (peek().type === "RBRACKET"){
        consume("RBRACKET");
        return arr;
    }
    while (true){
        arr.push(parseValue());
        if (peek().type === "COMMA"){
            consume("COMMA");
            continue;
        }
        if (peek().type === "RBRACKET"){
            consume("RBRACKET");
            break;
        }
        throw new Error(`Expected COMMA or RBRACKET but found ${peek()?.type || "EOF"}`);
    }
    return arr;
    }

const result = parseValue();
consume("EOF");
return result;
}

// Main function to read a file, lex and parse its contents, and report validity

    function main() {
        const args = process.argv.slice(2);
        if (args.length !==1){
            console.error("Usage: node ccjsonparser.js <json-string>");
            process.exit(1);
        }
        const path = args[0];
        let contents;
        try {
            contents = fs.readFileSync(path, "utf8");
        } catch (e) {
            console.error(`Error: could not read file "${path}": ${e.message}`);
            process.exit(1);
        }

        const {tokens, error: lexError} = lex(contents);
        if (lexError) {
            console.error(`Invalid JSON in ${path}: ${lexError}`);
            process.exit(1);
        }

        try{
          const result =  parse(tokens);
            console.log(`Valid JSON in ${path}:`);
            console.log(JSON.stringify(result, null, 2));
            process.exit(0);
        } catch (e) {
            console.error(`Invalid JSON in ${path}: ${e.message}`);
            process.exit(1);
        }
    }

    if (require.main === module){
        main();
    }