const fs = require('fs');

// Read the file
const filePath = './contexts/language-context.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find all duplicate keys
const lines = content.split('\n');
const keyCounts = {};
const duplicates = [];

lines.forEach((line, index) => {
  const match = line.match(/^\s*([^:]+):\s*"[^"]*",?\s*$/);
  if (match) {
    const key = match[1].trim();
    if (keyCounts[key]) {
      duplicates.push({ key, line: index + 1, content: line.trim() });
    } else {
      keyCounts[key] = 1;
    }
  }
});

console.log('Found duplicates:');
duplicates.forEach(dup => {
  console.log(`Line ${dup.line}: ${dup.content}`);
});

// Remove duplicate lines (keep first occurrence)
const seenKeys = new Set();
const newLines = [];

lines.forEach(line => {
  const match = line.match(/^\s*([^:]+):\s*"[^"]*",?\s*$/);
  if (match) {
    const key = match[1].trim();
    if (seenKeys.has(key)) {
      console.log(`Removing duplicate: ${line.trim()}`);
      return; // Skip this line
    } else {
      seenKeys.add(key);
    }
  }
  newLines.push(line);
});

// Write back to file
fs.writeFileSync(filePath, newLines.join('\n'));
console.log('Fixed duplicates in language-context.tsx');




