import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CHAPTERS = [
  {
    id: "ch1", num: 1, title: "Functions, Abstraction, and Style",
    concepts: "Function definition, function calls, program counter, abstraction, imports.",
    psets: [
      {
        star: 1, title: "Banner Printer",
        objective: "Practice defining functions that call other functions, building layered abstraction.",
        steps: [
          "Define a function `print_banner(tool_name)` that prints a 3-line ASCII banner: a top border of `=` characters, the tool name centered, and a bottom border.",
          "Define three functions — `scan_header()`, `exploit_header()`, `report_header()` — that each call `print_banner` with a different tool name (e.g., \"NmapLite\", \"MetaSploit\", \"ReportGen\").",
          "Define a `main()` function that calls all three header functions in order.",
          "Call `main()` at the bottom of your script.",
          "Trace the program counter through your code on paper: number each line and write the order lines execute."
        ],
        example: `============================\n        NmapLite\n============================\n============================\n       MetaSploit\n============================\n============================\n        ReportGen\n============================`,
        starter: null,
        hints: "Use `print('=' * 28)` for borders. The `str.center(width)` method is useful for centering text.",
        drill: "Function definition, calling functions from functions, abstraction."
      },
      {
        star: 1, title: "Hash Dispatcher",
        objective: "Understand how the program counter moves through function calls and returns.",
        steps: [
          "Write `hash_md5()` that prints: `\"MD5:    5d41402abc4b2a76b9719d911017c592\"`",
          "Write `hash_sha1()` that prints: `\"SHA1:   aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d\"`",
          "Write `hash_sha256()` that prints: `\"SHA256: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824\"`",
          "Write `run_all_hashes()` that calls all three in order.",
          "Before running: number every line in your source file. On paper, write the sequence of line numbers the program counter visits. Then run and verify."
        ],
        example: `MD5:    5d41402abc4b2a76b9719d911017c592\nSHA1:   aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d\nSHA256: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824`,
        starter: `def hash_md5():\n    # print the MD5 example hash\n    pass\n\ndef hash_sha1():\n    # print the SHA1 example hash\n    pass\n\ndef hash_sha256():\n    # print the SHA256 example hash\n    pass\n\ndef run_all_hashes():\n    # call all three\n    pass\n\nrun_all_hashes()`,
        hints: null,
        drill: "Program counter tracing, function calls, sequencing."
      },
      {
        star: 2, title: "Modular Recon Script Skeleton",
        objective: "Build a multi-step workflow by composing smaller functions — the core of abstraction.",
        steps: [
          "Write `gather_dns()` → prints `\"[*] Gathering DNS records for target...\"`",
          "Write `gather_whois()` → prints `\"[*] Running WHOIS lookup...\"`",
          "Write `gather_ports()` → prints `\"[*] Scanning common ports (top 1000)...\"`",
          "Write `generate_report()` → prints `\"[*] Generating recon report...\"`",
          "Write `run_recon()` that calls all four functions in the order listed above.",
          "Write `run_recon_quiet()` that calls only `gather_dns()` and `gather_ports()` — skip WHOIS and report.",
          "In `main()`, call `run_recon()`, print a separator line, then call `run_recon_quiet()`. Observe the difference."
        ],
        example: `=== FULL RECON ===\n[*] Gathering DNS records for target...\n[*] Running WHOIS lookup...\n[*] Scanning common ports (top 1000)...\n[*] Generating recon report...\n\n=== QUIET RECON ===\n[*] Gathering DNS records for target...\n[*] Scanning common ports (top 1000)...`,
        starter: null,
        hints: "Think about why run_recon_quiet exists: in real tools, you often want a 'fast mode' that skips slow operations. Abstraction lets you remix steps without rewriting code.",
        drill: "Abstraction (hiding steps behind function names), composing workflows from functions."
      },
    ],
    applied: {
      star: 2, title: "Build a Hash Verifier CLI",
      libs: "hashlib",
      objective: "Use a real cryptographic library to verify file/message integrity — the foundation of digital forensics.",
      steps: [
        "Import `hashlib`.",
        "Define `compute_sha256(text)` that returns `hashlib.sha256(text.encode()).hexdigest()`.",
        "Define `verify_integrity(text, expected_hash)` that calls `compute_sha256(text)` and returns `True` if the result matches `expected_hash`, `False` otherwise.",
        "In `main()`: hardcode `message = \"The quick brown fox\"` and its known SHA256 hash. Call `verify_integrity` and print `\"INTACT\"` or `\"TAMPERED\"`.",
        "Test by changing one character in the message — the hash should no longer match."
      ],
      starter: `import hashlib\n\ndef compute_sha256(text):\n    \"\"\"Return the SHA-256 hex digest of a string.\"\"\"\n    return hashlib.sha256(text.encode()).hexdigest()\n\ndef verify_integrity(text, expected_hash):\n    \"\"\"Return True if text hashes to expected_hash.\"\"\"\n    # your code here\n    pass\n\ndef main():\n    message = "The quick brown fox"\n    known_hash = compute_sha256(message)  # compute it once\n    print(f"Message: {message}")\n    print(f"SHA-256: {known_hash}")\n\n    # Now verify\n    if verify_integrity(message, known_hash):\n        print("[OK] Message integrity INTACT")\n    else:\n        print("[!!] Message TAMPERED")\n\n    # Test with tampered message\n    tampered = "The quick brown Fox"  # capital F\n    if verify_integrity(tampered, known_hash):\n        print("[OK] Tampered message passed (BUG!)")\n    else:\n        print("[!!] Tampered message correctly detected")\n\nmain()`,
      example: `Message: The quick brown fox\nSHA-256: 5cac4f980fedc3d3f1f99b4be3472c9b30d56523e632d151237ec9309048bda9\n[OK] Message integrity INTACT\n[!!] Tampered message correctly detected`,
      stretch: "Modify `main()` to read the message from `input()` so you can test with different strings. Then add a loop that lets you check multiple messages until the user types 'quit'."
    }
  },
  {
    id: "ch2", num: 2, title: "Variables and Expressions",
    concepts: "Variables, assignment, data types (int, float, string, bool), expressions, operators, type casting.",
    psets: [
      {
        star: 1, title: "Entropy Estimator",
        objective: "Practice variable assignment and arithmetic expressions in a crypto context.",
        steps: [
          "Set `password_length = 12` and `charset_size = 94` (all printable ASCII).",
          "Compute `keyspace = charset_size ** password_length`. Print it.",
          "Import `log2` from `math`. Compute `entropy_bits = password_length * log2(charset_size)`. Print it rounded to 2 decimal places.",
          "Try different values: what happens with `charset_size = 26` (lowercase only)? With `password_length = 8`?"
        ],
        example: `Password length: 12\nCharset size:   94\nKeyspace:       475920314814253376475136\nEntropy:        78.66 bits`,
        starter: `from math import log2\n\npassword_length = 12\ncharset_size = 94\n\nkeyspace = charset_size ** password_length\nentropy_bits = password_length * log2(charset_size)\n\nprint(f"Password length: {password_length}")\nprint(f"Charset size:   {charset_size}")\nprint(f"Keyspace:       {keyspace}")\nprint(f"Entropy:        {entropy_bits:.2f} bits")`,
        hints: "Bits!",
        drill: "Variable assignment, exponentiation, importing math functions."
      },
      {
        star: 1, title: "Subnet Math",
        objective: "Use integer arithmetic to compute network addressing values.",
        steps: [
          "Set `total_bits = 32` and `prefix_length = 24`.",
          "Compute `host_bits = total_bits - prefix_length`.",
          "Compute `num_hosts = (2 ** host_bits) - 2` (subtract network and broadcast addresses).",
          "Compute `num_subnets = 2 ** prefix_length`.",
          "Print a formatted summary of all values.",
          "Try with `prefix_length = 16` and `prefix_length = 28`. What happens?"
        ],
        example: `Subnet Calculator\n-----------------\nPrefix length: /24\nHost bits:     8\nUsable hosts:  254\nTotal subnets: 16777216`,
        starter: null,
        hints: "The `-2` accounts for the network address (all host bits 0) and broadcast address (all host bits 1).",
        drill: "Integer arithmetic, variable assignment, expressions."
      },
      {
        star: 2, title: "XOR Cipher Preview",
        objective: "Understand XOR as a reversible operation — the foundation of many ciphers.",
        steps: [
          "Store `char = \"A\"`. Print it and its ASCII value using `ord(char)`.",
          "Store `key = 42`.",
          "Compute `encrypted = ord(char) ^ key`. Print the encrypted integer value.",
          "Compute `decrypted = encrypted ^ key`. Print the decrypted integer value.",
          "Convert back: `result = chr(decrypted)`. Print it and verify `result == char`.",
          "Try with different characters and keys. What happens when `key = 0`?"
        ],
        example: `Original char: A (ASCII: 65)\nKey:           42\nEncrypted:     107\nDecrypted:     65\nResult char:   A\nMatch: True`,
        starter: `char = "A"\nkey = 42\n\nprint(f"Original char: {char} (ASCII: {ord(char)})")\nprint(f"Key:           {key}")\n\nencrypted = ord(char) ^ key\nprint(f"Encrypted:     {encrypted}")\n\ndecrypted = encrypted ^ key\nprint(f"Decrypted:     {decrypted}")\n\nresult = chr(decrypted)\nprint(f"Result char:   {result}")\nprint(f"Match: {result == char}")`,
        hints: "XOR is its own inverse: `(A ^ K) ^ K = A`. This is why it's used in stream ciphers like RC4.",
        drill: "Variable assignment, XOR operator, type conversion with chr/ord."
      },
      {
        star: 2, title: "Time-to-Crack Calculator",
        objective: "Chain arithmetic expressions through multiple variable assignments.",
        steps: [
          "Set `hash_rate = 1_000_000_000` (1 billion hashes/sec) and `keyspace = 94 ** 8`.",
          "Compute `seconds_to_crack = keyspace / hash_rate`.",
          "Compute `hours = seconds_to_crack / 3600`.",
          "Compute `days = hours / 24`.",
          "Compute `years = days / 365.25`.",
          "Print each value with labels. Format large numbers with commas using `f\"{value:,.0f}\"`."
        ],
        example: `Hash rate:     1,000,000,000 H/s\nKeyspace:      6,095,689,385,410,816\nTime to crack: 6,095,689 seconds\n               1,693 hours\n               70.6 days\n               0.19 years`,
        starter: null,
        hints: "The underscore in `1_000_000_000` is just for readability — Python ignores it. Use f-strings with format specifiers: `f\"{value:,.2f}\"` for comma-separated decimals.",
        drill: "Arithmetic expressions, unit conversion, variable chaining."
      },
    ],
    applied: {
      star: 2, title: "Password Strength Scorer",
      libs: "string, math",
      objective: "Combine character class detection with entropy math to build a real password auditing tool.",
      steps: [
        "Import `string` and `math.log2`.",
        "Store a password in a variable.",
        "Check which character classes are present using `any(c in string.ascii_lowercase for c in password)` — repeat for uppercase, digits, punctuation.",
        "Compute `charset_size` by adding 26 for lowercase, 26 for uppercase, 10 for digits, 32 for punctuation (only if that class is present).",
        "Compute `entropy = len(password) * log2(charset_size)` (guard against `charset_size == 0`).",
        "Print the strength rating: < 28 bits = \"Very Weak\", < 36 = \"Weak\", < 60 = \"Moderate\", < 128 = \"Strong\", else \"Very Strong\"."
      ],
      starter: `import string\nfrom math import log2\n\ndef score_password(password):\n    charset_size = 0\n    if any(c in string.ascii_lowercase for c in password):\n        charset_size += 26\n    if any(c in string.ascii_uppercase for c in password):\n        charset_size += 26\n    if any(c in string.digits for c in password):\n        charset_size += 10\n    if any(c in string.punctuation for c in password):\n        charset_size += 32\n\n    if charset_size == 0:\n        return 0, "Empty", 0\n\n    entropy = len(password) * log2(charset_size)\n\n    if entropy < 28:\n        label = "Very Weak"\n    elif entropy < 36:\n        label = "Weak"\n    elif entropy < 60:\n        label = "Moderate"\n    elif entropy < 128:\n        label = "Strong"\n    else:\n        label = "Very Strong"\n\n    return entropy, label, charset_size\n\n# Test passwords\nfor pw in ["password", "P@ss1", "Tr0ub4dor&3", "correct horse battery staple"]:\n    entropy, label, cs = score_password(pw)\n    print(f"{pw:30s} | charset={cs:3d} | {entropy:6.1f} bits | {label}")`,
      example: `password                       | charset= 26 |   37.6 bits | Weak\nP@ss1                          | charset= 94 |   32.8 bits | Weak\nTr0ub4dor&3                    | charset= 94 |   72.1 bits | Strong\ncorrect horse battery staple   | charset= 52 |  159.7 bits | Very Strong`,
      stretch: "Wrap it in a `while True` loop that reads passwords from `input()` until the user types 'quit'. Print a bar chart of entropy using `#` characters."
    }
  },
  {
    id: "ch3", num: 3, title: "Loops and Conditions",
    concepts: "Boolean expressions, comparison operators, and/or/not, if/elif/else, while loops, loop patterns.",
    psets: [
      {
        star: 1, title: "Login Attempt Limiter",
        objective: "Build a login gate with a retry limit — the exact logic behind account lockout policies.",
        steps: [
          "Set `MAX_ATTEMPTS = 3` and `correct_password = \"s3cure!\"`.",
          "Set `attempts = 0`.",
          "Write a `while attempts < MAX_ATTEMPTS` loop.",
          "Inside the loop: prompt for password with `input(\"Password: \")`.",
          "If correct: print `\"[+] Access granted\"` and `break`.",
          "If wrong: increment `attempts`, print `f\"[-] Incorrect. {MAX_ATTEMPTS - attempts} attempts remaining.\"`",
          "After the loop: if `attempts == MAX_ATTEMPTS`, print `\"[!] Account locked. Contact admin.\"`"
        ],
        example: `Password: admin\n[-] Incorrect. 2 attempts remaining.\nPassword: password123\n[-] Incorrect. 1 attempts remaining.\nPassword: s3cure!\n[+] Access granted`,
        starter: `MAX_ATTEMPTS = 3\ncorrect_password = "s3cure!"\nattempts = 0\n\nwhile attempts < MAX_ATTEMPTS:\n    guess = input("Password: ")\n    if guess == correct_password:\n        print("[+] Access granted")\n        break\n    else:\n        attempts += 1\n        remaining = MAX_ATTEMPTS - attempts\n        print(f"[-] Incorrect. {remaining} attempts remaining.")\n\nif attempts == MAX_ATTEMPTS:\n    print("[!] Account locked. Contact admin.")`,
        hints: null,
        drill: "While loops, conditionals, break, counter variable."
      },
      {
        star: 1, title: "Port Classifier",
        objective: "Use if/elif/else to categorize numeric input — a pattern used in every network tool.",
        steps: [
          "Set `port = 443` (or any test value).",
          "Write an if/elif/else chain:\n  → 0–1023: print `\"Well-known port\"`\n  → 1024–49151: print `\"Registered port\"`\n  → 49152–65535: print `\"Dynamic/private port\"`\n  → Anything else: print `\"Invalid port number\"`",
          "Test with: 22, 80, 443, 8080, 49200, 70000, -1.",
          "Wrap it in a function `classify_port(port)` that returns the string instead of printing."
        ],
        example: `Port 22:    Well-known port\nPort 8080:  Registered port\nPort 49200: Dynamic/private port\nPort 70000: Invalid port number`,
        starter: null,
        hints: "Use compound conditions: `0 <= port <= 1023` is valid Python and reads like math.",
        drill: "if/elif/else chains, range comparisons."
      },
      {
        star: 2, title: "Brute-Force PIN Finder",
        objective: "See brute-force search in action — understand why short PINs are insecure.",
        steps: [
          "Set `target_pin = \"7392\"`.",
          "Set `attempt = 0`.",
          "Write a `while` loop from 0 to 9999.",
          "On each iteration, format the number as a 4-digit string: `guess = str(attempt).zfill(4)`.",
          "If `guess == target_pin`: print the PIN and total attempts, then `break`.",
          "Otherwise increment `attempt`.",
          "After the loop, print how many attempts were needed.",
          "Think: what is the worst case? The average case? How does this scale to 6-digit PINs?"
        ],
        example: `[*] Starting brute-force attack on 4-digit PIN...\n[+] PIN found: 7392\n[+] Attempts: 7393\n[*] Worst case: 10000 attempts`,
        starter: `target_pin = "7392"\nattempt = 0\n\nprint("[*] Starting brute-force attack on 4-digit PIN...")\n\nwhile attempt <= 9999:\n    guess = str(attempt).zfill(4)\n    if guess == target_pin:\n        print(f"[+] PIN found: {guess}")\n        print(f"[+] Attempts: {attempt + 1}")\n        break\n    attempt += 1\n\nprint(f"[*] Worst case: 10000 attempts")`,
        hints: "`str(42).zfill(4)` gives `\"0042\"`. The worst case is 10,000 attempts (4 digits × 10 options each).",
        drill: "While loops, string formatting, brute-force complexity."
      },
      {
        star: 2, title: "Log Severity Filter",
        objective: "Filter structured data by category — core to log analysis and SIEM rules.",
        steps: [
          "Create a list of 8+ log lines with mixed severity levels (INFO, WARNING, ERROR, CRITICAL).",
          "Loop through each line.",
          "Use `if \"ERROR\" in line or \"CRITICAL\" in line` to filter.",
          "Print only the matching lines, prefixed with `\"[!] \"`.",
          "Count and print the total number of high-severity events."
        ],
        example: `[*] Scanning 8 log entries...\n[!] ERROR: Failed password for admin from 45.33.32.156\n[!] CRITICAL: Root shell spawned on 10.0.1.5\n[!] ERROR: Segfault in auth module\n\n[*] Found 3 high-severity events out of 8 total.`,
        starter: `logs = [\n    "INFO: User alice logged in",\n    "INFO: File downloaded: report.pdf",\n    "WARNING: Disk usage at 85%",\n    "ERROR: Failed password for admin from 45.33.32.156",\n    "INFO: Backup completed successfully",\n    "CRITICAL: Root shell spawned on 10.0.1.5",\n    "WARNING: SSL certificate expires in 7 days",\n    "ERROR: Segfault in auth module",\n]\n\n# Your filtering code here`,
        hints: null,
        drill: "Iteration, string methods, conditional filtering."
      },
    ],
    applied: {
      star: 3, title: "Caesar Cipher Brute Forcer",
      libs: "string",
      objective: "Break a classical cipher by exhaustive search — your first cryptanalysis tool.",
      steps: [
        "Store the ciphertext: `\"Wkh txlfn eurzq ira mxpshg ryhu wkh odcb grj\"`.",
        "Loop through shifts 1–25.",
        "For each shift, decrypt every character: if it's a letter, shift it back by the current amount (wrapping with modular arithmetic). Preserve case and non-letter characters.",
        "Print each candidate plaintext with its shift number.",
        "Bonus: score each candidate by counting how many of the letters are in `\"etaoins\"` (most common English letters). Flag the highest-scoring candidate."
      ],
      starter: `ciphertext = "Wkh txlfn eurzq ira mxpshg ryhu wkh odcb grj"\n\ndef decrypt_caesar(text, shift):\n    result = ""\n    for char in text:\n        if char.isalpha():\n            base = ord('A') if char.isupper() else ord('a')\n            shifted = (ord(char) - base - shift) % 26 + base\n            result += chr(shifted)\n        else:\n            result += char\n    return result\n\ndef score_english(text):\n    \"\"\"Count common English letters as a rough plaintext score.\"\"\"\n    return sum(1 for c in text.lower() if c in "etaoins")\n\nbest_score = 0\nbest_shift = 0\nbest_text = ""\n\nfor shift in range(1, 26):\n    candidate = decrypt_caesar(ciphertext, shift)\n    score = score_english(candidate)\n    marker = " <<<" if score > best_score else ""\n    print(f"Shift {shift:2d}: {candidate}{marker}")\n    if score > best_score:\n        best_score = score\n        best_shift = shift\n        best_text = candidate\n\nprint(f"\\n[+] Most likely plaintext (shift={best_shift}):")\nprint(f"    {best_text}")`,
      example: `Shift  1: Vjg swkem dtqyp hqz lworgf qxgt vjg ncza fqi\nShift  2: Uif rvdjl cspxo gpy kvnqfe pwfs uif mbyZ eph\nShift  3: The quick brown fox jumped over the lazy dog <<<\n...\n\n[+] Most likely plaintext (shift=3):\n    The quick brown fox jumped over the lazy dog`,
      stretch: "Wrap the whole thing in a `while True` loop where the user pastes ciphertext and gets all 25 candidates."
    }
  },
  {
    id: "ch4", num: 4, title: "Debugging",
    concepts: "Syntax errors, runtime errors, logic errors, debugging strategies, print debugging, tracing.",
    psets: [
      {
        star: 1, title: "Bug Hunt: Firewall Rules",
        objective: "Identify and fix three categories of bugs: syntax, runtime, and logic.",
        steps: [
          "Read the buggy code carefully (printed below).",
          "Find Bug 1 (syntax): two colons are missing from function/if definitions.",
          "Find Bug 2 (runtime): `port` is an int but gets concatenated with a string using `+`.",
          "Find Bug 3 (logic): even the `else` branch has the same type issue — but also check if the output messages make sense.",
          "Fix all three bugs. Run the code with test inputs: `(\"192.168.1.1\", 22)` and `(\"10.0.0.5\", 80)`."
        ],
        example: `--- Buggy code ---\ndef check_firewall(ip, port)       # BUG 1: missing colon\n    blocked_ports = [22, 23, 3389]\n    if port in blocked_ports        # BUG 1: missing colon\n        print(ip + " blocked on port " + port)  # BUG 2: int + str\n    else:\n        print(ip + " allowed on port " + str(port))\n\n--- Fixed output ---\n192.168.1.1 blocked on port 22\n10.0.0.5 allowed on port 80`,
        starter: `# BUGGY CODE — find and fix 3 bugs\ndef check_firewall(ip, port)\n    blocked_ports = [22, 23, 3389]\n    if port in blocked_ports\n        print(ip + " blocked on port " + port)\n    else:\n        print(ip + " allowed on port " + str(port))\n\ncheck_firewall("192.168.1.1", 22)`,
        hints: "Bug categories: (1) SyntaxError — Python can't even parse the code, (2) TypeError — wrong types in an operation, (3) Logic — code runs but produces wrong output.",
        drill: "Identifying syntax, runtime, and logic errors."
      },
      {
        star: 2, title: "Trace the Incident",
        objective: "Predict program output by manually tracing execution — the core debugging skill.",
        steps: [
          "Read the code below. Do NOT run it yet.",
          "On paper, make a table with columns: `threat_level`, `escalated`, and `output`.",
          "Trace each iteration of the while loop, updating the table.",
          "Write your predicted output.",
          "Now run the code and compare."
        ],
        starter: `threat_level = 3\nescalated = False\nwhile threat_level > 0:\n    print("Threat level:", threat_level)\n    if threat_level == 2:\n        escalated = True\n    threat_level = threat_level - 1\nprint("Escalated:", escalated)`,
        example: `Threat level: 3\nThreat level: 2\nThreat level: 1\nEscalated: True`,
        hints: "The key question: does `escalated` ever become True? Trace when `threat_level == 2` — yes, it does. It stays True because nothing sets it back to False.",
        drill: "Manual tracing, while loop execution, state tracking."
      },
      {
        star: 2, title: "Off-By-One in a Scanner",
        objective: "Spot a boundary error — the most common bug in security tools and exploits.",
        steps: [
          "Read the code. The comment says it should scan ports 80 through 85 inclusive.",
          "Trace the while loop: what values does `port` take?",
          "Identify the bug: `while port < end` stops before port 85.",
          "Fix it: change `<` to `<=`.",
          "Think: in what real-world scenario does an off-by-one error in a port scanner cause a missed vulnerability?"
        ],
        starter: `# BUG: should scan 80, 81, 82, 83, 84, 85\nstart = 80\nend = 85\nport = start\nwhile port < end:  # <-- off by one!\n    print("Scanning port", port)\n    port = port + 1`,
        example: `# Buggy output (misses port 85):\nScanning port 80\nScanning port 81\nScanning port 82\nScanning port 83\nScanning port 84\n\n# Fixed output (includes port 85):\nScanning port 80\nScanning port 81\nScanning port 82\nScanning port 83\nScanning port 84\nScanning port 85`,
        hints: "The fix: `while port <= end`. Off-by-one errors in scanners can mean missing an open port where a critical service is running.",
        drill: "Off-by-one errors, boundary conditions."
      },
    ],
    applied: {
      star: 2, title: "Debug a Broken Log Parser",
      libs: "standard I/O",
      objective: "Fix 5 real bugs in a log parser — practice systematic debugging on code you didn't write.",
      steps: [
        "First, create a test file `server.log` with the sample data below.",
        "Read the buggy code and try to run it. Fix bugs in the order Python reports them.",
        "Bug 1: Missing comma in dictionary literal.",
        "Bug 2: Missing comma in `open()` arguments.",
        "Bug 3: Missing colon on `if` statement.",
        "Bug 4: Verify the counting logic is correct (it is, once syntax is fixed).",
        "Bug 5: File is never closed — add `file.close()` or use a `with` block.",
        "Document each bug in a comment explaining what went wrong and what the error message was."
      ],
      starter: `# BUGGY CODE — find and fix 5 bugs\ndef parse_logs(filename):\n    counts = {"INFO": 0, "WARNING": 0, "ERROR": 0 "CRITICAL": 0}  # Bug 1\n    file = open(filename "r")  # Bug 2\n    for line in file:\n        for level in counts:\n            if level in line  # Bug 3\n                counts[level] = counts[level] + 1\n                break\n    print(counts)\n    # Bug 5: forgot to close file\n\nparse_logs("server.log")\n\n# --- Create this test file as server.log ---\n# INFO: Server started on port 8080\n# INFO: User alice logged in\n# WARNING: High memory usage detected\n# ERROR: Failed to connect to database\n# INFO: Request processed in 230ms\n# CRITICAL: Unauthorized root access detected\n# ERROR: SSL handshake failed\n# WARNING: Deprecated API endpoint called\n# INFO: User alice logged out\n# CRITICAL: Disk failure on /dev/sda1`,
      example: `{'INFO': 4, 'WARNING': 2, 'ERROR': 2, 'CRITICAL': 2}`,
      stretch: null
    }
  },
  {
    id: "ch5", num: 5, title: "Parameters, Return Values, and Scope",
    concepts: "Formal/actual parameters, return values, local variables, scope, passing by value vs. reference.",
    psets: [
      {
        star: 1, title: "Hash Function Wrapper",
        objective: "Write a function that returns (not prints) a value — the caller decides what to do with it.",
        steps: [
          "Import `hashlib`.",
          "Define `hash_string(text, algorithm)` that takes a string and an algorithm name (\"md5\", \"sha1\", \"sha256\").",
          "Inside: use `hashlib.new(algorithm)` to create a hash object, update it with `text.encode()`, and return `.hexdigest()`.",
          "In `main()`, call `hash_string(\"hello\", \"sha256\")` and store the result in a variable. Print it from `main()`, not from the function.",
          "Call it with all three algorithms on the same input and print results."
        ],
        example: `MD5:    5d41402abc4b2a76b9719d911017c592\nSHA1:   aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d\nSHA256: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824`,
        starter: `import hashlib\n\ndef hash_string(text, algorithm):\n    \"\"\"Return the hex digest of text using the given algorithm.\"\"\"\n    h = hashlib.new(algorithm)\n    h.update(text.encode())\n    return h.hexdigest()\n\n# Caller decides what to do with the return value\nfor algo in ["md5", "sha1", "sha256"]:\n    result = hash_string("hello", algo)\n    print(f"{algo.upper():8s}{result}")`,
        hints: "`hashlib.new(name)` creates a hash object for any supported algorithm by name string.",
        drill: "Parameters, return values, caller-callee contract."
      },
      {
        star: 2, title: "IP Validator",
        objective: "Decompose validation logic into small, testable helper functions.",
        steps: [
          "Define `is_valid_octet(s)` that returns `True` if `s` is a string representing an integer 0–255. Handle non-numeric strings with a try/except or `.isdigit()` check.",
          "Define `is_valid_ipv4(ip_string)` that:\n  → Splits on \".\"\n  → Checks there are exactly 4 parts\n  → Checks each part passes `is_valid_octet()`\n  → Returns `True` or `False`",
          "Test with: `\"192.168.1.1\"` (valid), `\"256.1.1.1\"` (invalid octet), `\"10.0.0\"` (too few octets), `\"10.0.0.1.5\"` (too many), `\"abc.def.ghi.jkl\"` (not numbers)."
        ],
        example: `192.168.1.1    -> Valid\n256.1.1.1      -> Invalid\n10.0.0         -> Invalid\n10.0.0.1.5     -> Invalid\nabc.def.ghi.jkl -> Invalid`,
        starter: `def is_valid_octet(s):\n    \"\"\"Return True if s represents an integer 0-255.\"\"\"\n    if not s.isdigit():\n        return False\n    return 0 <= int(s) <= 255\n\ndef is_valid_ipv4(ip_string):\n    \"\"\"Return True if ip_string is a valid IPv4 address.\"\"\"\n    parts = ip_string.split(".")\n    if len(parts) != 4:\n        return False\n    return all(is_valid_octet(p) for p in parts)\n\n# Test cases\ntest_ips = ["192.168.1.1", "256.1.1.1", "10.0.0",\n            "10.0.0.1.5", "abc.def.ghi.jkl", "0.0.0.0"]\nfor ip in test_ips:\n    status = "Valid" if is_valid_ipv4(ip) else "Invalid"\n    print(f"{ip:20s} -> {status}")`,
        hints: null,
        drill: "Return values, helper functions, boolean returns."
      },
      {
        star: 2, title: "Scope Trap",
        objective: "Understand local vs. global scope — and why global mutable state is a security risk.",
        steps: [
          "Read the code below. Predict the output on paper before running.",
          "Run it. Was your prediction correct?",
          "Modify `encrypt()` to use `global key` so it changes the outer variable. Run again.",
          "Write a comment (3+ sentences) explaining why `global` is dangerous in security-critical code. Consider: what if two functions both modify a global encryption key?"
        ],
        starter: `key = "outside"\n\ndef encrypt():\n    key = "inside"  # This creates a LOCAL variable\n    print("In encrypt():", key)\n\nencrypt()\nprint("After encrypt():", key)\n\n# Expected output:\n# In encrypt(): inside\n# After encrypt(): outside\n#\n# With 'global key' added inside encrypt():\n# In encrypt(): inside\n# After encrypt(): inside`,
        example: `# WITHOUT global:\nIn encrypt(): inside\nAfter encrypt(): outside\n\n# WITH global:\nIn encrypt(): inside\nAfter encrypt(): inside`,
        hints: "Security implication: if encryption key is global, any function anywhere in the codebase can accidentally overwrite it. In large codebases, this creates hard-to-trace bugs where data gets encrypted with the wrong key.",
        drill: "Scope rules, global keyword, security implications."
      },
      {
        star: 2, title: "CVSS Score Calculator",
        objective: "Practice function composition — one function's output feeds into another's input.",
        steps: [
          "Define `compute_cvss_base(attack_vector, complexity, impact)` that takes three floats and returns a weighted score: `(attack_vector * 0.4 + complexity * 0.3 + impact * 0.3) * 10`.",
          "Define `severity_label(score)` that returns: \"None\" (0), \"Low\" (0.1–3.9), \"Medium\" (4.0–6.9), \"High\" (7.0–8.9), \"Critical\" (9.0–10.0).",
          "In `main()`: compute a score with sample values, pass it to `severity_label()`, print both.",
          "Test with at least 3 different input combinations."
        ],
        example: `CVSS Base Score: 7.2 (High)\nCVSS Base Score: 3.5 (Low)\nCVSS Base Score: 9.4 (Critical)`,
        starter: null,
        hints: "The real CVSS formula is more complex — this is simplified. The key concept is that `severity_label(compute_cvss_base(...))` chains two functions together.",
        drill: "Multiple parameters, return values, function composition."
      },
    ],
    applied: {
      star: 3, title: "Modular Password Generator",
      libs: "secrets, string",
      objective: "Build a cryptographically secure password generator with zero global state.",
      steps: [
        "Import `secrets` and `string`.",
        "`generate_password(length, use_upper, use_digits, use_symbols)` → builds a charset from the boolean flags, returns a password using `secrets.choice()` in a loop.",
        "`check_strength(password)` → returns a score 0–4 based on: length ≥ 12, has upper, has lower, has digit, has symbol.",
        "`main()` → calls both, prints the password and its strength score.",
        "Research: why is `secrets.choice()` safer than `random.choice()` for password generation? (Hint: PRNG vs CSPRNG)."
      ],
      starter: `import secrets\nimport string\n\ndef generate_password(length=16, use_upper=True, use_digits=True, use_symbols=True):\n    \"\"\"Generate a cryptographically secure random password.\"\"\"\n    charset = string.ascii_lowercase\n    if use_upper:\n        charset += string.ascii_uppercase\n    if use_digits:\n        charset += string.digits\n    if use_symbols:\n        charset += string.punctuation\n\n    return "".join(secrets.choice(charset) for _ in range(length))\n\ndef check_strength(password):\n    \"\"\"Return a strength score 0-4.\"\"\"\n    score = 0\n    if len(password) >= 12:\n        score += 1\n    if any(c in string.ascii_uppercase for c in password):\n        score += 1\n    if any(c in string.digits for c in password):\n        score += 1\n    if any(c in string.punctuation for c in password):\n        score += 1\n    return score\n\ndef main():\n    pw = generate_password(length=20)\n    strength = check_strength(pw)\n    labels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"]\n    print(f"Password: {pw}")\n    print(f"Strength: {labels[strength]} ({strength}/4)")\n\nmain()`,
      example: `Password: kQ7#mR2$xP9&nL4@wJ6!\nStrength: Very Strong (4/4)`,
      stretch: "Add a `--length` and `--no-symbols` command-line interface using `sys.argv` or `input()` prompts."
    }
  },
  {
    id: "ch6", num: 6, title: "Animation; Mouse and Keyboard Input",
    concepts: "Animation loops, state updates, event handling, keyboard/mouse callbacks.",
    psets: [
      {
        star: 1, title: "Simulated Packet Counter",
        objective: "Build a live-updating loop with timed delays — the architecture behind every monitoring dashboard.",
        steps: [
          "Import `sleep` from `time`.",
          "Set `packet_count = 0`.",
          "Write a `while True` loop that increments `packet_count`, prints it with a label, and calls `sleep(0.5)`.",
          "Stop after 20 packets using a `break` or condition.",
          "Observe the live-updating output — this is how real packet counters work."
        ],
        example: `[001] Packet captured\n[002] Packet captured\n...\n[020] Packet captured\n[*] Capture complete: 20 packets`,
        starter: `from time import sleep\n\npacket_count = 0\nwhile packet_count < 20:\n    packet_count += 1\n    print(f"[{packet_count:03d}] Packet captured")\n    sleep(0.5)\nprint(f"[*] Capture complete: {packet_count} packets")`,
        hints: "The `sleep()` call is what turns a fast loop into a visible animation. Real tools use non-blocking I/O instead.",
        drill: "While loops with sleep, counter variables, formatted output."
      },
      {
        star: 2, title: "Keylogger Awareness Demo",
        objective: "Understand event capture by building a simplified input recorder — then discuss why real keyloggers are different.",
        steps: [
          "Create an empty list `history = []`.",
          "Write a `while True` loop that calls `input('> ')`.",
          "Append each entry to `history`.",
          "If the user types `\"quit\"`, break out of the loop.",
          "After the loop, print the full history with timestamps (use `datetime.now()`).",
          "Write a comment (3+ sentences) explaining: how does a real keylogger differ from this? (Hint: kernel hooks, no visible prompt, stealth.)"
        ],
        example: `> hello world\n> my password is hunter2\n> quit\n\n--- Captured Input History ---\n[14:23:01] hello world\n[14:23:05] my password is hunter2\n[14:23:08] quit`,
        starter: `from datetime import datetime\n\nhistory = []\nprint("Type anything (type 'quit' to stop):")\nwhile True:\n    entry = input("> ")\n    history.append((datetime.now().strftime("%H:%M:%S"), entry))\n    if entry == "quit":\n        break\n\nprint("\\n--- Captured Input History ---")\nfor ts, text in history:\n    print(f"[{ts}] {text}")`,
        hints: "Real keyloggers use OS-level hooks (e.g., SetWindowsHookEx on Windows) to capture keystrokes globally without any visible prompt.",
        drill: "Input loops, list accumulation, event recording."
      },
      {
        star: 2, title: "Network Traffic Simulator",
        objective: "Generate randomized structured events in a loop — the core of any traffic generator or fuzzer.",
        steps: [
          "Import `random` and `sleep` from `time`.",
          "Define lists: `SRC_IPS`, `DST_IPS`, `PORTS`, `PROTOCOLS`.",
          "Write a loop that runs 30 iterations.",
          "Each iteration: randomly pick src, dst, port, protocol, and a random size (64–2048 bytes).",
          "Print each packet in a formatted row with a timestamp.",
          "Add `sleep(0.3)` between iterations.",
          "After the loop, print total packets and total bytes."
        ],
        example: `[14:23:01] 192.168.1.50 -> 10.0.0.1    | TCP  :443  | 1240 B\n[14:23:01] 10.0.0.5    -> 172.16.0.3  | UDP  :53   |  128 B\n...\n[*] 30 packets, 28,450 bytes total`,
        starter: null,
        hints: "Use `random.choice(list)` to pick from predefined values and `random.randint(64, 2048)` for sizes.",
        drill: "Randomized event generation, formatted output, animation-style loops."
      },
    ],
    applied: {
      star: 3, title: "Live Log Tailer",
      libs: "os, time",
      objective: "Simulate `tail -f` — watch a file for new lines and highlight threats in real time.",
      steps: [
        "Open a log file and seek to the end with `file.seek(0, 2)`.",
        "In a `while True` loop, call `file.readline()`.",
        "If the line is non-empty, print it with a timestamp prefix.",
        "If the line contains `\"ERROR\"` or `\"CRITICAL\"`, prefix with `[!]`.",
        "If no new line, `sleep(1)` and try again.",
        "Test by manually appending lines to the file from another terminal."
      ],
      starter: `import time\nfrom datetime import datetime\n\ndef tail_file(filename):\n    with open(filename, "r") as f:\n        f.seek(0, 2)  # seek to end\n        print(f"[*] Tailing {filename}... (Ctrl+C to stop)")\n        while True:\n            line = f.readline()\n            if line:\n                line = line.strip()\n                ts = datetime.now().strftime("%H:%M:%S")\n                if "ERROR" in line or "CRITICAL" in line:\n                    print(f"[!] {ts} | {line}")\n                else:\n                    print(f"    {ts} | {line}")\n            else:\n                time.sleep(1)\n\ntail_file("server.log")`,
      example: `[*] Tailing server.log... (Ctrl+C to stop)\n    14:30:01 | INFO: User alice logged in\n[!] 14:30:05 | ERROR: Failed auth from 45.33.32.156\n    14:30:08 | INFO: Backup completed`,
      stretch: "Write a second script that appends random log entries to the file every 2 seconds, so you can watch the tailer in action."
    }
  },
  {
    id: "ch7", num: 7, title: "Lists and For-Loops",
    concepts: "List creation, indexing, iteration, len(), append(), for loops, range().",
    psets: [
      {
        star: 1, title: "IP Allowlist Checker",
        objective: "Use list membership testing — the simplest form of access control.",
        steps: [
          "Create a list `allowed_ips = [\"10.0.1.5\", \"10.0.1.10\", \"192.168.1.1\"]`.",
          "Set `request_ip = \"10.0.1.5\"` (test value).",
          "Write a `for` loop that checks if `request_ip` matches any entry.",
          "Print `\"ALLOW\"` if found, `\"DENY\"` if not.",
          "Test with IPs both in and not in the list.",
          "Refactor using `if request_ip in allowed_ips` and compare."
        ],
        example: `Checking 10.0.1.5 against allowlist...\n[+] ALLOW: 10.0.1.5 is authorized\n\nChecking 45.33.32.156 against allowlist...\n[-] DENY: 45.33.32.156 is not authorized`,
        starter: null,
        hints: "Python's `in` operator on lists does a linear scan — O(n). Fine for small lists, but a dictionary would be O(1).",
        drill: "List creation, membership testing, for loops."
      },
      {
        star: 1, title: "Port Scanner Simulation",
        objective: "Iterate over a list with index access using `range(len())`.",
        steps: [
          "Create `open_ports = [22, 80, 443, 8080, 3306]`.",
          "Create a parallel list `services = [\"ssh\", \"http\", \"https\", \"http-proxy\", \"mysql\"]`.",
          "Use `for i in range(len(open_ports))` to loop with indices.",
          "Print a formatted status report: port number, service name, and state.",
          "Add a conditional: if port is 3306, print `\"[!] Database exposed!\"`."
        ],
        example: `PORT     SERVICE      STATE\n22/tcp   ssh          open\n80/tcp   http         open\n443/tcp  https        open\n8080/tcp http-proxy   open\n3306/tcp mysql        open  [!] Database exposed!`,
        starter: null,
        hints: "Use f-strings with width specifiers for alignment: `f\"{port:<8d}\"`.",
        drill: "Parallel lists, range(len()), indexed iteration."
      },
      {
        star: 2, title: "Frequency Analysis",
        objective: "Build a character frequency counter — the first step in breaking substitution ciphers.",
        steps: [
          "Create a list of 26 zeros: `freq = [0] * 26`.",
          "Store a ciphertext string in a variable.",
          "Loop through each character in the ciphertext.",
          "For each letter, compute its index: `idx = ord(c.lower()) - ord('a')`.",
          "Increment `freq[idx]`.",
          "Print a bar chart: each letter followed by `#` characters proportional to its count.",
          "Identify the most common letter — in English, it's likely `e`."
        ],
        example: `a: ########  (8)\nb: ##  (2)\nc: ####  (4)\n...\ne: ############  (12)\n...\n[*] Most common: 'e' (12 occurrences)`,
        starter: `ciphertext = "wkh txlfn eurzq ira mxpshg ryhu wkh odcb grj"\nfreq = [0] * 26\n\nfor c in ciphertext:\n    if c.isalpha():\n        idx = ord(c.lower()) - ord('a')\n        freq[idx] += 1\n\nfor i in range(26):\n    letter = chr(ord('a') + i)\n    bar = "#" * freq[i]\n    if freq[i] > 0:\n        print(f"{letter}: {bar}  ({freq[i]})")\n\nbest = max(range(26), key=lambda i: freq[i])\nprint(f"\\n[*] Most common: '{chr(ord('a') + best)}' ({freq[best]} occurrences)")`,
        hints: "If the most common letter maps to 'e', the shift is `ord(most_common) - ord('e')`. This is how frequency analysis breaks Caesar ciphers.",
        drill: "List indexing, character math with ord(), accumulator pattern."
      },
      {
        star: 2, title: "Firewall Rule Engine",
        objective: "Model structured data as a list of lists and evaluate rules with first-match logic.",
        steps: [
          "Create rules as a list of lists: `[[\"ALLOW\", \"192.168.1.0/24\", 80], [\"DENY\", \"10.0.0.0/8\", 22], ...]`.",
          "Write `evaluate(rules, ip, port)` that loops through rules.",
          "For each rule, check if the IP starts with the subnet prefix (simplified) and the port matches.",
          "Return the action of the first matching rule.",
          "If no rule matches, return `\"DENY\"` (default deny).",
          "Test with several IP/port combinations."
        ],
        example: `192.168.1.50:80  -> ALLOW (matched rule 0)\n10.0.0.5:22      -> DENY  (matched rule 1)\n172.16.0.1:443   -> DENY  (default — no match)`,
        starter: null,
        hints: "Real firewalls use CIDR math for subnet matching. Here, `ip.startswith(\"192.168.1.\")` is a valid simplification for /24 subnets.",
        drill: "List of lists, first-match evaluation, for loop with early return."
      },
    ],
    applied: {
      star: 3, title: "Hex Dump Viewer",
      libs: "struct",
      objective: "Read binary files and display them like `xxd` or HxD — a core forensics skill.",
      steps: [
        "Open a file in binary mode: `data = open(filename, 'rb').read()`.",
        "Loop through `data` in chunks of 16 bytes using `range(0, len(data), 16)`.",
        "For each chunk, print: the offset in hex, each byte as a 2-digit hex value, and the ASCII representation (printable chars or `.` for non-printable).",
        "Use `chr(b) if 32 <= b < 127 else '.'` for the ASCII column.",
        "Format the output to match standard hex dump tools.",
        "Test on a PNG, a text file, and a compiled Python `.pyc` file."
      ],
      starter: `import sys\n\ndef hex_dump(filename):\n    with open(filename, "rb") as f:\n        data = f.read()\n    \n    for offset in range(0, len(data), 16):\n        chunk = data[offset:offset+16]\n        hex_part = " ".join(f"{b:02x}" for b in chunk)\n        ascii_part = "".join(chr(b) if 32 <= b < 127 else "." for b in chunk)\n        # Pad hex_part if chunk < 16 bytes\n        hex_part = hex_part.ljust(47)\n        print(f"{offset:08x}  {hex_part}  |{ascii_part}|")\n\nif len(sys.argv) > 1:\n    hex_dump(sys.argv[1])\nelse:\n    print("Usage: python hexdump.py <filename>")`,
      example: `00000000  89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52  |.PNG........IHDR|\n00000010  00 00 02 00 00 00 02 00 08 06 00 00 00 f4 78 d4  |..............x.|`,
      stretch: "Add a `--search` flag that highlights bytes matching a given hex pattern (e.g., `--search 504b0304` to find ZIP headers)."
    }
  },
  {
    id: "ch8", num: 8, title: "Reading and Writing Text Files",
    concepts: "open(), read modes, for line in file, write(), close(), string processing.",
    psets: [
      {
        star: 1, title: "Log Line Counter",
        objective: "Read a file line-by-line and count matches — the simplest log analysis task.",
        steps: [
          "Open a text file with `open(filename, 'r')`.",
          "Loop through each line with `for line in file`.",
          "Count how many lines contain the word `\"FAILED\"`.",
          "Print the total count.",
          "Close the file (or use a `with` block)."
        ],
        example: `[*] Scanning auth.log...\n[*] Found 7 lines containing 'FAILED'\n[*] Total lines processed: 42`,
        starter: null,
        hints: "Use `if \"FAILED\" in line:` for simple substring matching. The `with open(...) as f:` pattern auto-closes the file.",
        drill: "File reading, line iteration, string searching, counting."
      },
      {
        star: 2, title: "IOC Extractor",
        objective: "Parse unstructured text to extract indicators of compromise (IOCs) — a real threat intel task.",
        steps: [
          "Read a text file (a mock threat report).",
          "Loop through each line, split on spaces.",
          "For each token, check if it looks like an IPv4 address: 4 dot-separated groups, each numeric and 0–255.",
          "Collect unique IPs in a list (skip duplicates).",
          "Write the unique IPs to a new file `iocs.txt`, one per line.",
          "Print how many unique IPs were extracted."
        ],
        example: `[*] Scanning report.txt for IOCs...\n[*] Extracted 5 unique IPv4 addresses:\n    45.33.32.156\n    185.220.101.1\n    93.184.216.34\n    10.0.1.5\n    172.16.0.100\n[*] Written to iocs.txt`,
        starter: null,
        hints: "Use `part.isdigit() and 0 <= int(part) <= 255` to validate each octet. Check `len(parts) == 4` after splitting on `.`.",
        drill: "File I/O, string splitting, validation, deduplication."
      },
      {
        star: 2, title: "Config File Parser",
        objective: "Parse structured key=value files — the format used by INI files, `.env` files, and tool configs.",
        steps: [
          "Read a config file where each line is `key=value` (skip blank lines and comments starting with `#`).",
          "Split each line on `=` (only the first `=` — values might contain `=`).",
          "Store keys in one list, values in another (parallel lists).",
          "Print all settings in a formatted table.",
          "Write a `get_config(key)` function that searches the keys list and returns the corresponding value."
        ],
        example: `--- Configuration ---\nserver_ip      = 10.0.1.5\nserver_port    = 8443\nlog_level      = DEBUG\nmax_retries    = 3\napi_key        = sk-abc123def456`,
        starter: null,
        hints: "Use `line.split('=', 1)` to split on only the first `=`. Strip whitespace from both key and value.",
        drill: "File parsing, string splitting, parallel lists, lookup functions."
      },
      {
        star: 2, title: "Apache Log Field Splitter",
        objective: "Parse real-world log formats and compute aggregate statistics.",
        steps: [
          "Read an Apache access log file (one request per line).",
          "For each line, extract: IP address (first field), HTTP method, requested path, and status code.",
          "Track unique IPs in a list and count requests per IP.",
          "Print a summary: total requests, unique IPs, and the top requester.",
          "Write the summary to an output file."
        ],
        example: `[*] Parsed 150 requests from access.log\n[*] 12 unique IP addresses\n[*] Top requester: 192.168.1.50 (47 requests)\n[*] Status breakdown: 200=120, 404=18, 500=12`,
        starter: `# Sample Apache log line:\n# 192.168.1.50 - - [15/Mar/2026:02:14:33 +0000] "GET /index.html HTTP/1.1" 200 4523\n\ndef parse_access_log(filename):\n    ips = []\n    ip_counts = []  # parallel list\n    with open(filename) as f:\n        for line in f:\n            parts = line.split()\n            if len(parts) < 7:\n                continue\n            ip = parts[0]\n            method = parts[5].strip('"')\n            path = parts[6]\n            status = parts[8]\n            # Track IP counts\n            if ip in ips:\n                idx = ips.index(ip)\n                ip_counts[idx] += 1\n            else:\n                ips.append(ip)\n                ip_counts.append(1)\n    # Print summary\n    print(f"Unique IPs: {len(ips)}")\n    top_idx = ip_counts.index(max(ip_counts))\n    print(f"Top requester: {ips[top_idx]} ({ip_counts[top_idx]} requests)")`,
        hints: "Apache combined log format has a fixed structure. The IP is always field 0, method is field 5 (with a leading quote), status is field 8.",
        drill: "File parsing, field extraction, parallel list aggregation."
      },
    ],
    applied: {
      star: 3, title: "YARA Rule Generator",
      libs: "hashlib, os",
      objective: "Generate detection signatures from file hashes — how malware analysts build YARA rules.",
      steps: [
        "Read a text file listing malware sample file paths (one per line).",
        "For each path, open the file in binary mode and compute its SHA256 hash.",
        "Also record the file size.",
        "Generate a YARA rule string with the hashes as conditions.",
        "Write the YARA rule to an output `.yar` file.",
        "Print a summary of how many samples were processed."
      ],
      starter: `import hashlib\nimport os\n\ndef hash_file(filepath):\n    sha = hashlib.sha256()\n    with open(filepath, "rb") as f:\n        for chunk in iter(lambda: f.read(4096), b""):\n            sha.update(chunk)\n    return sha.hexdigest()\n\ndef generate_yara(sample_paths, rule_name="malware_samples"):\n    hashes = []\n    for path in sample_paths:\n        path = path.strip()\n        if os.path.exists(path):\n            h = hash_file(path)\n            hashes.append(h)\n            print(f"  {h}  {path}")\n    \n    rule = f"rule {rule_name} {{\\n"\n    rule += "    condition:\\n"\n    conditions = [f'        hash.sha256(0, filesize) == \"{h}\"' for h in hashes]\n    rule += " or\\n".join(conditions)\n    rule += "\\n}\\n"\n    return rule\n\n# Read sample list and generate rule\nwith open("samples.txt") as f:\n    paths = f.readlines()\n\nrule = generate_yara(paths)\nwith open("detect.yar", "w") as f:\n    f.write(rule)\nprint(f"\\n[*] YARA rule written to detect.yar")`,
      example: `  abc123...  samples/trojan1.bin\n  def456...  samples/dropper2.exe\n  789abc...  samples/backdoor3.dll\n\n[*] YARA rule written to detect.yar`,
      stretch: "Add file size conditions to the rule. Also generate an MD5 and SHA1 for each sample and include them as comments in the YARA rule."
    }
  },
  {
    id: "ch9", num: 9, title: "Nested Loops",
    concepts: "Loops inside loops, 2D iteration patterns, grid processing.",
    psets: [
      {
        star: 1, title: "Brute-Force 2-Char Passwords",
        objective: "See how nested loops create combinatorial explosion — the math behind brute-force attacks.",
        steps: [
          "Import `string`.",
          "Use two nested `for` loops over `string.ascii_lowercase`.",
          "Print every 2-character combination: aa, ab, ..., zz.",
          "Count and print the total (should be 676).",
          "Think: how many combinations for 3 characters? 4? What's the pattern?"
        ],
        example: `aa ab ac ... az\nba bb bc ... bz\n...\nza zb zc ... zz\n\n[*] Total 2-char passwords: 676`,
        starter: null,
        hints: "26 × 26 = 676. For 3 chars: 26³ = 17,576. For 8 chars: 26⁸ ≈ 209 billion. This is why longer passwords matter.",
        drill: "Nested for loops, combinatorial counting."
      },
      {
        star: 2, title: "Port Sweep Across Hosts",
        objective: "Use nested loops to scan a matrix of hosts × ports — the structure of every network scanner.",
        steps: [
          "Define `hosts = [\"10.0.1.1\", \"10.0.1.2\", \"10.0.1.3\"]`.",
          "Define `ports = [22, 80, 443, 3306, 8080]`.",
          "Use nested loops to print `\"Scanning {host}:{port}\"` for each combination.",
          "Add a simulated result: randomly mark each as open or closed.",
          "Print a summary table: hosts as rows, ports as columns."
        ],
        example: `          22    80   443  3306  8080\n10.0.1.1   O     O     O     X     X\n10.0.1.2   X     O     O     X     O\n10.0.1.3   O     X     O     O     X`,
        starter: null,
        hints: "Use `random.choice(['O', 'X'])` for simulation. Format with f-strings using width specifiers.",
        drill: "Nested loops, 2D output formatting, host × port iteration."
      },
      {
        star: 2, title: "Substitution Cipher Table",
        objective: "Generate a Vigenère tabula recta — a 26×26 grid built with nested loops.",
        steps: [
          "Use an outer loop for shifts 0–25.",
          "Use an inner loop for letters A–Z.",
          "For each cell, compute the shifted letter: `chr(ord('A') + (col + row) % 26)`.",
          "Print each row as a single line of characters.",
          "Add a header row showing A–Z."
        ],
        example: `  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n0 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n1 B C D E F G H I J K L M N O P Q R S T U V W X Y Z A\n2 C D E F G H I J K L M N O P Q R S T U V W X Y Z A B`,
        starter: null,
        hints: "The key operation is `(col + row) % 26` — modular arithmetic keeps everything in the 0–25 range.",
        drill: "Nested loops, modular arithmetic, 2D grid generation."
      },
      {
        star: 3, title: "Pixel Steganography Prep",
        objective: "Manipulate a 2D grid of values at the bit level — the foundation of LSB steganography.",
        steps: [
          "Create a 10×10 grid of random integers 0–255 (use nested loops and `random.randint`).",
          "Print the grid (the 'before' image).",
          "Use nested loops to flip the least significant bit of every value to 0: `val = val & 0xFE`.",
          "Print the grid again (the 'after' image).",
          "Count how many values changed. What percentage?",
          "Think: if you replaced those LSBs with message bits, would the image look different to the eye?"
        ],
        example: `Before:\n142 201  77 255 ...\n 88  33 190 101 ...\n\nAfter:\n142 200  76 254 ...\n 88  32 190 100 ...\n\n[*] 52 of 100 values changed (52%)`,
        starter: null,
        hints: "`val & 0xFE` clears the LSB (sets bit 0 to 0). `val | 0x01` sets it to 1. Each change alters the value by at most 1 — imperceptible in an image.",
        drill: "Nested loops, 2D grid processing, bitwise operations."
      },
    ],
    applied: {
      star: 3, title: "Network Mapper Grid",
      libs: "socket (optional)",
      objective: "Build a host × port scan matrix — a simplified version of what Nmap does.",
      steps: [
        "Take a /24 subnet prefix (e.g., `\"192.168.1\"`) and a list of ports.",
        "Use nested loops: outer over hosts 1–254, inner over all ports.",
        "For the simulation version: randomly assign open/closed.",
        "For the real version: use `socket.connect_ex((ip, port))` with a short timeout.",
        "Output a grid: hosts as rows, ports as columns, O for open, X for closed.",
        "Print summary statistics: total open ports, most-open host."
      ],
      starter: `import random\n\ndef scan_network(subnet, ports):\n    results = []\n    for host in range(1, 255):\n        ip = f"{subnet}.{host}"\n        row = []\n        for port in ports:\n            # Simulation: random open/closed\n            is_open = random.random() < 0.1  # 10% chance open\n            row.append("O" if is_open else "X")\n        results.append((ip, row))\n    return results\n\nports = [22, 80, 443, 3306, 8080]\nresults = scan_network("10.0.1", ports)\n\n# Print header\nprint(f"{'':<16s}", end="")\nfor p in ports:\n    print(f"{p:<6d}", end="")\nprint()\n\n# Print rows (only hosts with at least 1 open port)\nfor ip, row in results:\n    if "O" in row:\n        print(f"{ip:<16s}", end="")\n        for cell in row:\n            print(f"{cell:<6s}", end="")\n        print()`,
      example: `                22    80    443   3306  8080\n10.0.1.3        X     O     O     X     X\n10.0.1.15       O     X     X     X     X\n10.0.1.42       X     O     O     X     O`,
      stretch: "Use `socket.connect_ex()` with a 0.5s timeout for real scanning (only on your own network!). Add a `--top-ports 100` mode."
    }
  },
  {
    id: "ch10", num: 10, title: "Physical Simulation",
    concepts: "State variables, time steps, update rules, modeling change over time.",
    psets: [
      {
        star: 2, title: "Worm Propagation Model",
        objective: "Model exponential growth and saturation — the math behind every worm outbreak.",
        steps: [
          "Set `N = 1000` (total hosts), `infected = 1`, `susceptible = N - 1`.",
          "Set `p = 0.01` (infection probability per contact) and `contacts = 5` (contacts per step).",
          "Write a loop for 50 time steps.",
          "Each step: compute `new_infections = infected * contacts * p * (susceptible / N)` (round to int).",
          "Update `infected += new_infections` and `susceptible -= new_infections`.",
          "Print the counts each step. Observe the S-curve."
        ],
        example: `Step  0: S=999   I=1\nStep  1: S=999   I=1\nStep  5: S=990   I=10\nStep 15: S=850   I=150\nStep 30: S=200   I=800\nStep 50: S=5     I=995`,
        starter: null,
        hints: "The `(susceptible / N)` term is what creates the S-curve — as more hosts are infected, there are fewer left to infect.",
        drill: "State variables, simulation loop, update rules."
      },
      {
        star: 2, title: "DDoS Traffic Ramp",
        objective: "Simulate exponential attack growth with a mitigation threshold — model attack/defense dynamics.",
        steps: [
          "Set `rate = 100` (requests/sec), `step = 0`, `mitigation_active = False`.",
          "Set `THRESHOLD = 10000`.",
          "Loop for 30 time steps.",
          "Every 5 steps, double the rate: `if step % 5 == 0: rate *= 2`.",
          "If `rate > THRESHOLD` and mitigation is not active: activate it, reduce rate by 80%.",
          "Print rate each step with a visual bar using `#` characters."
        ],
        example: `Step  0: ####  (400 req/s)\nStep  5: ########  (800 req/s)\nStep 10: ################  (3200 req/s)\nStep 15: [!] MITIGATION ACTIVATED\n         ######  (1280 req/s)`,
        starter: null,
        hints: "The rate *= 2 every 5 steps models botnet recruitment. The 80% reduction models what happens when a CDN or scrubbing service kicks in.",
        drill: "Exponential growth, threshold detection, state transitions."
      },
      {
        star: 3, title: "Password Cracking Time Estimator",
        objective: "Simulate hardware degradation over time — why cracking isn't as fast as raw hashrate suggests.",
        steps: [
          "Set `keyspace`, `rate = 10_000_000_000` (H/s), `degradation = 0.02` (2% per hour).",
          "Set `hashes_done = 0`, `hour = 0`.",
          "Loop: each iteration = 1 hour. Add `rate * 3600` to `hashes_done`. Then `rate *= (1 - degradation)`.",
          "When `hashes_done >= keyspace`, print the hour and break.",
          "Print progress percentage every 10 hours.",
          "Compare: how much longer does degradation add vs. constant rate?"
        ],
        example: `Hour  0: 0.00% done (rate: 10.00 GH/s)\nHour 10: 12.3% done (rate: 8.17 GH/s)\nHour 20: 22.1% done (rate: 6.68 GH/s)\n...\n[*] Keyspace exhausted at hour 47 (vs 39 hours at constant rate)`,
        starter: null,
        hints: "Thermal throttling is real — GPUs slow down as they heat up. This is why cracking benchmarks overestimate real-world speed.",
        drill: "Simulation with degradation, cumulative tracking, comparison analysis."
      },
    ],
    applied: {
      star: 3, title: "Epidemic-Model Botnet Simulator",
      libs: "standard library",
      objective: "Build an SIR model for botnet propagation — see how patching speed determines outbreak severity.",
      steps: [
        "Define S, I, R populations. Set β (infection rate) and γ (recovery/patching rate).",
        "Loop for 200 time steps.",
        "Each step: compute `new_infected = β * S * I / N` and `new_recovered = γ * I`.",
        "Update S, I, R accordingly.",
        "Print a text-based chart each step: `S` as dots, `I` as `#`, `R` as `=`, scaled to 50 chars.",
        "Experiment: β=0.3/γ=0.05 vs β=0.3/γ=0.15."
      ],
      starter: `N = 1000\nS, I, R = N - 1, 1, 0\nbeta = 0.3\ngamma = 0.05\n\nfor step in range(200):\n    new_i = beta * S * I / N\n    new_r = gamma * I\n    S -= new_i\n    I += new_i - new_r\n    R += new_r\n    S = max(S, 0)\n    \n    # Text chart (scaled to 50 chars)\n    scale = 50 / N\n    bar_s = "." * int(S * scale)\n    bar_i = "#" * int(I * scale)\n    bar_r = "=" * int(R * scale)\n    if step % 10 == 0:\n        print(f"t={step:3d} S={int(S):4d} I={int(I):4d} R={int(R):4d} |{bar_s}{bar_i}{bar_r}|")\n\nprint(f"\\nFinal: S={int(S)}, I={int(I)}, R={int(R)}")`,
      example: `t=  0 S= 999 I=   1 R=   0 |................................................#|
t= 20 S= 800 I= 150 R=  50 |........................................#######===|
t= 50 S= 200 I= 400 R= 400 |..........####################====================|
t=100 S=  10 I=  50 R= 940 |##=============================================|`,
      stretch: "Run both β/γ scenarios and print a side-by-side comparison showing how faster patching (higher γ) reduces peak infection."
    }
  },
  {
    id: "ch11", num: 11, title: "Classes and Objects",
    concepts: "Class definition, __init__, instance variables, methods, encapsulation.",
    psets: [
      {
        star: 1, title: "Credential Class",
        objective: "Define a class with instance variables and a display method — encapsulation basics.",
        steps: [
          "Define a class `Credential` with `__init__(self, username, password_hash, service)`.",
          "Store all three as instance variables.",
          "Write a `display()` method that prints the username and service, but truncates the hash to first 8 chars + `...` (never print full hashes).",
          "Create 3 `Credential` objects and call `display()` on each."
        ],
        example: `Username: admin    | Service: SSH      | Hash: 5d41402a...\nUsername: root     | Service: MySQL    | Hash: 2cf24dba...\nUsername: alice    | Service: VPN      | Hash: aaf4c61d...`,
        starter: null,
        hints: "The truncation pattern `self.password_hash[:8] + '...'` is a real security practice — logs should never contain full credentials.",
        drill: "Class definition, __init__, instance variables, methods."
      },
      {
        star: 2, title: "Packet Class",
        objective: "Model structured network data as objects with behavior.",
        steps: [
          "Define `Packet` with `src_ip, dst_ip, src_port, dst_port, protocol, payload`.",
          "Write `is_http()` → returns `True` if dst_port is 80 or 443.",
          "Write `is_dns()` → returns `True` if dst_port is 53.",
          "Write `summary()` → returns a formatted one-line string.",
          "Create a list of 5+ Packet objects. Loop through and print summaries.",
          "Filter: print only HTTP packets."
        ],
        example: `All packets:\n  TCP 192.168.1.50:49201 -> 10.0.0.1:443     (HTTPS)\n  UDP 10.0.0.5:12345    -> 8.8.8.8:53        (DNS)\n  TCP 192.168.1.50:49202 -> 10.0.0.1:80      (HTTP)\n\nHTTP packets only:\n  TCP 192.168.1.50:49201 -> 10.0.0.1:443\n  TCP 192.168.1.50:49202 -> 10.0.0.1:80`,
        starter: null,
        hints: "The `is_http()` / `is_dns()` pattern encapsulates classification logic — callers don't need to know which ports map to which protocols.",
        drill: "Methods that return booleans, object lists, filtering."
      },
      {
        star: 2, title: "FirewallRule and Firewall Classes",
        objective: "Use composition — one class holds a list of another class's objects.",
        steps: [
          "Define `FirewallRule` with `action`, `src_ip`, `dst_port`. Write `matches(packet)` that takes a Packet object and returns True if the rule applies.",
          "Define `Firewall` with a list of `FirewallRule` objects.",
          "Write `evaluate(packet)` that loops through rules and returns the first matching action.",
          "If no rule matches, return `\"DENY\"` (default deny policy).",
          "Test with 5+ rules and 5+ packets."
        ],
        example: `Evaluating: TCP 192.168.1.50 -> :443\n  Rule 0 (ALLOW :443): MATCH\n  Result: ALLOW\n\nEvaluating: TCP 45.33.32.156 -> :22\n  Rule 0 (ALLOW :443): no match\n  Rule 1 (DENY  :22):  MATCH\n  Result: DENY`,
        starter: null,
        hints: "This is composition: `Firewall` has-a list of `FirewallRule` objects. The `evaluate` method delegates to each rule's `matches` method.",
        drill: "Composition, object interaction, first-match evaluation."
      },
      {
        star: 3, title: "HashTable Class (Preview)",
        objective: "Implement a hash table with chaining — understand how Python dictionaries work internally.",
        steps: [
          "Define `HashTable` with `__init__(self, size=16)` that creates a list of `size` empty lists.",
          "Write `_hash(self, key)` that returns `hash(key) % self.size`.",
          "Write `put(self, key, value)` that appends `(key, value)` to the correct bucket (or updates if key exists).",
          "Write `get(self, key)` that searches the bucket and returns the value (or `None`).",
          "Test: store 10 key-value pairs, retrieve them, handle collisions."
        ],
        example: `ht.put("admin", "5d41402a")\nht.put("root", "2cf24dba")\nht.get("admin")  -> "5d41402a"\nht.get("unknown") -> None`,
        starter: null,
        hints: "Chaining means each bucket is a list of (key, value) pairs. On collision, just append to the list. On lookup, scan the list linearly.",
        drill: "Class with internal data structure, hashing, collision handling."
      },
    ],
    applied: {
      star: 3, title: "Incident Tracker OOP System",
      libs: "datetime",
      objective: "Build a multi-class system for incident management — the architecture of every ticketing tool.",
      steps: [
        "Define `Incident(id, severity, description, timestamp)` with methods `escalate()`, `resolve()`, `__str__()`.",
        "Define `IncidentQueue()` with a list of Incidents: `add(incident)`, `get_next()` (highest severity first), `summary()`.",
        "Define `Analyst(name, incidents_handled)` with `handle(incident)` method.",
        "In `main()`: create 5+ incidents, queue them, assign analysts, print a report."
      ],
      starter: `from datetime import datetime\n\nclass Incident:\n    def __init__(self, id, severity, description):\n        self.id = id\n        self.severity = severity\n        self.description = description\n        self.timestamp = datetime.now()\n        self.status = "Open"\n    \n    def escalate(self):\n        self.severity = min(self.severity + 1, 5)\n        self.status = "Escalated"\n    \n    def resolve(self):\n        self.status = "Resolved"\n    \n    def __str__(self):\n        return f"[{self.id}] P{self.severity} {self.status}: {self.description}"\n\nclass IncidentQueue:\n    def __init__(self):\n        self.incidents = []\n    \n    def add(self, incident):\n        self.incidents.append(incident)\n    \n    def get_next(self):\n        if not self.incidents:\n            return None\n        # Find highest severity\n        best = max(self.incidents, key=lambda i: i.severity)\n        self.incidents.remove(best)\n        return best\n    \n    def summary(self):\n        for inc in self.incidents:\n            print(f"  {inc}")\n\nclass Analyst:\n    def __init__(self, name):\n        self.name = name\n        self.handled = []\n    \n    def handle(self, incident):\n        incident.resolve()\n        self.handled.append(incident)\n        print(f"{self.name} resolved: {incident}")`,
      example: `[INC-001] P5 Open: Unauthorized root access\n[INC-002] P3 Open: Failed login attempts\n[INC-003] P4 Open: Malware detected\n\nAnalyst Alice handling highest priority...\nAlice resolved: [INC-001] P5 Resolved: Unauthorized root access`,
      stretch: "Add `created_at` and `resolved_at` timestamps. Compute mean time to resolution (MTTR) per analyst."
    }
  },
  {
    id: "ch12", num: 12, title: "Recursion",
    concepts: "Base case, recursive case, call stack, recursive thinking.",
    psets: [
      {
        star: 1, title: "Recursive Directory Listing",
        objective: "Traverse a file tree recursively — the structure behind every file integrity monitor.",
        steps: [
          "Import `os`.",
          "Write `list_files(path, depth=0)` that prints all entries in the directory, indented by `depth`.",
          "For each entry, if it's a directory, recurse with `depth + 1`.",
          "If it's a file, just print it.",
          "Test on a directory with at least 2 levels of nesting."
        ],
        example: `project/\n  src/\n    main.py\n    utils.py\n  data/\n    samples/\n      malware1.bin\n      malware2.bin\n    config.json\n  README.md`,
        starter: `import os\n\ndef list_files(path, depth=0):\n    indent = "  " * depth\n    print(f"{indent}{os.path.basename(path)}/")\n    for entry in sorted(os.listdir(path)):\n        full = os.path.join(path, entry)\n        if os.path.isdir(full):\n            list_files(full, depth + 1)\n        else:\n            print(f"{indent}  {entry}")\n\nlist_files(".")`,
        hints: "The base case is implicit: if the directory has no subdirectories, no recursive calls are made.",
        drill: "Recursion with depth tracking, filesystem traversal."
      },
      {
        star: 2, title: "Recursive Binary Search for IP",
        objective: "Implement binary search recursively — the same algorithm firewalls use for blocklist lookup.",
        steps: [
          "Create a sorted list of blocked IPs (as strings, sorted lexicographically or as integers).",
          "Write `find_ip(ip_list, target, low, high)` with the standard recursive binary search structure.",
          "Base case: `low > high` → return -1.",
          "Recursive case: compare middle element, recurse left or right.",
          "Test with IPs in and not in the list."
        ],
        example: `Searching for 192.168.1.50 in blocklist of 11 IPs...\n  Checking middle: 172.16.0.100\n  Target is greater, searching right half...\n  Checking middle: 192.168.1.50\n  FOUND at index 7`,
        starter: null,
        hints: "For numeric sorting, convert IPs to integers first: `ip_to_int(\"192.168.1.1\") = 192*256³ + 168*256² + 1*256 + 1`.",
        drill: "Recursive binary search, base case/recursive case."
      },
      {
        star: 2, title: "Recursive XOR Decrypt",
        objective: "Process data byte-by-byte using recursion instead of a loop.",
        steps: [
          "Write `xor_decrypt(data, key, index=0)` that XORs one byte at position `index` and recurses.",
          "Base case: `index == len(data)` → return empty string.",
          "Recursive case: XOR `data[index]` with `key`, convert to char, concatenate with recursive result.",
          "Test by encrypting a message, then decrypting it.",
          "Think: why would you use recursion here instead of a loop? (Answer: you wouldn't in practice — this is for understanding the call stack.)"
        ],
        example: `Original:  Hello World\nEncrypted: [42, 47, 38, 38, 37, 106, 61, 37, 44, 38, 46]\nDecrypted: Hello World`,
        starter: null,
        hints: "The recursive version is O(n) in stack depth — for long data, it would hit Python's recursion limit. Loops are better here. But understanding this helps with tree/graph recursion later.",
        drill: "Recursive data processing, base case identification."
      },
      {
        star: 3, title: "Recursive Subdomain Enumerator",
        objective: "Traverse a tree structure recursively to enumerate all combinations.",
        steps: [
          "Represent DNS zones as nested lists: `[[\"www\", \"mail\"], \"example\", [\"com\", \"org\"]]`.",
          "Write a recursive function that assembles all fully qualified domain names.",
          "Base case: a plain string → return it as a single-element list.",
          "Recursive case: a list → for each element, recurse and combine results.",
          "Output all possible FQDNs."
        ],
        example: `www.example.com\nwww.example.org\nmail.example.com\nmail.example.org`,
        starter: null,
        hints: "This is like generating all paths through a tree. At each level, you branch for each option and combine with the results from deeper levels.",
        drill: "Tree traversal, recursive combination generation."
      },
    ],
    applied: {
      star: 3, title: "Recursive File Hasher",
      libs: "os, hashlib",
      objective: "Recursively hash every file in a directory tree — the core of file integrity monitoring.",
      steps: [
        "Write `hash_file(filepath)` that returns the SHA256 hex digest of a file.",
        "Write `hash_tree(root)` that recursively traverses all files, hashes each, and collects results.",
        "Output a manifest: `hash  filepath` (like `sha256sum` format).",
        "Bonus: detect duplicates (same hash, different paths) and flag them."
      ],
      starter: `import os\nimport hashlib\n\ndef hash_file(filepath):\n    sha = hashlib.sha256()\n    with open(filepath, "rb") as f:\n        for chunk in iter(lambda: f.read(4096), b""):\n            sha.update(chunk)\n    return sha.hexdigest()\n\ndef hash_tree(root, results=None):\n    if results is None:\n        results = []\n    for entry in sorted(os.listdir(root)):\n        full = os.path.join(root, entry)\n        if os.path.isdir(full):\n            hash_tree(full, results)\n        elif os.path.isfile(full):\n            h = hash_file(full)\n            results.append((h, full))\n    return results\n\nmanifest = hash_tree(".")\nfor h, path in manifest:\n    print(f"{h}  {path}")\n\n# Duplicate detection\nhashes = {}\nfor h, path in manifest:\n    hashes.setdefault(h, []).append(path)\nfor h, paths in hashes.items():\n    if len(paths) > 1:\n        print(f"\\n[!] Duplicates (hash {h[:16]}...):")\n        for p in paths:\n            print(f"    {p}")`,
      example: `abc123...  ./src/main.py\ndef456...  ./src/utils.py\nabc123...  ./backup/main.py.bak\n\n[!] Duplicates (hash abc123...):\n    ./src/main.py\n    ./backup/main.py.bak`,
      stretch: "Save the manifest to a file. On a second run, compare against the saved manifest and flag new, modified, or deleted files."
    }
  },
  {
    id: "ch13", num: 13, title: "Sorting",
    concepts: "Selection sort, insertion sort, comparisons, swaps.",
    psets: [
      {
        star: 1, title: "Sort IPs Numerically",
        objective: "Write a custom sort key — because lexicographic IP sorting is wrong.",
        steps: [
          "Create a list of IPv4 address strings.",
          "Write a function `ip_sort_key(ip)` that returns a tuple of 4 ints.",
          "Sort the list using your key function.",
          "Print before and after. Verify `\"10.0.0.2\"` comes before `\"10.0.0.10\"`.",
          "Note: lexicographic sort puts `\"10.0.0.10\"` before `\"10.0.0.2\"` — wrong!"
        ],
        example: `Before: ['192.168.1.1', '10.0.0.10', '10.0.0.2', '172.16.0.1']\nAfter:  ['10.0.0.2', '10.0.0.10', '172.16.0.1', '192.168.1.1']`,
        starter: null,
        hints: "`ip_sort_key(\"10.0.0.2\")` should return `(10, 0, 0, 2)`. Tuple comparison in Python works element-by-element.",
        drill: "Custom sort keys, tuple comparison."
      },
      {
        star: 2, title: "Sort Log Entries by Timestamp",
        objective: "Parse timestamps from strings and sort by them — the first step of timeline analysis.",
        steps: [
          "Create a list of log entry strings with embedded timestamps.",
          "Write a key function that extracts and parses the timestamp.",
          "Sort the entries chronologically.",
          "Print the sorted log.",
          "Don't use Python's built-in `sort()` — implement insertion sort."
        ],
        example: `Before:\n  [14:30:00] User logged out\n  [14:28:15] File downloaded\n  [14:29:00] Failed auth\n\nAfter:\n  [14:28:15] File downloaded\n  [14:29:00] Failed auth\n  [14:30:00] User logged out`,
        starter: null,
        hints: "If timestamps are in `HH:MM:SS` format, you can compare them as strings directly (lexicographic order works for zero-padded times).",
        drill: "Insertion sort implementation, timestamp parsing."
      },
      {
        star: 2, title: "Insertion Sort on Severity",
        objective: "Implement insertion sort from scratch on structured data.",
        steps: [
          "Create a list of `(severity_score, incident_id)` tuples.",
          "Implement insertion sort that sorts by severity descending.",
          "Do NOT use Python's built-in `sort()` or `sorted()`.",
          "Count the number of comparisons and swaps.",
          "Print the sorted list and the counts."
        ],
        example: `Before: [(3, 'INC-01'), (5, 'INC-02'), (1, 'INC-03'), (4, 'INC-04')]\nAfter:  [(5, 'INC-02'), (4, 'INC-04'), (3, 'INC-01'), (1, 'INC-03')]\nComparisons: 6, Shifts: 4`,
        starter: null,
        hints: "For descending order, shift elements right while `arr[j][0] < key[0]` (instead of `>`).",
        drill: "Insertion sort implementation, comparison counting."
      },
      {
        star: 3, title: "Timing Attack Visualization",
        objective: "Demonstrate why constant-time string comparison matters in security.",
        steps: [
          "Write `naive_compare(a, b)` that compares character-by-character and returns the number of comparisons made before a mismatch.",
          "Set a target password. Create a list of 10 guesses.",
          "For each guess, record how many comparisons `naive_compare` takes.",
          "Sort guesses by comparison count (more comparisons = closer match).",
          "Print the ranking. Observe: the correct prefix leaks through timing."
        ],
        example: `Target: s3cure!\nGuess        Comparisons\nxxxxxxx      1\nabcdefg      1\ns3cure!      7  <<<\ns3cret!      4\ns3xxxxx      2\n\n[!] Timing side-channel: comparison count reveals prefix matches.`,
        starter: `def naive_compare(a, b):\n    comparisons = 0\n    for i in range(min(len(a), len(b))):\n        comparisons += 1\n        if a[i] != b[i]:\n            return comparisons, False\n    comparisons += 1  # length check\n    return comparisons, len(a) == len(b)\n\ntarget = "s3cure!"\nguesses = ["xxxxxxx", "s3cret!", "s3cure!", "abcdefg", "s3xxxxx",\n           "s3curex", "s3cure?", "s######", "sx#####", "s3c####"]\n\nresults = []\nfor g in guesses:\n    comps, match = naive_compare(target, g)\n    results.append((comps, g, match))\n\nresults.sort(reverse=True)\nprint(f"Target: {target}")\nprint(f"{'Guess':<12s} {'Comparisons':<14s} {'Match'}")\nfor comps, g, match in results:\n    marker = " <<<" if match else ""\n    print(f"{g:<12s} {comps:<14d} {match}{marker}")`,
        hints: "This is why `hmac.compare_digest()` exists — it always takes the same time regardless of where the mismatch is.",
        drill: "Custom comparison functions, sorting by computed metrics, security implications."
      },
    ],
    applied: {
      star: 3, title: "Log Correlation Engine",
      libs: "standard library",
      objective: "Merge-sort logs from multiple sources into a unified timeline — what SIEMs do.",
      steps: [
        "Read log files from 3+ sources (auth.log, access.log, firewall.log).",
        "Parse timestamps from each log format.",
        "Implement merge sort from scratch (no `sorted()`).",
        "Output a single chronological timeline.",
        "Count comparisons to verify O(n log n) behavior."
      ],
      starter: null,
      example: `[*] Reading 3 log files (42 + 38 + 25 = 105 entries)\n[*] Merge sort: 523 comparisons (O(n log n) ≈ 700)\n\nUnified Timeline:\n2026-03-15 02:14:30 | firewall  | CONN_ALLOWED 45.33.32.156 -> 10.0.1.5:22\n2026-03-15 02:14:33 | auth      | LOGIN_FAIL admin from 45.33.32.156\n2026-03-15 02:14:35 | auth      | LOGIN_FAIL admin from 45.33.32.156\n2026-03-15 02:14:38 | auth      | LOGIN_SUCCESS admin from 45.33.32.156\n2026-03-15 02:15:20 | firewall  | CONN_ALLOWED 10.0.1.5 -> 185.220.101.1:443`,
      stretch: "Implement quicksort too and compare comparison counts. Does stability matter on your test data?"
    }
  },
  {
    id: "ch14", num: 14, title: "Analyzing Algorithms",
    concepts: "Big-O notation, counting operations, linear vs. quadratic vs. logarithmic.",
    psets: [
      {
        star: 1, title: "Complexity Identification",
        objective: "Identify Big-O complexity of common security operations.",
        steps: [
          "For each function below, identify its Big-O and explain in a comment:",
          "Linear search through a blocklist → O(?)",
          "Checking all pairs of IPs for duplicates (nested loop) → O(?)",
          "Binary search on a sorted IP list → O(?)",
          "Looking up a hash in a Python dictionary → O(?)",
          "Write each function, add a counter variable that increments on each 'operation', and verify your analysis by running on different input sizes."
        ],
        example: `Linear search (n=1000):    1000 operations  → O(n)\nPairwise check (n=1000):   499500 operations → O(n²)\nBinary search (n=1000):    10 operations     → O(log n)\nDict lookup (n=1000):      1 operation       → O(1)`,
        starter: null,
        hints: "For pairwise: n*(n-1)/2 comparisons. For binary search: log₂(1000) ≈ 10.",
        drill: "Big-O identification, empirical verification."
      },
      {
        star: 2, title: "Empirical Timing",
        objective: "Measure algorithm performance empirically and see Big-O predictions in real data.",
        steps: [
          "Implement linear search and binary search.",
          "Generate sorted lists of sizes: 1,000, 10,000, 100,000, 1,000,000.",
          "Search for a worst-case element (not in list) using both algorithms.",
          "Time each using `time.time()` or `time.perf_counter()`.",
          "Print a table of results.",
          "Observe: binary search time barely changes as n grows."
        ],
        example: `Size        Linear      Binary\n1,000       0.0001s     0.0000s\n10,000      0.0012s     0.0000s\n100,000     0.0115s     0.0000s\n1,000,000   0.1150s     0.0000s`,
        starter: null,
        hints: "Binary search on 1M elements: ~20 comparisons. Linear search: 1M comparisons. The difference is dramatic.",
        drill: "Empirical timing, algorithm comparison, table formatting."
      },
      {
        star: 2, title: "Why Bcrypt Is Slow On Purpose",
        objective: "Understand computational cost as a security feature.",
        steps: [
          "Write a comment/docstring (10+ lines) explaining why bcrypt's O(2^cost) time is intentional.",
          "Compute: time to brute-force a 10-char password at 100 H/s (bcrypt) vs 10 billion H/s (SHA-256).",
          "Set `charset = 94`, `length = 10`.",
          "Compute keyspace and time for both hash rates.",
          "Print the comparison.",
          "Discuss: what 'cost factor' would make bcrypt infeasible even with future hardware?"
        ],
        example: `SHA-256 at 10B H/s:\n  Keyspace: 5.39e+19\n  Time: 5,386,918 seconds ≈ 62 days\n\nbcrypt at 100 H/s:\n  Keyspace: 5.39e+19\n  Time: 5.39e+17 seconds ≈ 17 billion years\n\n[!] bcrypt is 100,000,000x slower per hash — by design.`,
        starter: null,
        hints: "bcrypt's cost factor is logarithmic: cost=12 means 2¹² = 4096 rounds. Each increment doubles the time.",
        drill: "Complexity analysis applied to security, large-number arithmetic."
      },
    ],
    applied: {
      star: 3, title: "Algorithm Benchmark Suite",
      libs: "time, random",
      objective: "Build a benchmarking tool that compares search algorithms on IOC data at scale.",
      steps: [
        "Implement linear search, binary search, and dictionary lookup.",
        "Generate random IOC lists (IP strings) of sizes: 1K, 10K, 100K, 1M.",
        "Time each search method across all sizes (average over 100 searches).",
        "Print a formatted comparison table.",
        "Write a comment recommending which approach a SOC analyst should use for a 1M-entry blocklist."
      ],
      starter: null,
      example: `IOC Blocklist Search Benchmark (avg of 100 searches)\n─────────────────────────────────────────────────────\nSize       Linear       Binary       Dict\n1,000      0.050ms      0.003ms      0.001ms\n10,000     0.510ms      0.004ms      0.001ms\n100,000    5.100ms      0.005ms      0.001ms\n1,000,000  51.00ms      0.006ms      0.001ms\n\n[*] Recommendation: Use dict (hash map) for O(1) lookups.\n    Binary search is acceptable if memory-constrained.`,
      stretch: "Add `set` lookup to the benchmark. Plot results as a text-based bar chart."
    }
  },
  {
    id: "ch15", num: 15, title: "Analysis of Sorting Algorithms",
    concepts: "Merge sort, quicksort, O(n log n) vs O(n²), stability.",
    psets: [
      {
        star: 2, title: "Merge Sort a Packet Capture",
        objective: "Implement merge sort on structured data — guaranteed O(n log n).",
        steps: [
          "Create a list of `(timestamp, packet_data)` tuples.",
          "Implement `merge(left, right)` that merges two sorted lists.",
          "Implement `merge_sort(arr)` with recursive divide-and-conquer.",
          "Sort the packets by timestamp.",
          "Add a comparison counter. Verify it's close to n log n."
        ],
        example: `Before: [(14:30, 'pkt3'), (14:28, 'pkt1'), (14:29, 'pkt2')]\nAfter:  [(14:28, 'pkt1'), (14:29, 'pkt2'), (14:30, 'pkt3')]\nComparisons: 3 (n log n ≈ 4.75)`,
        starter: null,
        hints: "The merge step does at most `len(left) + len(right) - 1` comparisons. Total across all levels: O(n log n).",
        drill: "Merge sort implementation, comparison counting."
      },
      {
        star: 2, title: "Quicksort Pivot Analysis",
        objective: "See how pivot choice affects quicksort performance — and why adversary-controlled input matters.",
        steps: [
          "Implement quicksort with first-element pivot.",
          "Add a comparison counter.",
          "Run on: random data, already-sorted data, reverse-sorted data (each size 1000).",
          "Print comparison counts for each case.",
          "Observe: sorted input triggers O(n²) worst case with first-element pivot."
        ],
        example: `n=1000:\n  Random data:         ~10,000 comparisons (O(n log n))\n  Sorted data:         499,500 comparisons (O(n²)!)\n  Reverse-sorted data: 499,500 comparisons (O(n²)!)\n\n[!] Attacker who controls log entry order could trigger worst-case.`,
        starter: null,
        hints: "Fix: use median-of-three pivot or random pivot selection. This is why real implementations use introsort (quicksort + heapsort fallback).",
        drill: "Quicksort implementation, worst-case analysis."
      },
      {
        star: 3, title: "Sorting Stability in DFIR",
        objective: "Understand why stability matters when sorting forensic evidence.",
        steps: [
          "Create events with identical timestamps but different sources.",
          "Sort with merge sort (stable) — verify same-timestamp events preserve original order.",
          "Sort with quicksort (unstable) — observe that same-timestamp order may change.",
          "Write a comment (5+ lines) explaining why this matters in forensics.",
          "Example: if auth.log and firewall.log both have events at 02:14:33, the original source ordering tells you which system recorded it first."
        ],
        example: `Original order:\n  02:14:33 | auth.log     | LOGIN_FAIL\n  02:14:33 | firewall.log | CONN_ALLOWED\n  02:14:33 | web.log      | HTTP_POST\n\nMerge sort preserves order (stable) ✓\nQuicksort may scramble them (unstable) ✗`,
        starter: null,
        hints: "In court, the order of evidence presentation matters. A stable sort guarantees reproducible results.",
        drill: "Stability analysis, forensic implications."
      },
    ],
    applied: {
      star: 3, title: "Multi-Key Evidence Sorter",
      libs: "datetime",
      objective: "Build a forensic timeline sorter with multi-key comparison and custom merge sort.",
      steps: [
        "Read events with `(timestamp, source, severity, event_type, description)`.",
        "Implement merge sort with multi-key comparison: primary by timestamp, secondary by severity (higher first).",
        "Output a formatted forensic timeline.",
        "Compare your merge sort's comparison count against Python's `sorted()` on the same data.",
        "Print both the timeline and the performance comparison."
      ],
      starter: null,
      example: `[*] 50 events from 3 sources\n[*] Your merge sort: 267 comparisons\n[*] Python sorted():  (built-in, Timsort)\n\nForensic Timeline:\n02:14:30 | firewall  | P2 | CONN_ALLOWED | 45.33.32.156 -> 10.0.1.5:22\n02:14:33 | auth      | P4 | LOGIN_FAIL   | admin from 45.33.32.156\n02:14:33 | auth      | P4 | LOGIN_FAIL   | admin from 45.33.32.156\n02:14:38 | auth      | P3 | LOGIN_OK     | admin from 45.33.32.156\n02:14:45 | auth      | P5 | PRIV_ESC     | sudo su - root`,
      stretch: "Add a `--severity` filter flag. Implement quicksort and demonstrate the stability difference on same-timestamp events."
    }
  },
  {
    id: "ch16", num: 16, title: "Stacks, Queues, and Dictionaries",
    concepts: "Stack (LIFO), queue (FIFO), dictionaries, key-value pairs.",
    psets: [
      {
        star: 1, title: "Undo History Stack",
        objective: "Use a stack to implement undo — the same pattern used in every editor and config tool.",
        steps: [
          "Create a list `history = []` (your stack).",
          "Simulate firewall rule changes: push each change description onto the stack.",
          "Implement 'undo' by popping the last change and printing it.",
          "Show the stack state after each operation."
        ],
        example: `[+] Added: ALLOW 10.0.0.0/24 :80\n[+] Added: DENY  0.0.0.0/0 :22\n[+] Added: ALLOW 192.168.1.0/24 :443\n\nStack: [rule1, rule2, rule3]\n\n[UNDO] Removed: ALLOW 192.168.1.0/24 :443\nStack: [rule1, rule2]`,
        starter: null,
        hints: "Stack operations: `push` = `list.append()`, `pop` = `list.pop()`. LIFO order.",
        drill: "Stack operations, LIFO behavior."
      },
      {
        star: 2, title: "Incident Response Queue",
        objective: "Use a queue for FIFO processing — how SOC ticket systems work.",
        steps: [
          "Create a list-based queue.",
          "Enqueue 5 incidents with different severities and timestamps.",
          "Dequeue them in FIFO order (first reported = first handled).",
          "Print the queue state after each operation.",
          "Compare: when would you want FIFO (fairness) vs priority (severity)?"
        ],
        example: `Queue: [INC-01, INC-02, INC-03, INC-04, INC-05]\n\nProcessing INC-01... Done.\nQueue: [INC-02, INC-03, INC-04, INC-05]\n\nProcessing INC-02... Done.\nQueue: [INC-03, INC-04, INC-05]`,
        starter: null,
        hints: "Queue: `enqueue` = `list.append()`, `dequeue` = `list.pop(0)`. Note: `pop(0)` is O(n) — use `collections.deque` for O(1).",
        drill: "Queue operations, FIFO behavior, performance considerations."
      },
      {
        star: 2, title: "IOC Lookup Dictionary",
        objective: "Use a dictionary for O(1) lookups — the data structure behind every threat intel feed.",
        steps: [
          "Create a dictionary mapping IP addresses to threat labels.",
          "Write `add_ioc(iocs, ip, label)`, `lookup_ioc(iocs, ip)`, `remove_ioc(iocs, ip)`.",
          "Test: add 10 IOCs, look up 5 (mix of hits and misses), remove 2.",
          "Write a comment: what's the Big-O of dict lookup vs list search?"
        ],
        example: `[+] Added: 45.33.32.156 -> "Shodan Scanner"\n[+] Added: 185.220.101.1 -> "Tor Exit Node"\n\nLookup 45.33.32.156: FOUND -> "Shodan Scanner"\nLookup 10.0.0.1: NOT FOUND\n\n[*] Dict lookup: O(1) average\n[*] List search: O(n)`,
        starter: null,
        hints: "Dictionaries use hash tables internally — that's why lookup is O(1). The HashTable class from Ch.11 is what's happening under the hood.",
        drill: "Dictionary CRUD operations, O(1) vs O(n) comparison."
      },
      {
        star: 3, title: "Bracket Matcher for Config Validation",
        objective: "Use a stack to validate bracket balance — the algorithm behind every syntax checker.",
        steps: [
          "Write `validate_brackets(text)` that uses a stack.",
          "Push opening brackets `({[` onto the stack.",
          "On closing brackets `)}]`, pop and check if they match.",
          "Return `True` if the stack is empty at the end, `False` otherwise.",
          "Test with valid and invalid config file content."
        ],
        example: `"{ server: { port: 8080 } }"  -> Valid ✓\n"{ rules: [ {action: ALLOW} ]" -> Invalid ✗ (unclosed {)\n"{ key: value }}"              -> Invalid ✗ (extra })`,
        starter: `def validate_brackets(text):\n    stack = []\n    pairs = {")": "(", "]": "[", "}": "{"}\n    for i, ch in enumerate(text):\n        if ch in "({[":\n            stack.append((ch, i))\n        elif ch in ")}]":\n            if not stack:\n                return False, f"Unmatched '{ch}' at position {i}"\n            top, pos = stack.pop()\n            if top != pairs[ch]:\n                return False, f"Mismatch: '{top}' at {pos} vs '{ch}' at {i}"\n    if stack:\n        ch, pos = stack[-1]\n        return False, f"Unclosed '{ch}' at position {pos}"\n    return True, "All brackets balanced"`,
        hints: "This exact algorithm is used in JSON validators, YAML parsers, and firewall config checkers.",
        drill: "Stack-based parsing, bracket matching."
      },
    ],
    applied: {
      star: 3, title: "Mini DNS Cache",
      libs: "time, random",
      objective: "Build a DNS cache with TTL expiration — how every DNS resolver manages its lookup table.",
      steps: [
        "Define `DNSCache` class with a dictionary mapping domains to `(ip, timestamp, ttl)`.",
        "`resolve(domain)` checks cache first; if expired or missing, 'queries' (generates random IP) and caches it.",
        "`flush()` clears expired entries based on current time.",
        "`stats()` prints hit rate, miss rate, and cache size.",
        "Simulate 100 lookups across 10 domains with varying TTLs."
      ],
      starter: `import time\nimport random\n\nclass DNSCache:\n    def __init__(self):\n        self.cache = {}\n        self.hits = 0\n        self.misses = 0\n    \n    def resolve(self, domain, ttl=60):\n        now = time.time()\n        if domain in self.cache:\n            ip, ts, t = self.cache[domain]\n            if now - ts < t:\n                self.hits += 1\n                return ip, "HIT"\n        # Cache miss — simulate DNS query\n        self.misses += 1\n        ip = f"{random.randint(1,255)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}"\n        self.cache[domain] = (ip, now, ttl)\n        return ip, "MISS"\n    \n    def flush(self):\n        now = time.time()\n        expired = [d for d, (ip, ts, t) in self.cache.items() if now - ts >= t]\n        for d in expired:\n            del self.cache[d]\n        return len(expired)\n    \n    def stats(self):\n        total = self.hits + self.misses\n        rate = (self.hits / total * 100) if total else 0\n        print(f"Cache size: {len(self.cache)}")\n        print(f"Hits: {self.hits}, Misses: {self.misses}, Hit rate: {rate:.1f}%")`,
      example: `resolve("example.com") -> 93.184.216.34 (MISS)\nresolve("example.com") -> 93.184.216.34 (HIT)\nresolve("google.com")  -> 142.250.80.46 (MISS)\n\nCache size: 2\nHits: 1, Misses: 2, Hit rate: 33.3%`,
      stretch: "Add a max cache size with LRU eviction. Track per-domain query counts."
    }
  },
  {
    id: "ch17", num: 17, title: "Linked Lists",
    concepts: "Nodes, pointers/references, singly linked lists, insertion, deletion.",
    psets: [
      {
        star: 1, title: "Linked List Log Buffer",
        objective: "Implement a basic linked list — the fundamental dynamic data structure.",
        steps: [
          "Define a `Node` class with `data` and `next` attributes.",
          "Define a `LogBuffer` class with `head` attribute.",
          "Write `append(entry)` that adds a node to the end.",
          "Write `print_all()` that traverses and prints all entries.",
          "Add 5+ log entries and print them."
        ],
        example: `Log Buffer:\n  -> INFO: Server started\n  -> INFO: User alice connected\n  -> WARNING: High CPU usage\n  -> ERROR: Connection timeout\n  -> CRITICAL: Disk failure`,
        starter: `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LogBuffer:\n    def __init__(self):\n        self.head = None\n    \n    def append(self, entry):\n        new_node = Node(entry)\n        if not self.head:\n            self.head = new_node\n            return\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = new_node\n    \n    def print_all(self):\n        curr = self.head\n        while curr:\n            print(f"  -> {curr.data}")\n            curr = curr.next`,
        hints: "Traversal pattern: `curr = self.head` then `while curr: ... curr = curr.next`.",
        drill: "Node/pointer model, linked list traversal, append."
      },
      {
        star: 2, title: "Delete by Value",
        objective: "Handle edge cases in linked list deletion — head, tail, and not-found.",
        steps: [
          "Add a `delete(entry)` method to LogBuffer.",
          "Handle: deleting the head node, deleting a middle node, deleting the tail, entry not found.",
          "Test each case.",
          "Count nodes before and after deletion to verify."
        ],
        example: `Before: A -> B -> C -> D -> E\nDelete 'C': A -> B -> D -> E\nDelete 'A': B -> D -> E\nDelete 'Z': not found, no change`,
        starter: null,
        hints: "For head deletion: `self.head = self.head.next`. For middle/tail: track `prev` and set `prev.next = curr.next`.",
        drill: "Linked list deletion, edge case handling."
      },
      {
        star: 2, title: "Reverse a Linked List",
        objective: "Reverse pointer direction iteratively — a classic algorithm with real applications in data stream processing.",
        steps: [
          "Write an iterative `reverse()` method.",
          "Use three pointers: `prev`, `curr`, `next_node`.",
          "Walk through the list, flipping each `next` pointer.",
          "After reversal, update `self.head`.",
          "Print before and after to verify."
        ],
        example: `Before: A -> B -> C -> D -> E\nAfter:  E -> D -> C -> B -> A`,
        starter: `def reverse(self):\n    prev = None\n    curr = self.head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    self.head = prev`,
        hints: "Draw it on paper: at each step, the `curr.next` arrow flips to point backward. After the loop, `prev` is the new head.",
        drill: "Pointer manipulation, iterative reversal."
      },
      {
        star: 3, title: "LRU Eviction with Linked List",
        objective: "Combine a linked list with a dictionary for O(1) LRU cache — how forensic tools manage memory.",
        steps: [
          "Build an LRU cache that combines a doubly-linked list with a dictionary.",
          "On access: move the node to the head (most recently used).",
          "On capacity overflow: remove the tail (least recently used).",
          "Dictionary maps keys to nodes for O(1) lookup.",
          "Test with capacity 5 and 10+ accesses."
        ],
        example: `Cache capacity: 3\nPut(A): [A]\nPut(B): [B, A]\nPut(C): [C, B, A]\nGet(A): [A, C, B]  (moved to front)\nPut(D): [D, A, C]  (evicted B)`,
        starter: null,
        hints: "You need a doubly-linked list (prev + next pointers) to move nodes to head in O(1). The dict provides O(1) key→node lookup.",
        drill: "Advanced linked list operations, cache eviction policy."
      },
    ],
    applied: {
      star: 3, title: "Packet Buffer with Linked List",
      libs: "standard library",
      objective: "Build a network packet buffer using a linked list — practice queue operations on structured data.",
      steps: [
        "Each node holds a Packet object (from Ch. 11).",
        "`enqueue(packet)` adds to tail.",
        "`dequeue()` removes from head.",
        "`filter(protocol)` returns a new linked list containing only matching packets.",
        "`to_list()` converts to a Python list for analysis.",
        "Test with 20+ packets, filter by protocol, convert and print."
      ],
      starter: null,
      example: `[*] Buffer: 20 packets\n[*] Dequeued: TCP 192.168.1.50 -> 10.0.0.1:443\n[*] Filtered TCP: 12 packets\n[*] Filtered UDP: 6 packets\n[*] Filtered ICMP: 2 packets`,
      stretch: "Add a `max_size` parameter. When the buffer is full, dequeue the oldest packet before enqueueing a new one (circular buffer behavior)."
    }
  },
  {
    id: "ch18", num: 18, title: "Graphs",
    concepts: "Vertices, edges, adjacency lists, BFS, DFS, shortest paths.",
    psets: [
      {
        star: 1, title: "Network Topology as a Graph",
        objective: "Model network infrastructure as a graph — the foundation of all network analysis.",
        steps: [
          "Create an adjacency list as a dictionary: `{\"Router\": [\"Firewall\", \"Switch1\"], ...}`.",
          "Add 5+ hosts, a router, and a firewall.",
          "Write `print_topology(graph)` that prints each node and its connections.",
          "Write `get_neighbors(graph, node)` that returns the list of connected nodes."
        ],
        example: `Network Topology:\n  Router    -> Firewall, Switch1, Switch2\n  Firewall  -> Router, Internet\n  Switch1   -> Router, WebServer, DBServer\n  Switch2   -> Router, Workstation1, Workstation2`,
        starter: null,
        hints: "For undirected connections, add both directions: if A connects to B, add B to A's list AND A to B's list.",
        drill: "Adjacency list representation, graph construction."
      },
      {
        star: 2, title: "BFS: Find All Reachable Hosts",
        objective: "Implement BFS to determine blast radius — if this host is compromised, what can the attacker reach?",
        steps: [
          "Implement BFS from a starting node using a queue and a visited set.",
          "Return a list of all reachable nodes.",
          "Test: from a compromised workstation, which servers can the attacker reach?",
          "Print the BFS traversal order and the final reachable set."
        ],
        example: `[*] BFS from Workstation1:\n  Visit: Workstation1\n  Visit: Switch2\n  Visit: Router\n  Visit: Firewall\n  Visit: Switch1\n  Visit: WebServer\n  Visit: DBServer\n\n[!] Blast radius: 7 hosts reachable from Workstation1`,
        starter: `def bfs(graph, start):\n    visited = set()\n    queue = [start]\n    order = []\n    while queue:\n        node = queue.pop(0)\n        if node in visited:\n            continue\n        visited.add(node)\n        order.append(node)\n        for neighbor in graph.get(node, []):\n            if neighbor not in visited:\n                queue.append(neighbor)\n    return order`,
        hints: "BFS explores layer by layer — it finds the shortest path in an unweighted graph. This is how network segmentation analysis works.",
        drill: "BFS implementation, reachability analysis."
      },
      {
        star: 2, title: "DFS: Detect Cycles",
        objective: "Detect circular trust relationships — a real vulnerability in network architectures.",
        steps: [
          "Build a directed graph of trust relationships (A trusts B ≠ B trusts A).",
          "Implement DFS with a 'currently visiting' set (gray nodes) to detect back edges.",
          "If a back edge is found, report the cycle.",
          "Test with a graph that has a cycle and one that doesn't."
        ],
        example: `Trust graph:\n  ServerA trusts ServerB\n  ServerB trusts ServerC\n  ServerC trusts ServerA  <- back edge!\n\n[!] Cycle detected: ServerA -> ServerB -> ServerC -> ServerA\n[!] Circular trust vulnerability — compromising any node compromises all.`,
        starter: null,
        hints: "Use three states: white (unvisited), gray (in progress), black (finished). A back edge goes to a gray node.",
        drill: "DFS, cycle detection, directed graphs."
      },
      {
        star: 3, title: "Shortest Attack Path",
        objective: "Implement Dijkstra's algorithm to find the easiest lateral movement path — what BloodHound computes.",
        steps: [
          "Build a weighted directed graph where edge weights represent difficulty of lateral movement.",
          "Implement Dijkstra's algorithm from a given entry point.",
          "Find the lowest-cost path to a target server.",
          "Print the full path and total cost.",
          "Identify which single edge removal would most increase the attack cost."
        ],
        example: `Entry: Workstation1, Target: DomainController\n\nShortest attack path (cost=7):\n  Workstation1 --(2)--> FileServer\n  FileServer   --(1)--> AdminPC\n  AdminPC      --(4)--> DomainController\n\n[!] Recommendation: hardening AdminPC -> DC link (cost 4)\n    would increase total attack cost to 11.`,
        starter: null,
        hints: "Dijkstra's uses a priority queue (use a sorted list or `heapq`). Edge weight = difficulty (higher = harder for attacker). This is real attack path analysis.",
        drill: "Dijkstra's algorithm, weighted graphs, path reconstruction."
      },
    ],
    applied: {
      star: 3, title: "Attack Graph Analyzer",
      libs: "standard library",
      objective: "Build a complete attack path analysis tool — parse, model, search, and recommend.",
      steps: [
        "Parse a network description from a file: hosts, connections, vulnerabilities per host.",
        "Build a directed graph where edges represent exploitable paths (weighted by exploit difficulty).",
        "Implement BFS to find all hosts reachable from an initial compromise point.",
        "Implement Dijkstra's to find the lowest-cost path to a high-value target.",
        "Output: list of at-risk hosts, shortest attack path, and a recommendation for which connection to sever."
      ],
      starter: null,
      example: `[*] Parsed network: 12 hosts, 18 connections\n[*] Reachable from entry point (Workstation3): 9 hosts\n\nShortest attack path to DomainController (cost=9):\n  Workstation3 -> FileServer -> AdminPC -> DomainController\n\nRecommendation: Sever AdminPC -> DomainController\n  This increases minimum attack cost from 9 to 15.\n  Alternative: patch FileServer (removes 3 inbound paths).`,
      stretch: "Visualize the graph as an ASCII adjacency matrix with attack paths highlighted. Add multiple entry points and find the most dangerous one."
    }
  },
];

