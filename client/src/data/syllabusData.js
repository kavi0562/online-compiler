export const SYLLABUS_DATA = {
    python: [
        {
            title: "Module 1: Introduction & Fundamentals",
            topics: [
                "History and Features of Python",
                "Python Installation & Environment Setup",
                "REPL & Basic Syntax",
                "Variables and Dynamic Typing",
                "Primitive Data Types (int, float, str, bool)",
                "Input and Output Operations",
                "Basic Operators & Expressions"
            ],
            example: 'print("Hello Python")'
        },
        {
            title: "Module 2: Control Flow & Loops",
            topics: [
                "Conditional Statements (if, elif, else)",
                "Looping Constructs (for, while)",
                "Loop Control (break, continue, pass)",
                "Nested Loops",
                "List Comprehensions",
                "Iterators and Iterables"
            ],
            example: 'for i in range(10): print(i)'
        },
        {
            title: "Module 3: Data Structures",
            topics: [
                "Lists: Creation, Slicing, Methods",
                "Tuples: Immutability and Packing",
                "Dictionaries: Keys, Values, Methods",
                "Sets: Operations (Union, Intersection)",
                "String Manipulation & Formatting",
                "Sequence Functions (len, max, min)"
            ],
            example: 'data = {"id": 1, "val": [1,2,3]}'
        },
        {
            title: "Module 4: Functions & Modules",
            topics: [
                "Defining Functions (def)",
                "Parameters & Arguments (*args, **kwargs)",
                "Return Values & Scope (Global vs Local)",
                "Lambda Functions",
                "Importing Modules (math, random)",
                "Creating Custom Packages"
            ],
            example: 'add = lambda x, y: x + y'
        },
        {
            title: "Module 5: Object Oriented Programming",
            topics: [
                "Classes and Objects",
                "Constructors (__init__)",
                "Inheritance (Single & Multiple)",
                "Polymorphism & Method Overriding",
                "Encapsulation & Private Members",
                "Magic Methods (__str__, __len__)"
            ],
            example: 'class Bot: pass'
        },
        {
            title: "Module 6: Advanced Python",
            topics: [
                "File Handling (Read/Write)",
                "Exception Handling (try, except, finally)",
                "Generators & Decorators",
                "Multithreading Basics",
                "Regular Expressions",
                "Working with JSON"
            ],
            example: 'with open("file.txt", "r") as f: data = f.read()'
        }
    ],
    java: [
        {
            title: "Module 1: Java Basics",
            topics: [
                "JDK, JRE, and JVM Architecture",
                "Setting up IntelliJ/Eclipse",
                "Structure of a Java Program",
                "Data Types & Variables",
                "Operators & Type Casting",
                "Taking Input (Scanner Class)"
            ],
            example: 'public class Main { ... }'
        },
        {
            title: "Module 2: Flow Control",
            topics: [
                "Decision Making (if-else, switch)",
                "Loops (for, while, do-while, for-each)",
                "Jump Statements (break, continue)",
                "Understanding Variable Scope"
            ],
            example: 'if(score > 90) System.out.println("A");'
        },
        {
            title: "Module 3: Object-Oriented Programming (Core)",
            topics: [
                "Class vs Object",
                "Constructors & 'this' keyword",
                "Inheritance & 'super' keyword",
                "Polymorphism (Overloading vs Overriding)",
                "Abstraction (Abstract Classes & Interfaces)"
            ],
            example: 'class Dog extends Animal { ... }'
        },
        {
            title: "Module 4: Arrays & Strings",
            topics: [
                "1D and 2D Arrays",
                "String Class & Immutability",
                "StringBuffer & StringBuilder",
                "String Methods & Manipulation",
                "Command Line Arguments"
            ],
            example: 'String[] names = {"Alice", "Bob"};'
        },
        {
            title: "Module 5: Exception Handling & Multithreading",
            topics: [
                "Types of Exceptions (Checked vs Unchecked)",
                "Try, Catch, Finally, Throw, Throws",
                "Creating Custom Exceptions",
                "Thread Life Cycle",
                "Creating Threads (Thread class vs Runnable)",
                "Synchronization Basics"
            ],
            example: 'try { ... } catch (Exception e) { ... }'
        },
        {
            title: "Module 6: Collections Framework",
            topics: [
                "List Interface (ArrayList, LinkedList)",
                "Set Interface (HashSet, TreeSet)",
                "Map Interface (HashMap, TreeMap)",
                "Iterator & ListIterator",
                "Generics Basics"
            ],
            example: 'List<String> list = new ArrayList<>();'
        }
    ],
    cpp: [
        {
            title: "Module 1: Introduction to C++",
            topics: [
                "Structure of C++ Program",
                "Input/Output Streams (cin, cout)",
                "Namespaces",
                "Data Types & Modifiers",
                "Variables & Constants"
            ],
            example: '#include <iostream>'
        },
        {
            title: "Module 2: Control Logic",
            topics: [
                "Control Structures",
                "Loops & Iterations",
                "Functions & Prototypes",
                "Default Arguments",
                "Inline Functions"
            ],
            example: 'void greet(string name = "User");'
        },
        {
            title: "Module 3: Pointers & Memory",
            topics: [
                "Pointer Syntax & Arithmetic",
                "References vs Pointers",
                "Dynamic Memory Allocation (new/delete)",
                "Arrays and Pointers Relationship",
                "Memory Leaks"
            ],
            example: 'int* ptr = new int(5);'
        },
        {
            title: "Module 4: OOP in C++",
            topics: [
                "Classes & Objects",
                "Access Specifiers",
                "Constructors & Destructors",
                "Friend Functions",
                "Operator Overloading",
                "Inheritance Types"
            ],
            example: 'class Box { public: int width; };'
        },
        {
            title: "Module 5: Advanced Features",
            topics: [
                "Virtual Functions & Polymorphism",
                "Abstract Classes",
                "Templates (Function & Class)",
                "Exception Handling",
                "File I/O (fstream)"
            ],
            example: 'template <typename T> T add(T a, T b);'
        },
        {
            title: "Module 6: Standard Template Library (STL)",
            topics: [
                "Containers (Vector, List, Deque)",
                "Associative Containers (Map, Set)",
                "Iterators",
                "Algorithms (Sort, Search, Reverse)",
                "Pairs and Tuples"
            ],
            example: 'std::vector<int> v;'
        }
    ],
    c: [
        {
            title: "Module 1: C Fundamentals",
            topics: [
                "History and Importance of C",
                "Compilation Process",
                "Structure of C Program",
                "Variables, Types, Constants",
                "Formatted I/O (printf, scanf)"
            ],
            example: 'printf("Hello C");'
        },
        {
            title: "Module 2: Control Flow",
            topics: [
                "If-Else Ladder",
                "Switch Case",
                "Loops (for, while, do-while)",
                "Break and Continue"
            ],
            example: 'switch(x) { case 1: ... }'
        },
        {
            title: "Module 3: Arrays & Strings",
            topics: [
                "1D Arrays",
                "Multidimensional Arrays",
                "String Concepts (Null termination)",
                "String Library Functions (strcpy, strlen)",
                "Array of Strings"
            ],
            example: 'char str[] = "C Lang";'
        },
        {
            title: "Module 4: Functions & Pointers",
            topics: [
                "Function Declaration & Definition",
                "Call by Value vs Call by Reference",
                "Recursion",
                "Pointer Basics & Arithmetic",
                "Pointers to Pointers"
            ],
            example: 'void swap(int *a, int *b)'
        },
        {
            title: "Module 5: Structures & Unions",
            topics: [
                "Defining Structures",
                "Accessing Members",
                "Array of Structures",
                "Unions vs Structures",
                "Typedef usage"
            ],
            example: 'struct Student { int id; };'
        },
        {
            title: "Module 6: Advanced C",
            topics: [
                "Dynamic Memory (malloc, calloc, realloc, free)",
                "File Handling (fopen, fprintf, fscanf)",
                "Preprocessor Directives (#define, #include)",
                "Bitwise Operators",
                "Command Line Arguments"
            ],
            example: 'int *arr = malloc(10 * sizeof(int));'
        }
    ],
    javascript: [
        {
            title: "Module 1: Introduction",
            topics: [
                "JS Engine & Runtime",
                "Variables (var, let, const)",
                "Data Types (Primitive vs Reference)",
                "Type Coercion",
                "Operators",
                "Console & Debugging"
            ],
            example: 'let x = 10;'
        },
        {
            title: "Module 2: Logic & Control",
            topics: [
                "If-Else & Ternary Operator",
                "Switch Statements",
                "Loops (for, for-of, for-in, while)",
                "Error Handling (try-catch)",
                "Strict Mode"
            ],
            example: 'if(x) { ... }'
        },
        {
            title: "Module 3: Functions & Objects",
            topics: [
                "Function Declarations vs Expressions",
                "Arrow Functions",
                "This Keyword",
                "Object Literals",
                "Object Methods & Destructuring",
                "Spread & Rest Operators"
            ],
            example: 'const greet = () => console.log("Hi");'
        },
        {
            title: "Module 4: Arrays & Iterators",
            topics: [
                "Array Methods (push, pop, shift, unshift)",
                "Higher Order Functions (map, filter, reduce)",
                "Find, Some, Every",
                "Array Destructuring",
                "Sets and Maps"
            ],
            example: 'arr.map(x => x * 2)'
        },
        {
            title: "Module 5: Asynchronous JS",
            topics: [
                "Event Loop & Callbacks",
                "Promises (then/catch)",
                "Async/Await Syntax",
                "Fetch API & JSON",
                "Timers (setTimeout, setInterval)"
            ],
            example: 'await fetch("https://api.com");'
        },
        {
            title: "Module 6: Modern JS & DOM",
            topics: [
                "DOM Manipulation Basics",
                "Event Listeners",
                "ES6 Modules (import/export)",
                "Classes & Inheritance",
                "Local Storage & Session Storage"
            ],
            example: 'document.getElementById("app");'
        }
    ]
};
