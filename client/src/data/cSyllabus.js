export const C_SYLLABUS = [
    {
        "topic_name": "1. Introduction",
        "programs": [
            {
                "id": "c_intro_1",
                "title": "Hello World!",
                "definition": "Print \"Hello, World!\" on one line and input string on the next.",
                "logic": ["scanf(\"%[^\\n]%*c\", s) to read line", "printf"],
                "sampleInput": "Welcome to C programming.",
                "sampleOutput": "Hello, World!\nWelcome to C programming.",
                "initialCode": { "c": "#include <stdio.h>\n#include <string.h>\n#include <math.h>\n#include <stdlib.h>\n\nint main() \n{\n    char s[100];\n    scanf(\"%[^\\n]%*c\", &s);\n    printf(\"Hello, World!\\n\");\n    printf(\"%s\", s);\n    return 0;\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "c_intro_2",
                "title": "Playing With Characters",
                "definition": "Input a character, a string, and a sentence, then print them.",
                "logic": ["scanf(\"%c\")", "scanf(\"%s\")", "scanf(\"\\n\"); scanf(\"%[^\\n]%*c\", s)"],
                "sampleInput": "C\nLanguage\nWelcome To C!!",
                "sampleOutput": "C\nLanguage\nWelcome To C!!",
                "initialCode": { "c": "#include <stdio.h>\nint main() \n{\n    char ch;\n    char s[100];\n    char sen[100];\n    // Write your code here\n    return 0;\n}" },
                "difficulty": "Easy"
            }
        ]
    },
    {
        "topic_name": "2. Conditionals and Loops",
        "programs": [
            {
                "id": "c_cond_1",
                "title": "Sum of Digits of a Five Digit Number",
                "definition": "Given a five digit integer, print the sum of its digits.",
                "logic": ["Modulo 10 to get last digit", "Divide by 10 to remove last digit", "Loop 5 times"],
                "sampleInput": "10564",
                "sampleOutput": "16",
                "initialCode": { "c": "#include <stdio.h>\nint main() {\n    int n; \n    scanf(\"%d\", &n);\n    // logic\n    return 0;\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "c_cond_2",
                "title": "Bitwise Operators",
                "definition": "Calculate the maximum value of AND, OR, and XOR less than K for 1..N.",
                "logic": ["Nested loops i from 1 to n, j from i+1 to n", "Calculate values", "Update max if value < k"],
                "sampleInput": "5 4",
                "sampleOutput": "2\n3\n3",
                "initialCode": { "c": "#include <stdio.h>\nvoid calculate_the_maximum(int n, int k) {\n  // Code\n}\nint main() {\n    int n, k;\n    scanf(\"%d %d\", &n, &k);\n    calculate_the_maximum(n, k);\n    return 0;\n}" },
                "difficulty": "Medium"
            },
            {
                "id": "c_cond_3",
                "title": "Printing Pattern Using Loops",
                "definition": "Print a pattern of numbers in a square grid of size 2n-1.",
                "logic": ["Distance from borders logic: min(i, j, len-1-i, len-1-j)", "Value is n - dist"],
                "sampleInput": "2",
                "sampleOutput": "2 2 2\n2 1 2\n2 2 2",
                "initialCode": { "c": "#include <stdio.h>\nint main() \n{\n    int n;\n    scanf(\"%d\", &n);\n    // Loop logic\n    return 0;\n}" },
                "difficulty": "Medium"
            }
        ]
    },
    {
        "topic_name": "3. Arrays and Strings",
        "programs": [
            {
                "id": "c_arr_1",
                "title": "1D Arrays in C",
                "definition": "Create an array, read input, and print sum.",
                "logic": ["malloc array of size n", "loop read", "loop sum"],
                "sampleInput": "6\n16 13 7 2 1 12",
                "sampleOutput": "51",
                "initialCode": { "c": "#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int n, sum=0;\n    scanf(\"%d\", &n);\n    int *arr = (int*)malloc(n * sizeof(int));\n    // logic\n    return 0;\n}" },
                "difficulty": "Medium"
            },
            {
                "id": "c_arr_2",
                "title": "Array Reversal",
                "definition": "Reverse an array of size n.",
                "logic": ["Swap arr[i] with arr[n-1-i]", "Loop until n/2"],
                "sampleInput": "6\n16 13 7 2 1 12",
                "sampleOutput": "12 1 2 7 13 16",
                "initialCode": { "c": "#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    // Code\n    return 0;\n}" },
                "difficulty": "Medium"
            },
            {
                "id": "c_arr_3",
                "title": "Printing Tokens",
                "definition": "Print each word of a sentence on a new line.",
                "logic": ["Read char by char", "If space, print newline", "Else print char"],
                "sampleInput": "This is C",
                "sampleOutput": "This\nis\nC",
                "initialCode": { "c": "#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\nint main() {\n    char *s = malloc(1024 * sizeof(char));\n    scanf(\"%[^\\n]\", s);\n    s = realloc(s, strlen(s) + 1);\n    // Logic\n    return 0;\n}" },
                "difficulty": "Medium"
            }
        ]
    },
    {
        "topic_name": "4. Functions",
        "programs": [
            {
                "id": "c_func_1",
                "title": "Calculate the Nth Term",
                "definition": "Recursion: S(n) = S(n-1) + S(n-2) + S(n-3).",
                "logic": ["Base cases for n=1, 2, 3", "Recursive call"],
                "sampleInput": "5\n1 2 3",
                "sampleOutput": "11",
                "initialCode": { "c": "#include <stdio.h>\nint find_nth_term(int n, int a, int b, int c) {\n  // Code \n}\nint main() {\n    // Code \n}" },
                "difficulty": "Easy"
            },
            {
                "id": "c_func_2",
                "title": "Variadic Functions",
                "definition": "Functions that accept variable number of arguments (sum, min, max).",
                "logic": ["Use stdarg.h", "va_list, va_start, va_arg, va_end"],
                "sampleInput": "1\n10 1 2 3 4 5 6 7 8 9 10",
                "sampleOutput": "55",
                "initialCode": { "c": "#include <stdarg.h>\n#include <stdio.h>\nint sum (int count,...) {\n    // Code\n}\nint main() {\n    // Driver\n}" },
                "difficulty": "Hard"
            },
            {
                "id": "c_func_3",
                "title": "Permutations of Strings",
                "definition": "Print all permutations of an array of strings.",
                "logic": ["Recursive backtracking", "Swap logic"],
                "sampleInput": "2\nab cd",
                "sampleOutput": "ab cd\ncd ab",
                "initialCode": { "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n// Logic\nint main(){\n    // Driver\n}" },
                "difficulty": "Hard"
            }
        ]
    },
    {
        "topic_name": "5. Structs and Enums",
        "programs": [
            {
                "id": "c_struct_1",
                "title": "Boxes through a Tunnel",
                "definition": "Use structs to filter boxes with height < 41.",
                "logic": ["struct box { int length, width, height; }", "get_volume function"],
                "sampleInput": "2\n10 10 10\n20 20 50",
                "sampleOutput": "1000",
                "initialCode": { "c": "#include <stdio.h>\n#include <stdlib.h>\n#define MAX_HEIGHT 41\nstruct box {\n    int length, width, height;\n};\ntypedef struct box box;\nint get_volume(box b) {\n    return b.length * b.width * b.height;\n}\nint is_lower_than_max_height(box b) {\n    return b.height < MAX_HEIGHT;\n}\nint main() {\n    // Driver\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "c_struct_2",
                "title": "Structuring the Document",
                "definition": "Manage a document as paragraphs, sentences, words using nested structs.",
                "logic": ["struct word, sentence, paragraph, document", "Parsing logic"],
                "sampleInput": "Learning C is fun.\nLearning C is challenging.",
                "sampleOutput": "Learning",
                "initialCode": { "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <assert.h>\n#define MAX_CHARACTERS 1005\n#define MAX_PARAGRAPHS 5\nstruct word {\n    char* data;\n};\nstruct sentence {\n    struct word* data;\n    int word_count;\n};\nstruct paragraph {\n    struct sentence* data  ;\n    int sentence_count;\n};\nstruct document {\n    struct paragraph* data;\n    int paragraph_count;\n};\n// Functions\nint main() {\n    // Driver\n}" },
                "difficulty": "Hard"
            }
        ]
    }
];