const SA_REMIXES = [
  {
    id: "sa01", num: "01", title: "print() and Program Setup",
    original: "Print an ASCII logo of your name using print() statements. Run a mystery program.",
    remix: "Threat Intel Banner Generator",
    objective: "Master print() and string formatting by producing output that looks like a real security tool.",
    steps: [
      "Create a file `threat_banner.py`.",
      "Build a 5+ line decorative border using box-drawing characters (╔═╗║╚╝) or plain symbols (+=-|).",
      "Print your analyst handle/alias inside the border.",
      "Print a classification line: `TLP:AMBER` (Traffic Light Protocol).",
      "Print today's date (hardcoded string is fine).",
      "Below the border, print an \"EXECUTIVE SUMMARY\" header.",
      "Use at least 3 separate print() calls for: threat actor name, campaign name, and target sector.",
    ],
    example: `╔══════════════════════════════════════╗\n║   THREAT INTELLIGENCE REPORT         ║\n║   Analyst: gh0st_d4rio               ║\n║   Classification: TLP:AMBER          ║\n║   Date: 2026-03-30                   ║\n╚══════════════════════════════════════╝\n\nEXECUTIVE SUMMARY\n─────────────────\nThreat Actor:  APT-41 (Wicked Panda)\nCampaign:      Operation ShadowHammer\nTarget Sector: Semiconductor supply chain\nConfidence:    HIGH\nFirst Seen:    2025-11-14`,
    starter: `# threat_banner.py\n# Your first security tool output\n\nprint("╔══════════════════════════════════════╗")\nprint("║   THREAT INTELLIGENCE REPORT         ║")\n# ... your code here ...\nprint("╚══════════════════════════════════════╝")\nprint()\nprint("EXECUTIVE SUMMARY")\nprint("─────────────────")\n# ... your summary lines here ...`,
    stretch: "Write a second script `nmap_mock.py` that prints a mock Nmap scan:\n```\nStarting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 10.0.1.50\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\n3306/tcp closed mysql\n8080/tcp open  http-proxy\n```",
    drill: "print(), string formatting, program structure — same as SA01 but building security-tool muscle memory."
  },
  {
    id: "sa02", num: "02", title: "Functions, Drawing with Code",
    original: "Draw a picture book cover using cs1lib shape functions. Define color-setting functions.",
    remix: "Network Topology Diagram Generator (ASCII)",
    objective: "Use functions as drawing abstractions — same as SA02, but your canvas is the terminal.",
    steps: [
      "Define `draw_box(label, width=12)` — prints a box with a label centered inside.",
      "Define `draw_firewall()` — calls draw_box with \"FIREWALL\".",
      "Define `draw_server(label)` — calls draw_box with the given label.",
      "Define `draw_pipe(length=1)` — prints vertical connector lines (`|`).",
      "Define `draw_split()` — prints a horizontal split (`+----+----+` style).",
      "Define `draw_topology()` that calls all helpers to compose the full diagram.",
      "Your diagram must have at least 8 visual elements (boxes, lines, labels).",
    ],
    example: `       [INTERNET]\n           |\n    +-----------+\n    | FIREWALL  |\n    | PAN-3220  |\n    +-----------+\n       |     |\n   +------+ +------+\n   | DMZ  | | LAN  |\n   | .100 | | .200 |\n   +------+ +------+\n       |       |\n  +-------+ +--------+\n  |Web Srv| |DC / AD |\n  +-------+ +--------+`,
    starter: `def draw_box(label, width=14):\n    \"\"\"Print a box with a centered label.\"\"\"\n    print("+" + "-" * width + "+")\n    print("|" + label.center(width) + "|")\n    print("+" + "-" * width + "+")\n\ndef draw_pipe():\n    \"\"\"Print a vertical connector.\"\"\"\n    print("       |")\n\ndef draw_firewall():\n    draw_box("FIREWALL")\n\ndef draw_server(label):\n    draw_box(label, width=10)\n\ndef draw_topology():\n    print("    [INTERNET]")\n    draw_pipe()\n    draw_firewall()\n    draw_pipe()\n    # ... add your servers, connections, etc.\n\ndraw_topology()`,
    stretch: "Prompt Claude or ChatGPT to generate a network topology diagram in ASCII. Document: what worked, what broke, what you had to fix. Write observations in a text file.",
    drill: "Functions as abstraction, composing complex output from simpler pieces — same as SA02."
  },
  {
    id: "sa03", num: "03", title: "Variables, Expressions, While Loops",
    original: "Compound interest — compute Brutus Balkcom's balance over 2023 years with a while loop.",
    remix: "Password Cracking Time Estimator",
    objective: "Use the same compound-growth while loop pattern from SA03, but in a cryptographic context.",
    steps: [
      "Problem 1: Set HASH_RATE = 10_000_000_000 and LENGTH = 8, CHARSET = 94.",
      "Use a while loop (NOT the `**` operator) to compute keyspace by multiplying CHARSET by itself LENGTH times.",
      "Compute and print time to exhaust in seconds, hours, days, years.",
      "Problem 2: bcrypt at 100 H/s. Attacker doubles rate yearly. Defender adds 1 char every 5 years.",
      "While loop: each iteration = 1 year. Compute attacker's cumulative hashes. Compare to defender's current keyspace.",
      "Find and print the crossover year."
    ],
    example: `--- Problem 1 ---\nHash rate:     10,000,000,000 H/s\nCharset:       94\nLength:        8\nKeyspace:      6,095,689,385,410,816\n\nTime to exhaust:\n  609,568.94 seconds\n  169.32 hours\n  7.06 days\n\n--- Problem 2 ---\nYear 1:  bcrypt rate=200 H/s, password_len=8, keyspace=6.10e+15\nYear 5:  bcrypt rate=3200 H/s, password_len=8, keyspace=6.10e+15\nYear 6:  bcrypt rate=6400 H/s, password_len=9, keyspace=5.73e+17\n...\n[!] Year 47: Attacker's cumulative hashes exceed keyspace.\n    Attacker rate: 14,073,748,835,532,800 H/s\n    Defender password length: 17`,
    starter: `# Problem 1: Keyspace without exponentiation\nHASH_RATE = 10_000_000_000\nCHARSET = 94\nLENGTH = 8\nSECONDS_PER_YEAR = 365.25 * 24 * 3600\n\nkeyspace = 1\ni = 0\nwhile i < LENGTH:\n    keyspace = keyspace * CHARSET\n    i += 1\n\nprint(f"Keyspace: {keyspace:,}")\nseconds = keyspace / HASH_RATE\nprint(f"Time: {seconds:,.2f} seconds")\nprint(f"       {seconds/3600:,.2f} hours")\nprint(f"       {seconds/86400:,.2f} days")\nprint(f"       {seconds/SECONDS_PER_YEAR:,.2f} years")\n\n# Problem 2: Attacker vs Defender arms race\nprint("\\n--- Problem 2: Arms Race ---")\nbcrypt_rate = 100      # H/s at year 0\npassword_len = 8\nyear = 0\ncumulative_hashes = 0\n\nwhile True:\n    # Defender: increase length every 5 years\n    current_len = password_len + (year // 5)\n    # Recompute keyspace (use a while loop)\n    ks = 1\n    j = 0\n    while j < current_len:\n        ks *= CHARSET\n        j += 1\n    # Attacker: compute hashes this year\n    current_rate = bcrypt_rate * (2 ** year)\n    hashes_this_year = current_rate * SECONDS_PER_YEAR\n    cumulative_hashes += hashes_this_year\n    \n    if year % 5 == 0:\n        print(f"Year {year}: rate={current_rate:,} H/s, len={current_len}, keyspace={ks:.2e}")\n    \n    if cumulative_hashes >= ks:\n        print(f"\\n[!] Year {year}: Attacker wins.")\n        print(f"    Rate: {current_rate:,} H/s")\n        print(f"    Password length: {current_len}")\n        break\n    year += 1`,
    stretch: null,
    drill: "Variables, constants, while loops, compound growth — identical structure to SA03."
  },
  {
    id: "sa04", num: "04", title: "Loops, Coordinates, Animation-Style Iteration",
    original: "String art — place thumbtacks around a square and draw lines between paired points, one per frame.",
    remix: "Substitution Cipher Wheel Generator",
    objective: "Use the same one-step-per-iteration loop pattern as SA04's string art to build a cipher table.",
    steps: [
      "Define `OFFSET = 1` (will increment to generate full tabula recta).",
      "Outer while loop: iterate through shifts 0–25.",
      "Inner while loop: iterate through 26 letters for each shift.",
      "On each inner iteration, print one row: `A -> D` (plaintext → ciphertext).",
      "Print a decorative border around each shift block.",
      "After all 26 shifts, you've generated the full Vigenère tabula recta."
    ],
    example: `+--- Shift 0 ---+\n| A -> A         |\n| B -> B         |\n| ...            |\n| Z -> Z         |\n+--- Shift 1 ---+\n| A -> B         |\n| B -> C         |\n| ...            |\n| Z -> A         |\n+--- Shift 3 ---+\n| A -> D         |\n| B -> E         |`,
    starter: `shift = 0\nwhile shift < 26:\n    print(f"+--- Shift {shift:2d} ---+")\n    letter_index = 0\n    while letter_index < 26:\n        plain = chr(ord('A') + letter_index)\n        cipher = chr(ord('A') + (letter_index + shift) % 26)\n        print(f"| {plain} -> {cipher}         |")\n        letter_index += 1\n    print(f"+----------------+")\n    print()\n    shift += 1`,
    stretch: "After generating the table, prompt for a message and shift value. Encrypt it using your table, then decrypt it.",
    drill: "While-loop iteration with changing state, index math, edge-case handling at boundaries."
  },
  {
    id: "sa05", num: "05", title: "Mouse/Keyboard Input, State, Real-Time Drawing",
    original: "Chalkboard drawing program — draw with mouse, change colors with keyboard, track previous coordinates.",
    remix: "Interactive Packet Sniffer Console",
    objective: "Build a stateful event-driven loop — same architecture as the chalkboard, for network monitoring.",
    steps: [
      "Set up state variables: `capture_active = True`, `filter_port = None`, `packet_count = 0`, `protocol_counts = {}`.",
      "Main loop: generate a random packet each iteration (src_ip, dst_ip, port, protocol, size).",
      "Apply filter: if filter_port is set, skip packets that don't match.",
      "Print each packet in a formatted row.",
      "Every 10 packets, prompt for a command: f (filter), p (pause), s (stats), q (quit).",
      "Implement each command by modifying the state variables.",
      "Track stats: total packets, per-protocol counts, top source IPs."
    ],
    example: `[001] 14:23:01 | 192.168.1.50 -> 10.0.0.1    | TCP  :443  | 1240 B\n[002] 14:23:01 | 10.0.0.5     -> 172.16.0.3  | UDP  :53   |  128 B\n[003] 14:23:02 | 192.168.1.50 -> 10.0.0.1    | TCP  :80   |  890 B\n[!!!] 14:23:02 | 45.33.32.156 -> 10.0.0.1    | TCP  :4444 |  64 B  << ALERT\n...\n--- Command (f/p/s/q): s\nPackets captured: 10\nProtocol breakdown: TCP=7, UDP=2, ICMP=1\nTop source: 192.168.1.50 (5 packets)\nAlerts: 1`,
    starter: `import random\nfrom time import sleep\nfrom datetime import datetime\n\n# State variables (mirrors SA05's old_x, old_y, curr_x, curr_y)\ncapture_active = True\nfilter_port = None\npacket_count = 0\nprotocol_counts = {"TCP": 0, "UDP": 0, "ICMP": 0}\nalert_count = 0\n\n# Threat signatures\nALERT_PORTS = [4444, 31337, 1337, 5555]\n\nSRC_IPS = ["192.168.1.50", "10.0.0.5", "172.16.0.3", "45.33.32.156"]\nDST_IPS = ["10.0.0.1", "172.16.0.3", "192.168.1.1"]\nPORTS = [80, 443, 53, 22, 8080, 4444, 31337, 3306]\nPROTOCOLS = ["TCP", "UDP", "ICMP"]\n\nwhile capture_active:\n    src = random.choice(SRC_IPS)\n    dst = random.choice(DST_IPS)\n    port = random.choice(PORTS)\n    proto = random.choice(PROTOCOLS)\n    size = random.randint(64, 2048)\n    ts = datetime.now().strftime("%H:%M:%S")\n    \n    # Apply filter\n    if filter_port and port != filter_port:\n        continue\n    \n    packet_count += 1\n    protocol_counts[proto] = protocol_counts.get(proto, 0) + 1\n    \n    # Check for alerts\n    is_alert = port in ALERT_PORTS\n    if is_alert:\n        alert_count += 1\n    prefix = "[!!!]" if is_alert else f"[{packet_count:03d}]"\n    suffix = " << ALERT" if is_alert else ""\n    \n    print(f"{prefix} {ts} | {src:16s} -> {dst:16s} | {proto:4s} :{port:<5d} | {size:4d} B{suffix}")\n    sleep(0.3)\n    \n    # Command prompt every 10 packets\n    if packet_count % 10 == 0:\n        cmd = input("--- Command (f/p/s/q): ").strip().lower()\n        if cmd == "q":\n            capture_active = False\n        elif cmd == "p":\n            input("Paused. Press Enter to resume...")\n        elif cmd == "s":\n            print(f"Packets: {packet_count} | Alerts: {alert_count} | {protocol_counts}")\n        elif cmd == "f":\n            fp = input("Filter port (or 'clear'): ").strip()\n            filter_port = int(fp) if fp.isdigit() else None\n\nprint(f"\\nCapture ended. {packet_count} packets, {alert_count} alerts.")`,
    stretch: "Write packets to a log file `capture.log` as they're captured. Add a `w` command to toggle file writing.",
    drill: "Event-driven state management, global mutable state, real-time loops — same pattern as the chalkboard."
  },
  {
    id: "sa06", num: "06", title: "2D Lists, Nested Iteration, Validation",
    original: "N-Queens validator — represent a chessboard as a list of lists, check all queen pairs.",
    remix: "Firewall Rule Conflict Detector",
    objective: "Check every pair of rules for conflicts — same nested-loop pairwise structure as N-Queens.",
    steps: [
      "Represent rules as a list of lists: `[action, src_subnet, dst_subnet, port_start, port_end]`.",
      "Write `actions_conflict(r1, r2)` → True if one is ALLOW and the other DENY.",
      "Write `subnets_overlap(r1, r2)` → True if src AND dst subnets match (string equality).",
      "Write `ports_overlap(r1, r2)` → True if port ranges overlap: `r1[3] <= r2[4] and r2[3] <= r1[4]`.",
      "Write `check_ruleset(rules)` that uses nested loops to check every pair (i, j) where i < j.",
      "Print each conflicting pair with rule indices."
    ],
    example: `Checking 4 firewall rules for conflicts...\n\n[!] CONFLICT: Rule 0 vs Rule 1\n    Rule 0: ALLOW 10.0.0.0/24 -> 192.168.1.0/24 ports 80-443\n    Rule 1: DENY  10.0.0.0/24 -> 192.168.1.0/24 ports 22-443\n    Reason: Opposite actions, same subnets, overlapping ports (80-443 ∩ 22-443)\n\n[!] CONFLICT: Rule 2 vs Rule 3\n    Rule 2: ALLOW 172.16.0.0/16 -> 10.0.0.0/8 ports 8080-8080\n    Rule 3: DENY  172.16.0.0/16 -> 10.0.0.0/8 ports 8000-9000\n\nResult: 2 conflicts found. Ruleset has issues.`,
    starter: `rules = [\n    ["ALLOW", "10.0.0.0/24",  "192.168.1.0/24", 80, 443],\n    ["DENY",  "10.0.0.0/24",  "192.168.1.0/24", 22, 443],\n    ["ALLOW", "172.16.0.0/16","10.0.0.0/8",      8080, 8080],\n    ["DENY",  "172.16.0.0/16","10.0.0.0/8",      8000, 9000],\n]\n\ndef actions_conflict(r1, r2):\n    return r1[0] != r2[0]\n\ndef subnets_overlap(r1, r2):\n    return r1[1] == r2[1] and r1[2] == r2[2]\n\ndef ports_overlap(r1, r2):\n    return r1[3] <= r2[4] and r2[3] <= r1[4]\n\ndef check_ruleset(rules):\n    conflicts = 0\n    for i in range(len(rules)):\n        for j in range(i + 1, len(rules)):\n            if actions_conflict(rules[i], rules[j]) and \\\n               subnets_overlap(rules[i], rules[j]) and \\\n               ports_overlap(rules[i], rules[j]):\n                conflicts += 1\n                print(f"[!] CONFLICT: Rule {i} vs Rule {j}")\n                print(f"    Rule {i}: {rules[i]}")\n                print(f"    Rule {j}: {rules[j]}")\n                print()\n    return conflicts == 0\n\nclean = check_ruleset(rules)\nprint("No conflicts." if clean else "Conflicts detected!")`,
    stretch: null,
    drill: "2D data representation, pairwise comparison — structurally identical to N-Queens."
  },
  {
    id: "sa07", num: "07", title: "Classes and OOP (Counter/Timer)",
    original: "Define a Counter class (counts down, wraps at limit) and a Timer class (24-hour hh:mm:ss countdown using Counter objects). Write a driver.",
    remix: "Incident Response SLA Tracker",
    objective: "Build the same Counter→Timer composition pattern from SA07, but tracking incident response SLA deadlines.",
    steps: [
      "Part 1: Define `SeverityCounter` class with `__init__(self, limit, initial=0, min_digits=1)` — mirrors Counter exactly.",
      "Implement `get_value(self)` → int, `__str__(self)` → zero-padded string.",
      "Implement `tick(self)` → decrements by 1, returns `True` if wrapped (escalation triggered).",
      "Part 2: Define `SLATimer` class that uses three `SeverityCounter` objects: hours (limit 24), minutes (limit 60), seconds (limit 60).",
      "Implement `__str__(self)` → `\"SLA Remaining: hh:mm:ss\"`.",
      "Implement `tick(self)` → decrements by one second, cascading wraps (seconds wraps → decrement minutes, etc.).",
      "Implement `is_breached(self)` → `True` if timer reads 00:00:00.",
      "Part 3: Driver — create SLA timers for P1 (1hr), P2 (4hr), P3 (24hr). Simulate time by calling `tick()` in a loop. Print status every 600 ticks. Print `\"[!] SLA BREACH\"` when any timer hits zero."
    ],
    example: `--- SLA Dashboard (t=0) ---\nP1 (Critical): SLA Remaining: 01:00:00\nP2 (High):     SLA Remaining: 04:00:00\nP3 (Medium):   SLA Remaining: 24:00:00\n\n--- SLA Dashboard (t=600) ---\nP1 (Critical): SLA Remaining: 00:50:00\nP2 (High):     SLA Remaining: 03:50:00\nP3 (Medium):   SLA Remaining: 23:50:00\n\n--- SLA Dashboard (t=3600) ---\n[!] SLA BREACH: P1 (Critical) at 00:00:00\nP2 (High):     SLA Remaining: 03:00:00\nP3 (Medium):   SLA Remaining: 23:00:00`,
    starter: `class SeverityCounter:\n    def __init__(self, limit, initial=0, min_digits=1):\n        self.limit = limit\n        self.value = initial\n        self.min_digits = min_digits\n    \n    def get_value(self):\n        return self.value\n    \n    def __str__(self):\n        return str(self.value).zfill(self.min_digits)\n    \n    def tick(self):\n        \"\"\"Decrement by 1. Return True if wrapped (underflow).\"\"\"\n        if self.value == 0:\n            self.value = self.limit - 1\n            return True  # wrapped\n        self.value -= 1\n        return False\n\nclass SLATimer:\n    def __init__(self, hours, minutes, seconds):\n        self.hours = SeverityCounter(24, hours, 2)\n        self.minutes = SeverityCounter(60, minutes, 2)\n        self.seconds = SeverityCounter(60, seconds, 2)\n    \n    def __str__(self):\n        return f"SLA Remaining: {self.hours}:{self.minutes}:{self.seconds}"\n    \n    def tick(self):\n        if self.seconds.tick():       # seconds wrapped\n            if self.minutes.tick():   # minutes wrapped\n                self.hours.tick()     # hours wrapped\n    \n    def is_breached(self):\n        return (self.hours.get_value() == 0 and\n                self.minutes.get_value() == 0 and\n                self.seconds.get_value() == 0)\n\n# Driver\ntimers = {\n    "P1 (Critical)": SLATimer(1, 0, 0),\n    "P2 (High)":     SLATimer(4, 0, 0),\n    "P3 (Medium)":   SLATimer(24, 0, 0),\n}\n\nfor t in range(24 * 3600 + 1):\n    for name, timer in timers.items():\n        if timer.is_breached() and t > 0:\n            continue\n        timer.tick()\n    \n    if t % 600 == 0:\n        print(f"\\n--- SLA Dashboard (t={t}) ---")\n        for name, timer in timers.items():\n            if timer.is_breached():\n                print(f"[!] SLA BREACH: {name} at {timer}")\n            else:\n                print(f"{name:18s} {timer}")`,
    stretch: "Add a `resolve(timer_name)` function that stops a timer and records the resolution time. Print MTTR (mean time to resolution) at the end.",
    drill: "Class design, composition (Timer uses Counters), __str__, __init__, return values from methods — identical OOP pattern to SA07."
  },
  {
    id: "sa08", num: "08", title: "Recursive Binary Search",
    original: "Implement recursive binary search on a sorted list of numbers. Handle base case (empty sublist), recursive case (search left or right half).",
    remix: "Recursive IP Range Search",
    objective: "Implement the same recursive binary search from SA08, but on a sorted blocklist of IP addresses converted to integers.",
    steps: [
      "Write `ip_to_int(ip_string)` that converts `\"192.168.1.1\"` to an integer: `192*256³ + 168*256² + 1*256 + 1`.",
      "Write `int_to_ip(n)` that converts back to dotted-quad notation.",
      "Write `binary_search_ip(blocklist, target, left, right)` — structurally identical to SA08's recursive binary search.",
      "Base case: `left > right` → return `None`.",
      "Recursive case: compare middle element, recurse on left or right half.",
      "Add a `depth` parameter that tracks recursion depth (number of comparisons).",
      "Driver: convert a raw IP blocklist to sorted integers, then interactively search."
    ],
    example: `Blocklist: 11 IPs (sorted as integers)\n\nCheck IP: 192.168.1.50\n  Depth 1: comparing with 172.16.0.1 (mid=5)\n  Depth 2: comparing with 192.168.1.1 (mid=8)\n  Depth 3: comparing with 192.168.1.50 (mid=9)\n  FOUND at index 9 (3 comparisons)\n\nCheck IP: 10.0.0.99\n  Depth 1: comparing with 172.16.0.1 (mid=5)\n  Depth 2: comparing with 10.0.0.5 (mid=2)\n  Depth 3: comparing with 10.0.0.12 (mid=3)\n  NOT FOUND (3 comparisons)`,
    starter: `def ip_to_int(ip):\n    parts = ip.split(".")\n    return (int(parts[0]) << 24) + (int(parts[1]) << 16) + \\\n           (int(parts[2]) << 8) + int(parts[3])\n\ndef int_to_ip(n):\n    return f"{(n>>24)&0xFF}.{(n>>16)&0xFF}.{(n>>8)&0xFF}.{n&0xFF}"\n\ndef binary_search_ip(blocklist, target, left=None, right=None, depth=1):\n    if left is None:\n        left = 0\n    if right is None:\n        right = len(blocklist) - 1\n    \n    if left > right:\n        print(f"  NOT FOUND ({depth-1} comparisons)")\n        return None\n    \n    mid = (left + right) // 2\n    mid_ip = int_to_ip(blocklist[mid])\n    print(f"  Depth {depth}: comparing with {mid_ip} (mid={mid})")\n    \n    if blocklist[mid] == target:\n        print(f"  FOUND at index {mid} ({depth} comparisons)")\n        return mid\n    elif target < blocklist[mid]:\n        return binary_search_ip(blocklist, target, left, mid - 1, depth + 1)\n    else:\n        return binary_search_ip(blocklist, target, mid + 1, right, depth + 1)\n\n# Driver\nraw = ["10.0.0.1", "10.0.0.5", "10.0.0.12", "10.0.0.44",\n       "172.16.0.1", "172.16.0.100", "192.168.1.1", "192.168.1.50",\n       "192.168.1.100", "192.168.2.1", "192.168.10.5"]\nblocklist = sorted(ip_to_int(ip) for ip in raw)\n\nwhile True:\n    q = input("\\nCheck IP (or 'q'): ").strip()\n    if q == "q":\n        break\n    print(f"Searching blocklist of {len(blocklist)} IPs...")\n    binary_search_ip(blocklist, ip_to_int(q))`,
    stretch: "Compare the number of comparisons against a linear scan on the same blocklist. Print both counts side by side for 20 random queries.",
    drill: "Recursion, base/recursive case, binary search, IP address math — structurally identical to SA08."
  },
  {
    id: "sa09", num: "09", title: "Graphs, Dicts, File I/O, Classes",
    original: "Text adventure game — parse a story file into a graph of Vertex objects stored in a dictionary, navigate via user input.",
    remix: "Attack Path Simulator",
    objective: "Build an interactive attack path simulator — same graph/Vertex/dictionary/file-parsing architecture as SA09's adventure game, but the graph is a network attack tree.",
    steps: [
      "Create `attack_graph.txt` with at least 12 vertices. Each line: `VERTEX_NAME| NEIGHBOR1, NEIGHBOR2| Description text`.",
      "Vertices represent compromised hosts or attacker decisions. Empty neighbor list = terminal state (simulation end).",
      "Define a `Vertex` class with `name`, `neighbors` (list of strings), and `description`.",
      "Parse the file: read each line, split on `|`, create Vertex objects, store in a dictionary keyed by name.",
      "Game loop: start at `PHISH_WORKSTATION`. Print description, list choices (a, b, c...), navigate to chosen vertex.",
      "Loop until reaching a vertex with no neighbors (terminal state).",
      "Track the 'kill chain' — the list of vertices visited.",
      "At the end, print the full attack path and a stealth score (assign each vertex a detection risk, sum them)."
    ],
    example: `═══════════════════════════════════════\n  ATTACK PATH SIMULATOR\n═══════════════════════════════════════\n\nYou've gained initial access via a phishing email on a user\nworkstation (10.0.1.50). Mimikatz dump shows cached domain creds.\n\nOptions:\n  a) DC_ADMIN — Attempt pass-the-hash to Domain Controller\n  b) FILE_SERVER — Pivot to file server for data staging\n\nChoice: a\n\nYou've compromised the Domain Controller (10.0.1.1).\nYou have NTDS.dit.\n\nOptions:\n  a) EXFIL_DNS — Exfiltrate via DNS tunneling\n  b) GOLDEN_TICKET — Forge a Golden Ticket for persistence\n\nChoice: b\n\nKerberos Golden Ticket forged. Persistent access established.\nDetection likelihood: VERY LOW without advanced monitoring.\n\n═══ SIMULATION COMPLETE ═══\nKill Chain: PHISH_WORKSTATION -> DC_ADMIN -> GOLDEN_TICKET\nStealth Score: 15/30 (Moderate risk of detection)\n\nDefensive Recommendations:\n  • Segment workstation network from DC (blocks step 1->2)\n  • Deploy Kerberos monitoring (detects Golden Ticket usage)\n  • Enforce credential tiering (prevents pass-the-hash to DC)`,
    starter: `class Vertex:\n    def __init__(self, name, neighbors, description, stealth_cost=5):\n        self.name = name\n        self.neighbors = neighbors\n        self.description = description\n        self.stealth_cost = stealth_cost\n\ndef parse_graph(filename):\n    graph = {}\n    with open(filename) as f:\n        for line in f:\n            line = line.strip()\n            if not line or line.startswith("#"):\n                continue\n            parts = line.split("|")\n            name = parts[0].strip()\n            neighbors = [n.strip() for n in parts[1].split(",") if n.strip()] if parts[1].strip() else []\n            desc = parts[2].strip() if len(parts) > 2 else ""\n            graph[name] = Vertex(name, neighbors, desc)\n    return graph\n\ndef run_simulation(graph, start="PHISH_WORKSTATION"):\n    current = start\n    kill_chain = [current]\n    total_stealth = 0\n    \n    while True:\n        v = graph[current]\n        print(f"\\n{v.description}")\n        total_stealth += v.stealth_cost\n        \n        if not v.neighbors:\n            break\n        \n        print("\\nOptions:")\n        for i, n in enumerate(v.neighbors):\n            label = chr(ord('a') + i)\n            print(f"  {label}) {n}")\n        \n        choice = input("\\nChoice: ").strip().lower()\n        idx = ord(choice) - ord('a')\n        if 0 <= idx < len(v.neighbors):\n            current = v.neighbors[idx]\n            kill_chain.append(current)\n        else:\n            print("Invalid choice.")\n    \n    print("\\n" + "=" * 40)\n    print("Kill Chain:", " -> ".join(kill_chain))\n    print(f"Stealth Score: {total_stealth}")\n\n# Run it\ngraph = parse_graph("attack_graph.txt")\nrun_simulation(graph)`,
    stretch: "After the simulation, print defensive recommendations for cutting each edge in the path. Add a `--map` flag that prints the entire graph structure before starting.",
    drill: "Graph representation with dictionaries, file parsing, class design, interactive loops — structurally identical to SA09."
  },
];


