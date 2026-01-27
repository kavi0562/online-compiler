export const CPP_SYLLABUS = [
    {
        "topic_name": "1. Introduction",
        "programs": [
            {
                "id": "cpp_intro_1",
                "title": "Say 'Hello, World!' With C++",
                "definition": "Print 'Hello, World!' to stdout.",
                "logic": ["Use std::cout"],
                "sampleInput": "None",
                "sampleOutput": "Hello, World!",
                "initialCode": { "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Hello, World!\";\n    return 0;\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "cpp_intro_2",
                "title": "Input and Output",
                "definition": "Read 3 numbers from stdin and print their sum.",
                "logic": ["Use cin >> a >> b >> c", "Use cout << a+b+c"],
                "sampleInput": "1 2 7",
                "sampleOutput": "10",
                "initialCode": { "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    int a,b,c;\n    cin >> a >> b >> c;\n    cout << a+b+c << endl;\n    return 0;\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "cpp_intro_3",
                "title": "Conditional Statements",
                "definition": "If n<=9 print English word, else 'Greater than 9'.",
                "logic": ["if-else ladder or switch case"],
                "sampleInput": "5",
                "sampleOutput": "five",
                "initialCode": { "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Logic\n    return 0;\n}" },
                "difficulty": "Easy"
            }
        ]
    },
    {
        "topic_name": "2. Strings",
        "programs": [
            {
                "id": "cpp_str_1",
                "title": "Strings",
                "definition": "Given two strings a and b, print their lengths, concatenation, and swap first chars.",
                "logic": ["a.size(), b.size()", "a + b", "Swap a[0], b[0]"],
                "sampleInput": "abcd\nef",
                "sampleOutput": "4 2\nabcdef\nebcd af",
                "initialCode": { "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n\t// Complete the program\n    return 0;\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "cpp_str_2",
                "title": "StringStream",
                "definition": "Parse comma separated integers from a string.",
                "logic": ["stringstream ss(str)", "char ch; int a; while(ss>>a) { push(a); ss>>ch; }"],
                "sampleInput": "23,4,56",
                "sampleOutput": "23\n4\n56",
                "initialCode": { "cpp": "#include <sstream>\n#include <vector>\n#include <iostream>\nusing namespace std;\nvector<int> parseInts(string str) {\n\t// Complete this function\n}\nint main() {\n    string str;\n    cin >> str;\n    vector<int> integers = parseInts(str);\n    for(int i = 0; i < integers.size(); i++) cout << integers[i] << \"\\n\";\n    return 0;\n}" },
                "difficulty": "Medium"
            }
        ]
    },
    {
        "topic_name": "3. Classes and Objects",
        "programs": [
            {
                "id": "cpp_oop_1",
                "title": "Class",
                "definition": "Create a class Student with private fields age, first_name, last_name, standard.",
                "logic": ["Setters and Getters", "to_string() method"],
                "sampleInput": "15\njohn\ncarmack\n10",
                "sampleOutput": "15\ncarmack, john\n10\n\n15,john,carmack,10",
                "initialCode": { "cpp": "#include <iostream>\n#include <sstream>\nusing namespace std;\n// Implement class Student\nint main() {\n    // Driver\n    return 0;\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "cpp_oop_2",
                "title": "Classes and Objects",
                "definition": "Create class Student with scores[5]. Calculate total score and count how many > kristen.",
                "logic": ["Class Student", "Input scores", "calculateTotalScore()"],
                "sampleInput": "3\n30 40 45 10 10\n40 40 40 10 10\n50 20 30 10 10",
                "sampleOutput": "1",
                "initialCode": { "cpp": "#include <vector>\n#include <iostream>\nusing namespace std;\n// Write your code here\nint main() {\n    // Driver code\n}" },
                "difficulty": "Medium"
            }
        ]
    },
    {
        "topic_name": "4. STI (Standard Template Library)",
        "programs": [
            {
                "id": "cpp_stl_1",
                "title": "Vector-Sort",
                "definition": "Sort a vector of integers.",
                "logic": ["sort(v.begin(), v.end())"],
                "sampleInput": "5\n1 6 10 8 4",
                "sampleOutput": "1 4 6 8 10",
                "initialCode": { "cpp": "#include <vector>\n#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    /* Enter your code here. Read input from STDIN. */\n    return 0;\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "cpp_stl_2",
                "title": "Vector-Erase",
                "definition": "Erase elements from a vector (single position and range).",
                "logic": ["v.erase(v.begin()+x)", "v.erase(v.begin()+a, v.begin()+b)"],
                "sampleInput": "6\n1 4 6 2 8 9\n2\n2 4",
                "sampleOutput": "3\n1 8 9",
                "initialCode": { "cpp": "#include <vector>\n#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    /* Format: N, vector, pos to delete, range to delete */\n    return 0;\n}" },
                "difficulty": "Medium"
            },
            {
                "id": "cpp_stl_3",
                "title": "Lower Bound-STL",
                "definition": "Find the first element >= val in a sorted vector.",
                "logic": ["lower_bound(v.begin(), v.end(), val)", "Check iterator"],
                "sampleInput": "8\n1 1 2 2 6 9 9 15\n4\n1\n4\n9\n15",
                "sampleOutput": "Yes 1\nNo 5\nYes 6\nYes 8",
                "initialCode": { "cpp": "#include <vector>\n#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    /* Code */\n    return 0;\n}" },
                "difficulty": "Medium"
            },
            {
                "id": "cpp_stl_4",
                "title": "Maps-STL",
                "definition": "Phone book queries: Add(1), Erase(2), Find(3).",
                "logic": ["map<string,int>", "m.insert or m[str]=val", "m.erase(str)", "m.find(str)"],
                "sampleInput": "7\n1 Jesse 20\n1 Jess 12\n...",
                "sampleOutput": "...",
                "initialCode": { "cpp": "#include <iostream>\n#include <map>\nusing namespace std;\nint main() {\n    // Code\n    return 0;\n}" },
                "difficulty": "Medium"
            }
        ]
    },
    {
        "topic_name": "5. Inheritance",
        "programs": [
            {
                "id": "cpp_inh_1",
                "title": "Inheritance Introduction",
                "definition": "Derive Isosceles from Triangle.",
                "logic": ["class Isosceles : public Triangle"],
                "sampleInput": "None",
                "sampleOutput": "I am an isosceles triangle\nI am a triangle",
                "initialCode": { "cpp": "#include <iostream>\nusing namespace std;\nclass Triangle{\n    public:\n    void triangle(){\n        cout<<\"I am a triangle\\n\";\n    }\n};\n// Implement Isosceles\nint main(){\n    Isosceles isc;\n    isc.isosceles();\n    isc.triangle();\n    return 0;\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "cpp_inh_2",
                "title": "Rectangle Area",
                "definition": "Create classes Rectangle and RectangleArea to compute area.",
                "logic": ["Rectangle has width, height, display()", "RectangleArea has read_input(), display() outputs area"],
                "sampleInput": "10 5",
                "sampleOutput": "10 5\n50",
                "initialCode": { "cpp": "#include <iostream>\nusing namespace std;\n/*\n * Create classes Rectangle and RectangleArea\n */\nint main() {\n    // Driver\n    return 0;\n}" },
                "difficulty": "Medium"
            }
        ]
    },
    {
        "topic_name": "6. Advanced",
        "programs": [
            {
                "id": "cpp_adv_1",
                "title": "Operator Overloading",
                "definition": "Overload + operator to add two Matrices.",
                "logic": ["Matrix operator + (const Matrix& y)", "Nested loop add"],
                "sampleInput": "1\n2 2\n2 2 2 2\n2 2 2 2",
                "sampleOutput": "4 4 \n4 4",
                "initialCode": { "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n// Define Matrix class\nint main() {\n   // Driver logic\n   return 0;\n}" },
                "difficulty": "Hard"
            },
            {
                "id": "cpp_adv_2",
                "title": "Abstract Classes - Polymorphism",
                "definition": "Implement an LRU Cache using abstract class concepts (Map + Doubly Linked List).",
                "logic": ["Override set(k,v) and get(k)", "Manage head/tail pointers"],
                "sampleInput": "3 1\nset 1 2\nget 1\nget 2",
                "sampleOutput": "2\n-1",
                "initialCode": { "cpp": "#include <iostream>\n#include <vector>\n#include <map>\n#include <string>\n#include <algorithm>\n#include <set>\n#include <cassert>\nusing namespace std;\nstruct Node{\n   Node* next;\n   Node* prev;\n   int value;\n   int key;\n   Node(Node* p, Node* n, int k, int val):prev(p),next(n),key(k),value(val){};\n   Node(int k, int val):prev(NULL),next(NULL),key(k),value(val){};\n};\nclass Cache{\n   protected: \n   map<int,Node*> mp; //map the key to the node in the linked list\n   int cp;  //capacity\n   Node* tail; // double linked list tail pointer\n   Node* head; // double linked list head pointer\n   virtual void set(int, int) = 0;\n   virtual int get(int) = 0;\n};\n// Implement LRUCache\nint main() {\n   // Driver\n}" },
                "difficulty": "Hard"
            }
        ]
    }
];
