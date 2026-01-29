export const C_SYLLABUS = [
    {
        id: "c_basics",
        topic_name: "Module 1: C Basics",
        progress_status: "not_started",
        concept: {
            theory: "Introduction to C, Structure of C program, Keywords, Identifiers, Data Types, and Input/Output (printf, scanf).",
            real_life_example: "Writing a letter. Headers (#include) are address. Body (main) is content.",
            syntax: "#include <stdio.h>\nint main() {\n  return 0;\n}"
        },
        example_code: {
            language: "c",
            code: "#include <stdio.h>\nint main() {\n    int age = 20;\n    printf(\"Age: %d\", age);\n    return 0;\n}"
        },
        practice_questions: [
            {
                id: "c_b1",
                title: "ASCII Value",
                difficulty: "Easy",
                definition: "Print ASCII value of a character.",
                initialCode: "#include<stdio.h>\nint main() {\n   // Code\n}"
            }
        ],
        challenge: {
            id: "ch_c_basics",
            title: "Temperature Converter",
            difficulty: "Easy",
            definition: "Convert Celsius to Fahrenheit. F = (C * 9/5) + 32",
            initialCode: "#include<stdio.h>\nint main() {\n    float c = 32;\n    // Convert\n}",
            test_case: {
                input: "None",
                output: "89.6"
            }
        }
    },
    {
        id: "c_control",
        topic_name: "Module 2: Control Flow",
        progress_status: "not_started",
        concept: {
            theory: "Decision Control (if-else), Loop Control (for, while, do-while), and Case Control (switch).",
            real_life_example: "Running on a track. 'for' loop is 'Run 4 laps'. 'while' loop is 'Run until tired'.",
            syntax: "if(a>b) { ... } else { ... }"
        },
        example_code: {
            language: "c",
            code: "#include <stdio.h>\nint main() {\n    int i=0;\n    while(i<5) {\n        printf(\"%d \", i);\n        i++;\n    }\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_c_control",
            title: "Pyramid Pattern",
            difficulty: "Medium",
            definition: "Print a half-pyramid of * up to N rows.",
            initialCode: "#include<stdio.h>\nint main() {\n    int n = 5;\n    // Logic\n}",
            test_case: {
                input: "None",
                output: "*\n**\n***..."
            }
        }
    },
    {
        id: "c_funcs",
        topic_name: "Module 3: Functions",
        progress_status: "not_started",
        concept: {
            theory: "User defined functions vs Library functions. Call by Value vs Call by Reference.",
            real_life_example: "Delegating tasks. You (main) ask the chef (function) to cook. Chef returns food (return value).",
            syntax: "int add(int a, int b) {\n  return a+b;\n}"
        },
        example_code: {
            language: "c",
            code: "#include <stdio.h>\nvoid message() {\n    printf(\"Hello from Function\");\n}\nint main() {\n    message();\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_c_func",
            title: "Swap via Pointers",
            difficulty: "Medium",
            definition: "Swap two numbers using a function and pass-by-reference.",
            initialCode: "#include <stdio.h>\nvoid swap(int *x, int *y) {\n    // logic\n}\nint main() {\n    int a=10, b=20;\n    swap(&a, &b);\n    printf(\"%d %d\", a, b);\n}",
            test_case: {
                input: "None",
                output: "20 10"
            }
        }
    },
    {
        id: "c_arrays",
        topic_name: "Module 4: Arrays & Strings",
        progress_status: "not_started",
        concept: {
            theory: "1D, 2D Arrays. Strings as character arrays. Null terminator `\\0`.",
            real_life_example: "Train cars. Connected in a sequence (array). A word on the train is a String.",
            syntax: "int arr[5];\nchar str[] = \"Hello\";"
        },
        example_code: {
            language: "c",
            code: "#include <string.h>\n#include <stdio.h>\nint main() {\n    char s1[] = \"Hello\";\n    printf(\"Length: %lu\", strlen(s1));\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_c_arr",
            title: "String Reverse",
            difficulty: "Medium",
            definition: "Reverse a string without using library function strrev.",
            initialCode: "#include <stdio.h>\nint main() {\n    char s[] = \"ReverseMe\";\n    // logic\n}",
            test_case: {
                input: "None",
                output: "eMesreveR"
            }
        }
    },
    {
        id: "c_pointers",
        topic_name: "Module 5: Pointers",
        progress_status: "not_started",
        concept: {
            theory: "Pointer stores the address of another variable. Usage: Dynamic memory (`malloc`), Arrays logic, Reference.",
            real_life_example: "A treasure map. The map doesn't contain the gold, it points to the X (address) where gold is.",
            syntax: "int *ptr;\nptr = &var;"
        },
        example_code: {
            language: "c",
            code: "#include <stdio.h>\nint main() {\n    int x = 10;\n    int *p = &x;\n    printf(\"Value at address: %d\", *p);\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_c_ptr",
            title: "Array Sum Pointer",
            difficulty: "Hard",
            definition: "Calculate sum of elements in an array using pointers.",
            initialCode: "#include <stdio.h>\nint main() {\n    int arr[] = {1,2,3,4,5};\n    // Use pointer to sum\n}",
            test_case: {
                input: "None",
                output: "15"
            }
        }
    },
    {
        id: "c_structs",
        topic_name: "Module 6: Structures",
        progress_status: "not_started",
        concept: {
            theory: "User-defined data type that groups different types of variables. `struct`, `union`.",
            real_life_example: "Employee ID Card: Name (char), Age (int), Salary (float). All on one card.",
            syntax: "struct Emp {\n  int id;\n  char name[20];\n};"
        },
        example_code: {
            language: "c",
            code: "#include <stdio.h>\nstruct Book {\n    char title[50];\n    int price;\n};\nint main() {\n    struct Book b1 = {\"C Prog\", 500};\n    printf(\"%s costs %d\", b1.title, b1.price);\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_c_struct",
            title: "Student Database",
            difficulty: "Medium",
            definition: "Store and print information of a student using structure.",
            initialCode: "struct Student {\n    char name[50];\n    int roll;\n};\n// Driver code",
            test_case: {
                input: "None",
                output: "Name: ..., Roll: ..."
            }
        }
    },
    {
        id: "c_file",
        topic_name: "Module 7: File I/O",
        progress_status: "not_started",
        concept: {
            theory: "Handling files in C using `FILE` pointer. fopen, fprintf, fscanf, fclose.",
            real_life_example: "Office Files. You open a file, read/write documents, and put it back (close).",
            syntax: "FILE *f = fopen(\"file.txt\", \"w\");"
        },
        example_code: {
            language: "c",
            code: "#include <stdio.h>\nint main() {\n    printf(\"Opening file example...\");\n    // FILE *f = fopen(\"test.txt\", \"w\");\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_c_file",
            title: "Copy File",
            difficulty: "Hard",
            definition: "Simulate logic to copy content from one file to another.",
            initialCode: "// Use file pointers to copy\nint main(){}",
            test_case: {
                input: "None",
                output: "Copied"
            }
        }
    },
    {
        id: "c_adv",
        topic_name: "Module 8: Advanced C",
        progress_status: "not_started",
        concept: {
            theory: "Dynamic Memory Allocation (malloc, calloc, realloc, free), Macros, Enum, Preprocessors.",
            real_life_example: "Renting a warehouse. You ask for specific space (malloc). If you need more, you extend (realloc). When done, you leave (free).",
            syntax: "int *arr = (int*)malloc(n * sizeof(int));"
        },
        example_code: {
            language: "c",
            code: "#include <stdlib.h>\n#include <stdio.h>\nint main() {\n    int *ptr = (int*)malloc(sizeof(int));\n    *ptr = 100;\n    printf(\"Allocated value: %d\", *ptr);\n    free(ptr);\n    return 0;\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_c_adv",
            title: "Dynamic Array",
            difficulty: "Hard",
            definition: "Create an array of size N dynamically and sum elements.",
            initialCode: "#include <stdlib.h>\n#include <stdio.h>\nint main() {\n    int n = 5;\n    // Malloc logic\n}",
            test_case: {
                input: "None",
                output: "Sum: ..."
            }
        }
    }
];