const LAB_REMIXES = [
  {
    id: "lab1", num: 1, title: "Pong → Intrusion Detection Visualizer",
    original: "Pong game — paddles, ball bouncing, collision detection, animation loop, keyboard callbacks.",
    remix: "Real-Time Network Traffic Monitor (Terminal UI)",
    conceptMap: [
      ["Ball position (x, y, vx, vy)", "Packet objects with timestamp, src, dst, port, size"],
      ["Paddle positions + keyboard", "Filter controls via keyboard (protocol, port, pause)"],
      ["Ball bouncing off walls", "Packets scrolling off the display buffer"],
      ["Collision detection", "Alert detection (packet matches threat signature)"],
      ["Score tracking", "Statistics: packets/sec, bytes/sec, alerts triggered"],
      ["Game state", "Capture state (running/paused/filtered)"],
    ],
    desc: "Build a terminal-based live traffic dashboard that visualizes network events scrolling across the screen.",
    requirements: [
      "Packet generator: each frame (loop iteration + `sleep(0.1)`), generate 1–5 random packets with timestamp, source IP, dest IP, dest port, protocol (TCP/UDP/ICMP), size in bytes.",
      "Display buffer: maintain a list of the last 20 packets (the \"screen\"). Each frame, new packets push old ones off the top (scrolling). Clear and reprint using `os.system('clear')` or ANSI codes.",
      "Keyboard input: every 10th frame, prompt for a command: p (pause/unpause), t (TCP filter toggle), u (UDP filter toggle), a (show all), s (stats summary), q (quit).",
      "Alert detection: define ALERT_SIGNATURES as a list of `(port, protocol)` tuples representing known-bad traffic. Check each new packet. If matched, prefix with `[!!!]` and increment alert count.",
      "Stats panel: after every 50 frames, print summary — total packets, packets/sec average, alert count, top 3 destination ports.",
      "Constants: BUFFER_SIZE = 20, FRAME_DELAY = 0.1, ALERT_SIGNATURES list."
    ],
    sampleData: `# Sample alert signatures\nALERT_SIGNATURES = [\n    (4444, "TCP"),    # Metasploit default\n    (31337, "TCP"),   # Back Orifice\n    (1337, "TCP"),    # Common backdoor\n    (53, "UDP"),      # DNS (for exfil detection — flag for review)\n]\n\n# Sample source/dest pools\nINTERNAL_IPS = ["10.0.1." + str(i) for i in range(1, 20)]\nEXTERNAL_IPS = ["45.33.32.156", "104.236.198.48", "185.220.101.1",\n                "93.184.216.34", "142.250.80.46"]\nCOMMON_PORTS = [22, 53, 80, 443, 8080, 8443, 3306, 3389,\n                4444, 31337, 5432, 27017]`,
    checkpoint: "Packets generate and scroll in the display buffer. Keyboard filtering works (at least pause and one protocol filter). No alerts yet.",
    full: "Alerts fire on signature matches. Stats tracking works. Pause/resume works. Clean exit on q.",
    stretch: "Read from a real pcap file using `scapy`: `from scapy.all import rdpcap; packets = rdpcap('capture.pcap')`."
  },
  {
    id: "lab2", num: 2, title: "Solar System → Botnet Propagation Simulator",
    original: "Gravitational simulation — Body class with position/velocity/mass, System class, physics update loop, cs1lib animation.",
    remix: "Epidemic-Model Botnet Propagation Engine",
    conceptMap: [
      ["Body class (x, y, vx, vy, mass)", "Host class (ip, state, infection_time, patch_time, connections)"],
      ["System class (list of Bodies)", "Network class (list of Hosts, adjacency structure)"],
      ["Gravitational acceleration", "Infection probability: p = β × (infected_neighbors / total)"],
      ["update_velocity()", "update_infection_state()"],
      ["update_position()", "update_timers()"],
      ["System.update()", "Network.step()"],
    ],
    desc: "Build an SIR simulation engine modeling how a worm or botnet spreads through a network — same Body/System OOP architecture as the Solar System lab.",
    requirements: [
      "Host class: `ip`, `x`, `y` (grid position), `state` (S/I/R), `infection_timer`, `is_patched`, `connections` (list of Host refs). Methods: `update_state(beta, gamma, timestep)`, `__str__`.",
      "Network class: `hosts` list, `time` counter. Methods: `add_host()`, `connect(a, b)`, `step(beta, gamma, timestep)`, `display()` (text grid), `stats()` (S/I/R counts).",
      "In `step()`: first compute infection pressure for EACH host (like computing acceleration), THEN update states (like updating velocity), THEN update timers (like updating position). Two-phase update prevents order-dependent bugs.",
      "Run for 200 time steps. Print a text visualization each step.",
      "Test 3 scenarios: flat network (100 hosts, fully connected), segmented (4 subnets of 25 with 2 links), patching race (vary γ)."
    ],
    sampleData: `# Scenario 1: Ring topology (8 hosts) — for checkpoint testing\nhosts = []\nfor i in range(8):\n    h = Host(ip=f"10.0.0.{i+1}", x=i%4, y=i//4)\n    hosts.append(h)\n\n# Connect in a ring\nfor i in range(len(hosts)):\n    connect(hosts[i], hosts[(i+1) % len(hosts)])\n\n# Patient zero\nhosts[0].state = "I"\nhosts[0].infection_timer = 10\n\n# Parameters\nbeta = 0.3    # infection rate\ngamma = 0.05  # recovery rate\n\n# Scenario 2: Full mesh (100 hosts)\n# for i in range(100):\n#     for j in range(i+1, 100):\n#         connect(hosts[i], hosts[j])\n\n# Scenario 3: Segmented (4 subnets)\n# Subnet A: hosts 0-24 (fully connected within)\n# Subnet B: hosts 25-49\n# Subnet C: hosts 50-74\n# Subnet D: hosts 75-99\n# Inter-subnet links: connect(hosts[24], hosts[25]),\n#                     connect(hosts[49], hosts[50])  # only 2 bridges\n\n# Sample display output per timestep:\n# Step 012: S=82 I=14 R=4  [SSSSSIIIISSSSSSSSSSRRSSSS...]\n# Step 013: S=79 I=16 R=5  [SSSSSIIIIISSSSSSSSRRRSSS...]`,
    checkpoint: "Host and Network classes with __init__, display, step. Hardcode 8 hosts in a ring. Constant infection probability. S→I→R transitions work.",
    full: "Actual infection pressure from neighbors. 200 steps. Text visualization with S/I/R characters or ANSI colors. SIR count curve at end.",
    stretch: "Generate a final text-based SIR chart: for each timestep, print a row of `S`, `I`, `R` characters scaled to population (e.g., each char = 2 hosts)."
  },
  {
    id: "lab3", num: 3, title: "Quicksort on Cities → Merge Sort DFIR Timeline Engine",
    original: "Read a CSV of world cities into City objects, implement quicksort, write sorted results to file, visualize on a map.",
    remix: "Forensic Timeline Correlator",
    conceptMap: [
      ["City class", "Event class (timestamp, source, severity, event_type, description)"],
      ["Read CSV", "Read multiple log files (auth.log, firewall.log, webserver.log)"],
      ["Quicksort implementation", "Merge sort (stable — preserves source ordering for same-timestamp events)"],
      ["Write sorted cities to file", "Write sorted timeline to timeline.csv"],
      ["Map visualization", "Summary report + burst detection"],
    ],
    desc: "Build a DFIR timeline tool that reads log files from multiple evidence sources, parses them into Event objects, sorts them using merge sort (no sorted()!), and outputs a unified forensic timeline.",
    requirements: [
      "Event class with `timestamp` (datetime), `source`, `severity` (int 1–5), `event_type`, `description`. Implement `__lt__` for multi-key comparison: primary by timestamp, secondary by severity (higher first).",
      "Parse 3+ log files. Each line format: `2026-03-15 02:14:33|auth.log|4|LOGIN_FAIL|Failed password for admin from 45.33.32.156`",
      "Implement merge sort from scratch: `merge(left, right)` + `merge_sort(events)`. Add a comparison counter.",
      "Output `timeline.csv` with all events sorted chronologically.",
      "Summary report: total events, per-source counts, severity distribution, time window (earliest to latest), top 5 event types, burst detection (>5 events in any 10-second window from same source)."
    ],
    sampleData: `# === auth.log (save as auth.log) ===\n2026-03-15 02:14:33|auth.log|4|LOGIN_FAIL|Failed password for admin from 45.33.32.156 port 22 ssh2\n2026-03-15 02:14:35|auth.log|4|LOGIN_FAIL|Failed password for admin from 45.33.32.156 port 22 ssh2\n2026-03-15 02:14:36|auth.log|4|LOGIN_FAIL|Failed password for admin from 45.33.32.156 port 22 ssh2\n2026-03-15 02:14:37|auth.log|4|LOGIN_FAIL|Failed password for admin from 45.33.32.156 port 22 ssh2\n2026-03-15 02:14:38|auth.log|3|LOGIN_SUCCESS|Accepted password for admin from 45.33.32.156 port 22\n2026-03-15 02:14:45|auth.log|5|PRIV_ESCALATION|admin executed sudo su - root\n2026-03-15 02:15:10|auth.log|2|LOGIN_SUCCESS|Accepted password for alice from 10.0.1.20 port 22\n2026-03-15 08:00:01|auth.log|1|LOGIN_SUCCESS|Accepted password for bob from 10.0.1.30 port 22\n\n# === firewall.log (save as firewall.log) ===\n2026-03-15 02:14:30|firewall.log|2|CONN_ALLOWED|45.33.32.156:49201 -> 10.0.1.5:22 TCP ALLOW\n2026-03-15 02:14:50|firewall.log|4|CONN_BLOCKED|45.33.32.156:49320 -> 10.0.1.5:3389 TCP DENY\n2026-03-15 02:15:20|firewall.log|3|CONN_ALLOWED|10.0.1.5:443 -> 185.220.101.1:443 TCP ALLOW\n2026-03-15 02:15:25|firewall.log|4|CONN_ALLOWED|10.0.1.5:53 -> 185.220.101.1:53 UDP ALLOW\n2026-03-15 06:00:00|firewall.log|1|CONN_ALLOWED|10.0.1.20:80 -> 93.184.216.34:80 TCP ALLOW\n\n# === webserver.log (save as webserver.log) ===\n2026-03-15 02:15:30|webserver.log|3|HTTP_POST|POST /upload from 10.0.1.5 - 200 - 4.2MB payload\n2026-03-15 02:15:35|webserver.log|4|HTTP_POST|POST /upload from 10.0.1.5 - 200 - 8.7MB payload\n2026-03-15 02:15:40|webserver.log|5|HTTP_POST|POST /exfil from 10.0.1.5 - 200 - 102MB payload\n2026-03-15 08:30:00|webserver.log|1|HTTP_GET|GET /index.html from 10.0.1.30 - 200\n2026-03-15 09:00:00|webserver.log|1|HTTP_GET|GET /api/status from 10.0.1.20 - 200\n\n# The embedded attack chain:\n# 02:14:30 - Attacker connects to SSH (firewall allows)\n# 02:14:33-38 - Brute force (4 fails, then success)\n# 02:14:45 - Privilege escalation\n# 02:15:20-25 - C2 connection outbound\n# 02:15:30-40 - Data exfiltration via web uploads`,
    checkpoint: "Event class defined. Read 2+ log files. Parse into Event objects. Write unsorted events to output.",
    full: "Merge sort with comparison counter. Formatted timeline output. Summary report with burst detection catching the 02:14:33-38 brute force burst.",
    stretch: "Implement quicksort too — compare stability. Add `--filter severity:4` CLI argument via sys.argv. Text-based sparkline showing event density per hour."
  },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Stars({ n }) {
  return <span style={{ color: n === 1 ? "#22c55e" : n === 2 ? "#f59e0b" : "#ef4444", fontWeight: 700, fontFamily: "monospace", marginRight: 6, fontSize: 13 }}>{"★".repeat(n)}<span style={{ opacity: 0.2 }}>{"★".repeat(3 - n)}</span></span>;
}

function CodeBlock({ code, label }) {
  if (!code) return null;
  return (
    <div style={{ margin: "10px 0" }}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>}
      <pre style={{ background: "var(--bg-code)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", fontSize: 12.5, lineHeight: 1.55, overflowX: "auto", fontFamily: "'SF Mono','Fira Code','Consolas',monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {code}
      </pre>
    </div>
  );
}

function InlineCode({ children }) {
  return <code style={{ background: "var(--bg-code)", padding: "1px 5px", borderRadius: 4, fontSize: 13, fontFamily: "'SF Mono',monospace" }}>{children}</code>;
}

function FormatText({ text }) {
  if (!text) return null;
  return <div style={{ lineHeight: 1.7, fontSize: 14 }}>{text.split(/(`[^`]+`)/g).map((p, j) =>
    p.startsWith("`") && p.endsWith("`")
      ? <code key={j} style={{ background: "var(--bg-code)", padding: "1px 5px", borderRadius: 4, fontSize: 13, fontFamily: "'SF Mono',monospace" }}>{p.slice(1, -1)}</code>
      : p
  )}</div>;
}

function StepsList({ steps }) {
  if (!steps || !steps.length) return null;
  return (
    <div style={{ margin: "10px 0" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Steps</div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, lineHeight: 1.6 }}>
          <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 13, minWidth: 22, fontFamily: "monospace" }}>{i + 1}.</span>
          <FormatText text={s} />
        </div>
      ))}
    </div>
  );
}

function Collapsible({ title, children, defaultOpen = false, accent }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: `1px solid ${accent || "var(--border)"}`, borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "12px 16px", background: accent ? accent + "12" : "var(--bg-section)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: "var(--text)", textAlign: "left" }}>
        <span style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", fontSize: 12 }}>▶</span>
        {title}
      </button>
      {open && <div style={{ padding: "4px 16px 16px" }}>{children}</div>}
    </div>
  );
}

function PsetCard({ pset, showFull = true }) {
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ padding: "14px 16px", borderRadius: 8, background: done ? "var(--bg-done)" : "var(--bg-card)", border: `1px solid ${done ? "var(--green)" : "var(--border)"}`, marginBottom: 10, transition: "all 0.2s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Stars n={pset.star} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>{pset.title}</span>
          </div>
          {pset.objective && <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 8, lineHeight: 1.6, fontStyle: "italic", opacity: 0.85 }}>{pset.objective}</div>}
          {showFull ? (
            <>
              <StepsList steps={pset.steps} />
              {pset.example && <CodeBlock code={pset.example} label="Expected output" />}
              {pset.starter && <CodeBlock code={pset.starter} label="Starter code" />}
              {pset.hints && <div style={{ marginTop: 8, padding: "8px 12px", background: "var(--bg-stretch)", borderRadius: 6, fontSize: 13, lineHeight: 1.6 }}><strong>Hint:</strong> <FormatText text={pset.hints} /></div>}
              {pset.drill && <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Drills: {pset.drill}</div>}
            </>
          ) : (
            <>
              {!expanded && <button onClick={() => setExpanded(true)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", padding: 0, fontSize: 13 }}>Show details →</button>}
              {expanded && <>
                <StepsList steps={pset.steps} />
                {pset.example && <CodeBlock code={pset.example} label="Expected output" />}
                {pset.starter && <CodeBlock code={pset.starter} label="Starter code" />}
                {pset.hints && <div style={{ marginTop: 8, padding: "8px 12px", background: "var(--bg-stretch)", borderRadius: 6, fontSize: 13, lineHeight: 1.6 }}><strong>Hint:</strong> <FormatText text={pset.hints} /></div>}
                {pset.drill && <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Drills: {pset.drill}</div>}
              </>}
            </>
          )}
        </div>
        <button onClick={() => setDone(!done)} title={done ? "Mark incomplete" : "Mark complete"} style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 6, border: `2px solid ${done ? "var(--green)" : "var(--border)"}`, background: done ? "var(--green)" : "transparent", color: done ? "#fff" : "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, transition: "all 0.15s" }}>
          {done ? "✓" : ""}
        </button>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("chapters");
  const [activeChapter, setActiveChapter] = useState(null);
  const [activeSA, setActiveSA] = useState(null);
  const [activeLab, setActiveLab] = useState(null);
  const cRef = useRef(null);

  useEffect(() => { if (cRef.current) cRef.current.scrollTop = 0; }, [activeChapter, activeSA, activeLab, tab]);

  const css = `
    :root { --bg:#0f1117;--bg-nav:#161822;--bg-section:#1a1d2e;--bg-card:#1e2235;--bg-code:#252a3a;--bg-done:#0f2918;--bg-stretch:#1a1a30;--text:#e2e4eb;--text-muted:#8b8fa3;--text-dim:#5a5e72;--border:#2a2e42;--accent:#6366f1;--green:#22c55e;--amber:#f59e0b;--red:#ef4444; }
    @media(prefers-color-scheme:light){:root{--bg:#f8f9fc;--bg-nav:#eef0f5;--bg-section:#f0f2f7;--bg-card:#fff;--bg-code:#eef0f5;--bg-done:#ecfdf5;--bg-stretch:#f0f0ff;--text:#1a1d2e;--text-muted:#6b7084;--text-dim:#9ca0b4;--border:#d5d8e3;--accent:#4f46e5;--green:#16a34a;}}
    *{box-sizing:border-box;margin:0;padding:0}body{background:var(--bg);color:var(--text)}button{font-family:inherit}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
  `;

  const renderChapterDetail = (ch) => (
    <div>
      <button onClick={() => setActiveChapter(null)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0 }}>← Back to chapters</button>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Chapter {ch.num}</h2>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>{ch.title}</h3>
      <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24, padding: "8px 12px", background: "var(--bg-section)", borderRadius: 8 }}>Core concepts: {ch.concepts}</p>

      <Collapsible title={`Practice PSet (${ch.psets.length} problems)`} defaultOpen accent="var(--accent)">
        {ch.psets.map((p, i) => <PsetCard key={i} pset={p} showFull />)}
      </Collapsible>

      <Collapsible title="Applied Assignment" defaultOpen accent="var(--amber)">
        <div style={{ padding: "14px 16px", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border)", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Stars n={ch.applied.star} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>{ch.applied.title}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>({ch.applied.libs})</span>
          </div>
          {ch.applied.objective && <div style={{ fontSize: 14, fontStyle: "italic", opacity: 0.85, marginBottom: 8, lineHeight: 1.6 }}>{ch.applied.objective}</div>}
          <StepsList steps={ch.applied.steps} />
          {ch.applied.starter && <CodeBlock code={ch.applied.starter} label="Starter / reference code" />}
          {ch.applied.example && <CodeBlock code={ch.applied.example} label="Expected output" />}
          {ch.applied.stretch && <div style={{ marginTop: 10, padding: "8px 12px", background: "var(--bg-stretch)", borderRadius: 6, fontSize: 13, lineHeight: 1.6 }}><strong>Stretch:</strong> {ch.applied.stretch}</div>}
        </div>
      </Collapsible>
    </div>
  );

  const renderSADetail = (sa) => (
    <div>
      <button onClick={() => setActiveSA(null)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0 }}>← Back to SA remixes</button>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>SA{sa.num} Remix</h2>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>{sa.title}</h3>
      <div style={{ fontSize: 13, color: "var(--text-muted)", padding: "8px 12px", background: "var(--bg-section)", borderRadius: 8, marginBottom: 12 }}><strong>Original SA:</strong> {sa.original}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)", marginBottom: 6 }}>Cyber Remix: {sa.remix}</div>
      {sa.objective && <div style={{ fontSize: 14, fontStyle: "italic", opacity: 0.85, marginBottom: 14, lineHeight: 1.6 }}>{sa.objective}</div>}
      <StepsList steps={sa.steps} />
      {sa.example && <CodeBlock code={sa.example} label="Example output" />}
      {sa.starter && <CodeBlock code={sa.starter} label="Starter / scaffold code" />}
      {sa.stretch && <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--bg-stretch)", borderRadius: 6, fontSize: 13, lineHeight: 1.6 }}><strong>Stretch:</strong> <FormatText text={sa.stretch} /></div>}
      <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Drills: {sa.drill}</div>
    </div>
  );

  const renderLabDetail = (lab) => (
    <div>
      <button onClick={() => setActiveLab(null)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0 }}>← Back to lab remixes</button>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Lab {lab.num} Remix</h2>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>{lab.title}</h3>
      <div style={{ fontSize: 13, color: "var(--text-muted)", padding: "8px 12px", background: "var(--bg-section)", borderRadius: 8, marginBottom: 12 }}><strong>Original Lab:</strong> {lab.original}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)", marginBottom: 6 }}>Cyber Remix: {lab.remix}</div>
      <div style={{ fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>{lab.desc}</div>

      <Collapsible title="Concept Mapping" defaultOpen accent="var(--accent)">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr>
              <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "2px solid var(--border)", color: "var(--text-muted)" }}>Original Component</th>
              <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "2px solid var(--border)", color: "var(--accent)" }}>Cyber Equivalent</th>
            </tr></thead>
            <tbody>{lab.conceptMap.map(([a, b], i) => (
              <tr key={i}>
                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>{a}</td>
                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)" }}>{b}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Collapsible>

      <Collapsible title="Requirements" defaultOpen accent="var(--amber)">
        {lab.requirements.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, lineHeight: 1.6, fontSize: 14 }}>
            <span style={{ color: "var(--amber)", fontWeight: 700, fontSize: 13, minWidth: 22, fontFamily: "monospace" }}>{i + 1}.</span>
            <FormatText text={r} />
          </div>
        ))}
      </Collapsible>

      <Collapsible title="Sample Data & Test Inputs" defaultOpen accent="#8b5cf6">
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Copy this data to create your test files and test scenarios.</div>
        <CodeBlock code={lab.sampleData} label="Sample data" />
      </Collapsible>

      <Collapsible title="Milestones" defaultOpen accent="var(--green)">
        {[{ label: "CHECKPOINT", color: "var(--amber)", text: lab.checkpoint },
          { label: "FULL SUBMISSION", color: "var(--green)", text: lab.full },
          { label: "STRETCH", color: "var(--accent)", text: lab.stretch }].map((m, i) => (
          <div key={i} style={{ marginBottom: 10, padding: "10px 14px", background: i === 2 ? "var(--bg-stretch)" : "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: m.color, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{m.label}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>{m.text}</div>
          </div>
        ))}
      </Collapsible>
    </div>
  );

  const allChapters = [...CHAPTERS];

  const renderList = () => {
    if (tab === "chapters") {
      if (activeChapter !== null) {
        const ch = CHAPTERS.find(c => c.num === activeChapter);
        if (ch) return renderChapterDetail(ch);
	  }
      return (
        <div>
          <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>18 chapters of practice problems and applied assignments mapped to Project Python. Each reinforces core CS1 concepts through practical cybersecurity scenarios. </p>
          {allChapters.map((ch) => (
			  <button key={ch.id} onClick={() => setActiveChapter(ch.num)} style={{ display: "flex", width: "100%", alignItems: "center", gap: 14, padding: "14px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 8, cursor: "pointer", textAlign: "left", color: "var(--text)", transition: "border-color 0.15s" }}
				onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
				onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
				<div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{ch.num}</div>
				<div style={{ flex: 1, minWidth: 0 }}>
				  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{ch.title}</div>
				  <div style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
					{ch.psets.length} practice + 1 applied · {ch.concepts.slice(0, 60)}…
				  </div>
				</div>
				<span style={{ color: "var(--text-dim)", fontSize: 18 }}>›</span>
			  </button>
			))}
        </div>
      );
    }
    if (tab === "sa") {
      if (activeSA !== null) {
        const sa = SA_REMIXES.find(s => s.num === activeSA);
        if (sa) return renderSADetail(sa);
      }
      return (
        <div>
          <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>1-to-1 remixes of each CS1 Short Assignment. Same concepts and scope, cybersecurity domain. Each includes scaffold code, example outputs, and structured steps. </p>
          {SA_REMIXES.map((sa) => (
			  <button key={sa.id} onClick={() => setActiveSA(sa.num)} style={{ display: "flex", width: "100%", alignItems: "center", gap: 14, padding: "14px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 8, cursor: "pointer", textAlign: "left", color: "var(--text)", transition: "border-color 0.15s" }}
				onMouseEnter={e => e.currentTarget.style.borderColor = "var(--amber)"}
				onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
				<div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--amber)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{sa.num}</div>
				<div style={{ flex: 1, minWidth: 0 }}>
				  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{sa.remix}</div>
				  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Original: {sa.title}</div>
				</div>
				<span style={{ color: "var(--text-dim)", fontSize: 18 }}>›</span>
			  </button>
			))}
        </div>
      );
    }
    if (tab === "labs") {
      if (activeLab !== null) {
        const lab = LAB_REMIXES.find(l => l.num === activeLab);
        if (lab) return renderLabDetail(lab);
      }
      return (
        <div>
          <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>Multi-week lab remixes with full concept mapping, structured requirements, sample test data, and milestone checkpoints. </p>
          {LAB_REMIXES.map((lab) => (
            <button key={lab.id} onClick={() => setActiveLab(lab.num)} style={{ display: "flex", width: "100%", alignItems: "center", gap: 14, padding: "14px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 8, cursor: "pointer", textAlign: "left", color: "var(--text)", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--green)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>L{lab.num}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{lab.remix}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lab.title}</div>
              </div>
              <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "var(--green)", color: "#fff", fontWeight: 700 }}>FULL</span>
              <span style={{ color: "var(--text-dim)", fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>
      );
    }
  };

  const tabs = [
    { key: "chapters", label: "Chapters", count: 18, color: "var(--accent)" },
    { key: "sa", label: "SA Remixes", count: 9, color: "var(--amber)" },
    { key: "labs", label: "Lab Remixes", count: 3, color: "var(--green)" },
  ];

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <style>{css}</style>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>🛡</span>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>CS1 Cyber Practice</h1>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>Supplementary exercises for Project Python — mapped to each chapter, focused on practical cybersecurity applications using standard Python (no cs1lib).</p>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 2 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setActiveChapter(null); setActiveSA(null); setActiveLab(null); }}
              style={{ padding: "8px 16px", background: tab === t.key ? t.color + "18" : "transparent", border: "none", borderBottom: tab === t.key ? `2px solid ${t.color}` : "2px solid transparent", color: tab === t.key ? t.color : "var(--text-muted)", cursor: "pointer", fontSize: 14, fontWeight: 600, borderRadius: "6px 6px 0 0", transition: "all 0.15s" }}>
              {t.label} <span style={{ fontSize: 12, opacity: 0.7 }}>({t.count})</span>
            </button>
          ))}
        </div>

        <div ref={cRef}>{renderList()}</div>

        <div style={{ marginTop: 40, padding: "16px 0", borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6 }}>
          All exercises use standard Python 3 — no cs1lib needed. Key libraries: os, sys, string, math, time, hashlib, secrets, struct, socket, json, subprocess. These are supplementary exercises for your own learning alongside the official CS1 course.
        </div>
      </div>
    </div>
  );
}
