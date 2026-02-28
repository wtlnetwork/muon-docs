import json

def format_for_json(raw_text: str) -> str:
    return json.dumps(raw_text.strip())[1:-1]

print("Paste your messy text below.")
print("When you are finished, type 'DONE' on a new blank line and press Enter.")
print("-" * 40)

lines = []
while True:
    try:
        line = input()
        if line.strip() == 'DONE':
            break
        lines.append(line)
    except EOFError:
        break

raw_notes = '\n'.join(lines)

if raw_notes:
    sanitized_output = format_for_json(raw_notes)
    print("\nHere is your JSON-safe string:")
    print("-" * 40)
    print(sanitized_output)
    print("-" * 40)
else:
    print("\nNothing to process!")