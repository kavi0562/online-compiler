export const PYTHON_SYLLABUS = [
    {
        id: "py_basics",
        topic_name: "Module 1: Basics",
        progress_status: "not_started",
        concept: {
            theory: "Python is a high-level, interpreted language known for its readability. This module covers installation, print statements, variables, and data types (int, float, str, bool).",
            real_life_example: "Variables are like named boxes in a warehouse. You can label a box 'Toys' and put a toy car inside (`toys = 'car'`).",
            syntax: "name = \"Alice\"\nage = 25\nprint(name, age)"
        },
        example_code: {
            language: "python",
            code: "# Basics Example\nname = \"HackerMode\"\nversion = 2.0\nis_awesome = True\n\nprint(f\"Welcome to {name} v{version}\")\nprint(\"Awesome status:\", is_awesome)"
        },
        practice_questions: [
            {
                id: "py_b1",
                title: "Variable Swap",
                difficulty: "Easy",
                definition: "Swap two variables a and b without a third variable.",
                initialCode: "a = 5\nb = 10\n# Logic here"
            },
            {
                id: "py_b2",
                title: "Type Casting",
                difficulty: "Easy",
                definition: "Convert string '123' to integer and add 10.",
                initialCode: "s = '123'\n# Convert and add"
            }
        ],
        challenge: {
            id: "ch_py_basics",
            title: "Identity Badge",
            difficulty: "Easy",
            definition: "Create a program that takes `name` and `age` as input variables, and prints a formatted badge string: 'Agent [Name], Level [Age]'.",
            initialCode: "name = \"Neo\"\nage = 30\n# Print formatted string",
            test_case: {
                input: "None",
                output: "Agent Neo, Level 30"
            }
        }
    },
    {
        id: "py_control",
        topic_name: "Module 2: Control Statements",
        progress_status: "not_started",
        concept: {
            theory: "Control flow allows your program to make decisions. Use `if`, `elif`, `else` for conditions, and `for`/`while` loops for repetition. `break` and `continue` modify loop behavior.",
            real_life_example: "Traffic lights: IF red, stop. ELIF yellow, wait. ELSE (green), go.",
            syntax: "if x > 10:\n    print('Big')\n\nfor i in range(5):\n    print(i)"
        },
        example_code: {
            language: "python",
            code: "for i in range(1, 6):\n    if i == 3:\n        continue # Skip 3\n    print(f\"Count: {i}\")"
        },
        practice_questions: [
            {
                id: "py_c1",
                title: "Even or Odd",
                difficulty: "Easy",
                definition: "Check if a number is even or odd.",
                initialCode: "num = 7\n# Logic"
            },
            {
                id: "py_c2",
                title: "Sum N Numbers",
                difficulty: "Medium",
                definition: "Calculate sum of first 100 numbers using loop.",
                initialCode: "total = 0\n# Loop"
            }
        ],
        challenge: {
            id: "ch_py_prime",
            title: "Prime Validator",
            difficulty: "Medium",
            definition: "Write a program to check if a given number `n` is prime.",
            initialCode: "n = 29\nis_prime = True\n# Logic to check prime\n\nprint(\"Prime\" if is_prime else \"Not Prime\")",
            test_case: {
                input: "29",
                output: "Prime"
            }
        }
    },
    {
        id: "py_funcs",
        topic_name: "Module 3: Functions",
        progress_status: "not_started",
        concept: {
            theory: "Functions are reusable blocks of code. They accept parameters and return values. recursion is when a function calls itself.",
            real_life_example: "A recipe for a cake. You define the steps once (the function), and you can bake (call) it anytime with different flavors (arguments).",
            syntax: "def greet(name):\n    return f\"Hello {name}\""
        },
        example_code: {
            language: "python",
            code: "def add(a, b=0):\n    return a + b\n\nprint(add(5, 3))\nprint(add(10))"
        },
        practice_questions: [
            {
                id: "py_f1",
                title: "Max of Three",
                difficulty: "Easy",
                definition: "Function to find max of 3 numbers.",
                initialCode: "def max_of_three(a,b,c):\n    pass"
            }
        ],
        challenge: {
            id: "ch_py_fact",
            title: "Factorial Recursion",
            difficulty: "Medium",
            definition: "Calculate factorial of N using a recursive function.",
            initialCode: "def factorial(n):\n    # Recursive logic\n    pass\n\nprint(factorial(5))",
            test_case: {
                input: "5",
                output: "120"
            }
        }
    },
    {
        id: "py_ds",
        topic_name: "Module 4: Data Structures",
        progress_status: "not_started",
        concept: {
            theory: "Python offers powerful built-in data structures: Lists (ordered, mutable), Tuples (ordered, immutable), Sets (unique), and Dictionaries (key-value text). List comprehensions provide concise creation syntax.",
            real_life_example: "A Shopping List (List). A Phone Book (Dictionary). A bag of unique marbles (Set).",
            syntax: "my_list = [1, 2, 3]\nmy_dict = {'a': 1}"
        },
        example_code: {
            language: "python",
            code: "# List Comprehension\nsquares = [x**2 for x in range(5)]\nprint(squares)\n\n# Dict\nuser = {'name': 'Kavi', 'role': 'Admin'}\nprint(user['name'])"
        },
        practice_questions: [
            {
                id: "py_ds1",
                title: "List Sum",
                difficulty: "Easy",
                definition: "Sum all items in a list.",
                initialCode: "nums = [1, 2, 3, 4]\n# Sum logic"
            },
            {
                id: "py_ds2",
                title: "Unique Elements",
                difficulty: "Medium",
                definition: "Remove duplicates from a list using Set.",
                initialCode: "nums = [1, 2, 2, 3]\n# Logic"
            }
        ],
        challenge: {
            id: "ch_py_freq",
            title: "Frequency Counter",
            difficulty: "Hard",
            definition: "Count the frequency of each element in a list using a dictionary.",
            initialCode: "arr = [1, 2, 2, 3, 3, 3]\nfreq = {}\n# Logic to count\nprint(freq)",
            test_case: {
                input: "None",
                output: "{1: 1, 2: 2, 3: 3}"
            }
        }
    },
    {
        id: "py_oop",
        topic_name: "Module 5: OOP",
        progress_status: "not_started",
        concept: {
            theory: "Object-Oriented Programming models real-world entities. Key concepts: Classes, Objects, Constructors (`__init__`), Inheritance, Polymorphism, and Encapsulation.",
            real_life_example: "Class Animal. Object Dog. Dog inherits from Animal but overrides `speak()` (Polymorphism).",
            syntax: "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        print('Woof')"
        },
        example_code: {
            language: "python",
            code: "class Person:\n    def __init__(self, name):\n        self.name = name\n    def say_hi(self):\n        print(f\"Hi, I am {self.name}\")\n\np = Person(\"Alice\")\np.say_hi()"
        },
        practice_questions: [
            {
                id: "py_oop1",
                title: "Class Creation",
                difficulty: "Easy",
                definition: "Create a Car class with brand and model.",
                initialCode: "class Car:\n    pass"
            }
        ],
        challenge: {
            id: "ch_py_bank",
            title: "Bank Account System",
            difficulty: "Hard",
            definition: "Create a BankAccount class with deposit, withdraw, and balance methods. Prevent withdrawal if balance is low.",
            initialCode: "class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n    \n    def deposit(self, amount):\n        pass\n        \n    def withdraw(self, amount):\n        pass\n\n# Test logic",
            test_case: {
                input: "None",
                output: "Status: Success"
            }
        }
    },
    {
        id: "py_files",
        topic_name: "Module 6: File Handling",
        progress_status: "not_started",
        concept: {
            theory: "Python allows reading and writing files. Modes: 'r' (read), 'w' (write), 'a' (append). Use `with open(...)` to ensure files close automatically.",
            real_life_example: "Writing a diary. You open the book, write today's entry (append), and close it.",
            syntax: "with open('file.txt', 'w') as f:\n    f.write('Hello')"
        },
        example_code: {
            language: "python",
            code: "# Writing to a virtual file (simulated)\nprint(\"Writing to data.txt...\")\nprint(\"Reading data.txt: Hello World\")"
        },
        practice_questions: [
            {
                id: "py_file1",
                title: "File Writer",
                difficulty: "Medium",
                definition: "Simulate writing a list of names to a file.",
                initialCode: "names = ['Alice', 'Bob']\n# formatting logic"
            }
        ],
        challenge: {
            id: "ch_py_csv",
            title: "CSV Parser",
            difficulty: "Hard",
            definition: "Parse a simple CSV string 'Name,Age\\nAlice,30' into a dictionary format.",
            initialCode: "csv_data = \"Name,Age\\nAlice,30\\nBob,25\"\n# Parse this string logic",
            test_case: {
                input: "None",
                output: "[{'Name': 'Alice', 'Age': '30'}, {'Name': 'Bob', 'Age': '25'}]"
            }
        }
    },
    {
        id: "py_except",
        topic_name: "Module 7: Exception Handling",
        progress_status: "not_started",
        concept: {
            theory: "Errors crash programs. Exception handling (`try`, `except`, `finally`) lets you handle errors gracefully without stopping execution.",
            real_life_example: "Safety net. If the acrobat falls (error), the net (except block) catches them so the show continues.",
            syntax: "try:\n    x = 1/0\nexcept ZeroDivisionError:\n    print('Can not divide by zero')"
        },
        example_code: {
            language: "python",
            code: "try:\n    num = int(\"not_a_number\")\nexcept ValueError:\n    print(\"Invalid number!\")\nfinally:\n    print(\"Execution done.\")"
        },
        practice_questions: [
            {
                id: "py_ex1",
                title: "Safe Division",
                difficulty: "Easy",
                definition: "Function divides two numbers and handles zero division.",
                initialCode: "def divide(a, b):\n    # try-except"
            }
        ],
        challenge: {
            id: "ch_py_ex",
            title: "Robust Input",
            difficulty: "Medium",
            definition: "Simulate an input loop that keeps asking for an integer until a valid one is provided.",
            initialCode: "def get_int():\n    # simulation logic\n    pass",
            test_case: {
                input: "None",
                output: "Valid integer received"
            }
        }
    },
    {
        id: "py_adv",
        topic_name: "Module 8: Advanced",
        progress_status: "not_started",
        concept: {
            theory: "Advanced topics include Modules (importing code), Virtual Environments (dependency isolation), and Libraries (NumPy, Pandas, etc.).",
            real_life_example: "Using pre-made car parts (Libraries) instead of building the engine from scratch.",
            syntax: "import math\nprint(math.sqrt(16))"
        },
        example_code: {
            language: "python",
            code: "import math\nimport random\n\nprint(\"Sqrt(16):\", math.sqrt(16))\nprint(\"Random:\", random.randint(1, 100))"
        },
        practice_questions: [
            {
                id: "py_adv1",
                title: "Math Module",
                difficulty: "Easy",
                definition: "Use math module to calculate factorial and gcd.",
                initialCode: "import math\n# Logic"
            }
        ],
        challenge: {
            id: "ch_py_sms",
            title: "Student Management System",
            difficulty: "Hard",
            definition: "Create a Mini Project: Class `SMS` to add student, view students, and delete student using a list of dicts.",
            initialCode: "class SMS:\n    def __init__(self):\n        self.students = []\n    def add_student(self, name, roll):\n        self.students.append({'name': name, 'roll': roll})\n    # Implement view and delete\n\nsms = SMS()\nsms.add_student('John', 101)\n# verify logic",
            test_case: {
                input: "None",
                output: "Student Added"
            }
        }
    }
];
