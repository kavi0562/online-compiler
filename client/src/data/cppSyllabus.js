export const CPP_SYLLABUS = [
    {
        id: "cpp_basics",
        topic_name: "Module 1: C++ Basics",
        progress_status: "not_started",
        concept: {
            theory: "Introduction to C++. IOStreams (cin, cout), Namespaces, Data Types, and Type Modifiers.",
            real_life_example: "C++ is C with \"Superpowers\" (Classes, STL). `cout` is speaking, `cin` is listening.",
            syntax: "#include <iostream>\nusing namespace std;\nint main() {}"
        },
        example_code: {
            language: "cpp",
            code: "#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Hello C++\" << endl;\n    return 0;\n}"
        },
        practice_questions: [
            {
                id: "cpp_b1",
                title: "Cin Cout",
                difficulty: "Easy",
                definition: "Read 3 numbers and print their product.",
                initialCode: "#include <iostream>\nusing namespace std;\nint main() {\n    // Code\n}"
            }
        ],
        challenge: {
            id: "ch_cpp_basics",
            title: "Data Types Size",
            difficulty: "Easy",
            definition: "Print the size of fundamental data types using `sizeof`.",
            initialCode: "#include <iostream>\nusing namespace std;\nint main() {\n    // Print sizes\n}",
            test_case: {
                input: "None",
                output: "4 1 4 8"
            }
        }
    },
    {
        id: "cpp_control",
        topic_name: "Module 2: Control Structures",
        progress_status: "not_started",
        concept: {
            theory: "If-Else, Switch, For, While, and Do-While loops. Control flow governs valid program execution paths.",
            real_life_example: "A train track switch. If switch is left, go track A (if). Else go track B (else).",
            syntax: "if(condition) {} else {}"
        },
        example_code: {
            language: "cpp",
            code: "#include <iostream>\nusing namespace std;\nint main() {\n    int n = 10;\n    if (n > 5) cout << \"Greater\";\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_cpp_prime",
            title: "Nth Fibonacci",
            difficulty: "Medium",
            definition: "Print the Nth Fibonacci number.",
            initialCode: "#include <iostream>\nusing namespace std;\nint main() {\n    int n = 5;\n    // Logic\n}",
            test_case: {
                input: "5",
                output: "5"
            }
        }
    },
    {
        id: "cpp_funcs",
        topic_name: "Module 3: Functions & Refs",
        progress_status: "not_started",
        concept: {
            theory: "Functions, Default Arguments, Inline Functions, and References (&). Reference variables are aliases.",
            real_life_example: "Nicknames. 'Robert' is the variable. 'Bob' is a reference to 'Robert'. If Bob gets a haircut, Robert gets a haircut.",
            syntax: "void swap(int &x, int &y);"
        },
        example_code: {
            language: "cpp",
            code: "#include <iostream>\nusing namespace std;\nvoid increment(int &num) {\n    num++;\n}\nint main() {\n    int a = 10;\n    increment(a);\n    cout << a;\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_cpp_ref",
            title: "Swap Reference",
            difficulty: "Easy",
            definition: "Swap two integers using pass by reference.",
            initialCode: "void swap(int &a, int &b) { /*...*/ }",
            test_case: {
                input: "None",
                output: "Swapped"
            }
        }
    },
    {
        id: "cpp_oop",
        topic_name: "Module 4: OOP Concepts",
        progress_status: "not_started",
        concept: {
            theory: "Classes, Objects, Access Specifiers (public, private, protected), Constructors, Destructors.",
            real_life_example: "Factory mold (Class) -> Product (Object). Constructor is the assembly line startup.",
            syntax: "class Box {\n  public:\n   double length;\n};"
        },
        example_code: {
            language: "cpp",
            code: "#include <iostream>\nusing namespace std;\nclass Wall {\n    public:\n    double length;\n    Wall(double len) {\n        length = len;\n    }\n};\nint main() {\n    Wall w(10.5);\n    cout << w.length;\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_cpp_class",
            title: "Student Class",
            difficulty: "Medium",
            definition: "Create Student class with scores. Calculate total.",
            initialCode: "class Student { /*...*/ };",
            test_case: {
                input: "None",
                output: "Total: ..."
            }
        }
    },
    {
        id: "cpp_adv_oop",
        topic_name: "Module 5: Advanced OOP",
        progress_status: "not_started",
        concept: {
            theory: "Inheritance, Polymorphism (Operator Overloading, Virtual Functions), Abstraction, Encapsulation.",
            real_life_example: "Universal Remote (Interface). It works on TV, AC, DVD (Polymorphism).",
            syntax: "class Base { virtual void show() {} };"
        },
        example_code: {
            language: "cpp",
            code: "#include <iostream>\nusing namespace std;\nclass Animal {\n    public:\n    virtual void sound() { cout << \"...\"; }\n};\nclass Cat : public Animal {\n    public:\n    void sound() { cout << \"Meow\"; }\n};\nint main() {\n    Animal *a = new Cat();\n    a->sound();\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_cpp_poly",
            title: "Area Overload",
            difficulty: "Hard",
            definition: "Overload function `area` to calculate area of Circle and Rectangle.",
            initialCode: "int area(int side) { }\nint area(int l, int b) { }",
            test_case: {
                input: "None",
                output: "Areas Calculated"
            }
        }
    },
    {
        id: "cpp_stl",
        topic_name: "Module 6: STL (Vectors/Maps)",
        progress_status: "not_started",
        concept: {
            theory: "Standard Template Library: Vectors (dynamic array), Maps (key-value), Sets, Algorithms (sort, reverse).",
            real_life_example: "A Swiss Army Knife. Tools for everything pre-built.",
            syntax: "vector<int> v; v.push_back(1);"
        },
        example_code: {
            language: "cpp",
            code: "#include <vector>\n#include <iostream>\nusing namespace std;\nint main() {\n    vector<string> cars = {\"Tesla\", \"BMW\"};\n    cars.push_back(\"Ford\");\n    cout << cars.size();\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_cpp_stl",
            title: "Vector Sort",
            difficulty: "Medium",
            definition: "Input N integers into a vector and sort them.",
            initialCode: "#include <algorithm>\n#include <vector>\n// Logic",
            test_case: {
                input: "5 3 1",
                output: "1 3 5"
            }
        }
    },
    {
        id: "cpp_file",
        topic_name: "Module 7: File Handling",
        progress_status: "not_started",
        concept: {
            theory: "File stream classes: `fstream`, `ifstream` (read), `ofstream` (write). Open modes.",
            real_life_example: "Writing a notebook.",
            syntax: "ofstream file(\"test.txt\"); file << \"Hi\";"
        },
        example_code: {
            language: "cpp",
            code: "#include <fstream>\n#include <iostream>\nusing namespace std;\nint main() {\n    ofstream MyFile(\"filename.txt\");\n    MyFile << \"Files are fun!\";\n    MyFile.close();\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_cpp_file",
            title: "Log Reader",
            difficulty: "Hard",
            definition: "Simulate reading a config file line by line.",
            initialCode: "#include <fstream>\n// Logic",
            test_case: {
                input: "None",
                output: "Read Success"
            }
        }
    },
    {
        id: "cpp_except",
        topic_name: "Module 8: Exception Handling",
        progress_status: "not_started",
        concept: {
            theory: "Try, Catch, Throw blocks to handle runtime anomalies.",
            real_life_example: "Airbag system. Crash (Throw Exception) -> Airbag deploys (Catch).",
            syntax: "try { throw 20; } catch (int e) { ... }"
        },
        example_code: {
            language: "cpp",
            code: "#include <iostream>\nusing namespace std;\nint main() {\n    try {\n        int age = 15;\n        if (age < 18) throw \"denied\";\n    }\n    catch (const char* msg) {\n        cout << \"Access \" << msg;\n    }\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_cpp_ex",
            title: "Division Check",
            difficulty: "Medium",
            definition: "Handle division by zero using exceptions.",
            initialCode: "double division(int a, int b) {\n    if(b==0) throw \"DivZero\";\n    return a/b;\n}",
            test_case: {
                input: "10 0",
                output: "Error: DivZero"
            }
        }
    }
];
