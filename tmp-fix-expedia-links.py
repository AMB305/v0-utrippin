import re

# Read the file
with open('src/data/utrippin_experiences.ts', 'r') as f:
    content = f.read()

# Replace all Expedia links that don't already have affiliate parameters
pattern = r'"bookingUrl": "(https://www\.expedia\.com/[^"?]+)(?!\?[^"]*(?:clickref|camref))"'
replacement = r'"bookingUrl": "\1?clickref=1110l15dQSW&camref=1110l15dQSW"'

updated_content = re.sub(pattern, replacement, content)

# Write back to file
with open('src/data/utrippin_experiences.ts', 'w') as f:
    f.write(updated_content)

print("Updated all Expedia links with affiliate parameters")
