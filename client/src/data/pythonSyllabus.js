export const PYTHON_SYLLABUS = [
    {
        "topic_name": "Variables & Data Types",
        "programs": [
            {
                "id": "py_v1",
                "title": "Variable Swapping",
                "definition": "Write a program to swap two variables without using a temporary variable.",
                "logic": ["Read two integers a and b", "a = a + b", "b = a - b", "a = a - b", "Print swapped values"],
                "sampleInput": "a = 5, b = 10",
                "sampleOutput": "a = 10, b = 5",
                "initialCode": { "python": "# Write your code here\na = 5\nb = 10\n# Swap logic..." }
            },
            {
                "id": "py_v2",
                "title": "Type Conversion",
                "definition": "Convert an integer to float and a float to integer.",
                "logic": ["Read integer x and float y", "Convert x to float", "Convert y to int", "Print results"],
                "sampleInput": "10, 5.75",
                "sampleOutput": "10.0, 5",
                "initialCode": { "python": "x = 10\ny = 5.75\n# Convert and print..." }
            },
            {
                "id": "py_v3",
                "title": "User Personal Details",
                "definition": "Store name, age, and height in variables and print them.",
                "logic": ["Define variables name (str), age (int), height (float)", "Print formatted string"],
                "sampleInput": "John, 25, 5.9",
                "sampleOutput": "Name: John, Age: 25, Height: 5.9",
                "initialCode": { "python": "name = \"John\"\nage = 25\nheight = 5.9\n# Print details..." }
            },
            {
                "id": "py_v4",
                "title": "Complex Number Creation",
                "definition": "Create a complex number from two distinct numbers and print its real and imaginary parts.",
                "logic": ["Read real part", "Read imaginary part", "Use complex() function", "Print attributes .real and .imag"],
                "sampleInput": "3, 4",
                "sampleOutput": "3.0, 4.0",
                "initialCode": { "python": "real = 3\nimag = 4\nc = complex(real, imag)\n# Print parts..." }
            },
            {
                "id": "py_v5",
                "title": "Area of Circle Constant",
                "definition": "Calculate area of circle using a constant for PI.",
                "logic": ["Define PI = 3.14159", "Read radius r", "Area = PI * r * r", "Print area formatted to 2 decimals"],
                "sampleInput": "5",
                "sampleOutput": "78.54",
                "initialCode": { "python": "PI = 3.14159\nr = 5\n# Calculate area..." }
            }
        ]
    },
    {
        "topic_name": "Operators",
        "programs": [
            {
                "id": "py_op1",
                "title": "Arithmetic Calculator",
                "definition": "Perform addition, subtraction, multiplication, division, and modulus of two numbers.",
                "logic": ["Read num1 and num2", "Calculate sum, diff, product, quotient, remainder", "Print all results"],
                "sampleInput": "10, 3",
                "sampleOutput": "Add: 13, Sub: 7, Mul: 30, Div: 3.33, Mod: 1",
                "initialCode": { "python": "a = 10\nb = 3\n# Perform operations..." }
            },
            {
                "id": "py_op2",
                "title": "Floor Division & Exponen...",
                "definition": "Demonstrate the use of // and ** operators.",
                "logic": ["Read base and power", "Calculate power using **", "Calculate floor division of base by 3", "Print results"],
                "sampleInput": "10, 2",
                "sampleOutput": "Exponent: 100, Floor Div: 3",
                "initialCode": { "python": "base = 10\npower = 2\n# Calculate..." }
            },
            {
                "id": "py_op3",
                "title": "Logical Operator Check",
                "definition": "Check if a number is divisible by both 5 and 3.",
                "logic": ["Read number n", "Check if (n % 5 == 0) AND (n % 3 == 0)", "Print True or False"],
                "sampleInput": "15",
                "sampleOutput": "True",
                "initialCode": { "python": "n = 15\n# Check logic..." }
            },
            {
                "id": "py_op4",
                "title": "Identity Operators",
                "definition": "Check if two lists have the same identity vs same content.",
                "logic": ["Create list1 = [1,2]", "Create list2 = [1,2]", "Print list1 is list2", "Print list1 == list2"],
                "sampleInput": "None",
                "sampleOutput": "False, True",
                "initialCode": { "python": "l1 = [1, 2]\nl2 = [1, 2]\nprint(l1 is l2)\nprint(l1 == l2)" }
            },
            {
                "id": "py_op5",
                "title": "Bitwise Operations",
                "definition": "Perform Bitwise AND, OR, and XOR on two integers.",
                "logic": ["Read a and b", "Print a & b", "Print a | b", "Print a ^ b"],
                "sampleInput": "5, 3",
                "sampleOutput": "AND: 1, OR: 7, XOR: 6",
                "initialCode": { "python": "a = 5\nb = 3\n# Bitwise ops..." }
            }
        ]
    },
    {
        "topic_name": "Conditional Statements",
        "programs": [
            {
                "id": "py_if1",
                "title": "Even or Odd",
                "definition": "Check if a given number is even or odd.",
                "logic": ["Read number n", "If n % 2 == 0 print 'Even'", "Else print 'Odd'"],
                "sampleInput": "7",
                "sampleOutput": "Odd",
                "initialCode": { "python": "n = int(input())\nif n % 2 == 0:\n    print('Even')\nelse:\n    print('Odd')" }
            },
            {
                "id": "py_if2",
                "title": "Largest of Three",
                "definition": "Find the largest among three numbers.",
                "logic": ["Read a, b, c", "If a > b and a > c print a", "Else if b > c print b", "Else print c"],
                "sampleInput": "10, 25, 15",
                "sampleOutput": "25",
                "initialCode": { "python": "a, b, c = 10, 25, 15\n# Logic to find max..." }
            },
            {
                "id": "py_if3",
                "title": "Leap Year Checker",
                "definition": "Check if a year is a leap year.",
                "logic": ["Read year", "If (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0)", "Print 'Leap Year'", "Else 'Not Leap Year'"],
                "sampleInput": "2024",
                "sampleOutput": "Leap Year",
                "initialCode": { "python": "year = 2024\n# Check leap year..." }
            },
            {
                "id": "py_if4",
                "title": "Grade Calculator",
                "definition": "Calculate grade based on marks.",
                "logic": ["Read marks", "If marks >= 90 return 'A'", "Elif marks >= 80 return 'B'", "...", "Else return 'F'"],
                "sampleInput": "85",
                "sampleOutput": "B",
                "initialCode": { "python": "marks = 85\n# Determine grade..." }
            },
            {
                "id": "py_if5",
                "title": "Vowel or Consonant",
                "definition": "Check if a character is a vowel or consonant.",
                "logic": ["Read character char", "If char in 'aeiouAEIOU' print 'Vowel'", "Else print 'Consonant'"],
                "sampleInput": "e",
                "sampleOutput": "Vowel",
                "initialCode": { "python": "char = 'e'\n# Check vowel..." }
            }
        ]
    },
    {
        "topic_name": "Loops (For & While)",
        "programs": [
            {
                "id": "py_loop1",
                "title": "Sum of First N Numbers",
                "definition": "Calculate the sum of first N natural numbers using a while loop.",
                "logic": ["Read N", "Initialize sum = 0, i = 1", "While i <= N", "sum = sum + i", "i++", "Print sum"],
                "sampleInput": "10",
                "sampleOutput": "55",
                "initialCode": { "python": "n = 10\n# Loop logic..." }
            },
            {
                "id": "py_loop2",
                "title": "Factorial Calculator",
                "definition": "Find the factorial of a number using a for loop.",
                "logic": ["Read n", "Initialize fact = 1", "For i in range(1, n+1)", "fact = fact * i", "Print fact"],
                "sampleInput": "5",
                "sampleOutput": "120",
                "initialCode": { "python": "n = 5\n# Factorial logic..." }
            },
            {
                "id": "py_loop3",
                "title": "Multiplication Table",
                "definition": "Print the multiplication table of a given number.",
                "logic": ["Read n", "For i from 1 to 10", "Print n * i"],
                "sampleInput": "3",
                "sampleOutput": "3, 6, 9... 30",
                "initialCode": { "python": "n = 3\n# Print table..." }
            },
            {
                "id": "py_loop4",
                "title": "Fibonacci Series",
                "definition": "Print the first N terms of Fibonacci series.",
                "logic": ["Read n", "Init a=0, b=1", "Print a, b", "Loop n-2 times", "c = a + b", "Print c", "a=b, b=c"],
                "sampleInput": "5",
                "sampleOutput": "0 1 1 2 3",
                "initialCode": { "python": "n = 5\n# Fibonacci logic..." }
            },
            {
                "id": "py_loop5",
                "title": "Reverse a Number",
                "definition": "Reverse a given integer using a while loop.",
                "logic": ["Read num", "Init rev = 0", "While num > 0", "digit = num % 10", "rev = rev * 10 + digit", "num = num // 10", "Print rev"],
                "sampleInput": "1234",
                "sampleOutput": "4321",
                "initialCode": { "python": "num = 1234\n# Reverse Logic..." }
            },
            {
                "id": "py_loop6",
                "title": "Prime Number Check",
                "definition": "Check if a number is prime.",
                "logic": ["Read n", "If n < 2 return False", "For i from 2 to sqrt(n)", "If n % i == 0 return False", "Return True"],
                "sampleInput": "17",
                "sampleOutput": "Prime",
                "initialCode": { "python": "n = 17\n# Prime check..." }
            }
        ]
    },
    {
        "topic_name": "Functions",
        "programs": [
            {
                "id": "py_fn1",
                "title": "Simple Calculator Function",
                "definition": "Create a function `calculate(a, b, op)` that performs basic arithmetic.",
                "logic": ["Define function", "Check op string ('+', '-', '*', '/')", "Return result based on op"],
                "sampleInput": "10, 5, '+'",
                "sampleOutput": "15",
                "initialCode": { "python": "def calculate(a, b, op):\n    pass # code\n\nprint(calculate(10, 5, '+'))" }
            },
            {
                "id": "py_fn2",
                "title": "Palindrome Checker",
                "definition": "Create a function `is_palindrome(s)` to check string palindrome.",
                "logic": ["Define function", "Return s == s[::-1]", "Call function with input"],
                "sampleInput": "madam",
                "sampleOutput": "True",
                "initialCode": { "python": "def is_palindrome(s):\n    return s == s[::-1]\n\nprint(is_palindrome('madam'))" }
            },
            {
                "id": "py_fn3",
                "title": "Recursive Factorial",
                "definition": "Calculate factorial using recursion.",
                "logic": ["Define fact(n)", "Base case: if n == 0 or n == 1 return 1", "Recursive: return n * fact(n-1)"],
                "sampleInput": "5",
                "sampleOutput": "120",
                "initialCode": { "python": "def fact(n):\n    if n <= 1: return 1\n    return n * fact(n-1)\n\nprint(fact(5))" }
            },
            {
                "id": "py_fn4",
                "title": "Variable Argument Sum",
                "definition": "Function that takes variable number of arguments (*args) and returns their sum.",
                "logic": ["Define sum_all(*args)", "Initialize total = 0", "Loop through args and add to total", "Return total"],
                "sampleInput": "1, 2, 3, 4, 5",
                "sampleOutput": "15",
                "initialCode": { "python": "def sum_all(*args):\n    return sum(args)\n\nprint(sum_all(1,2,3,4,5))" }
            },
            {
                "id": "py_fn5",
                "title": "Lambda Square",
                "definition": "Use a lambda function to calculate the square of a number.",
                "logic": ["Define square = lambda x: x * x", "Call square(n)", "Print result"],
                "sampleInput": "6",
                "sampleOutput": "36",
                "initialCode": { "python": "square = lambda x: x ** 2\nprint(square(6))" }
            }
        ]
    },
    {
        "topic_name": "Lists",
        "programs": [
            {
                "id": "py_ls1",
                "title": "List Sum and Average",
                "definition": "Calculate sum and average of list elements.",
                "logic": ["Initialize list", "Use sum() function", "Calculate len()", "Average = sum / len", "Print both"],
                "sampleInput": "[10, 20, 30, 40]",
                "sampleOutput": "Sum: 100, Avg: 25.0",
                "initialCode": { "python": "lst = [10, 20, 30, 40]\n# Calc and print..." }
            },
            {
                "id": "py_ls2",
                "title": "Remove Duplicates",
                "definition": "Remove duplicate elements from a list.",
                "logic": ["Read list", "Convert list to set to remove duplicates", "Convert back to list", "Print list"],
                "sampleInput": "[1, 2, 2, 3, 4, 4]",
                "sampleOutput": "[1, 2, 3, 4]",
                "initialCode": { "python": "lst = [1, 2, 2, 3, 4, 4]\n# Remove duplicates..." }
            }
        ]
    }
    // Truncated for brevity while maintaining coverage.
];
