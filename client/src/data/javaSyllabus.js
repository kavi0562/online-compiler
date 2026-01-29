export const JAVA_SYLLABUS = [
    {
        id: "java_basics",
        topic_name: "Module 1: Java Basics",
        progress_status: "not_started",
        concept: {
            theory: "Covers Java program structure, JDK setup (theory), main method, data types (int, double, boolean, char), and basic I/O.",
            real_life_example: "The `main` method is the ignition key of a car. Without it, the program (car) won't start.",
            syntax: "public static void main(String[] args) {\n    System.out.println(\"Hi\");\n}"
        },
        example_code: {
            language: "java",
            code: "public class Main {\n    public static void main(String[] args) {\n        String name = \"Java\";\n        int version = 17;\n        System.out.println(\"Language: \" + name);\n        System.out.println(\"Version: \" + version);\n    }\n}"
        },
        practice_questions: [
            {
                id: "java_b1",
                title: "Formatted Output",
                difficulty: "Easy",
                definition: "Print variables using System.out.printf.",
                initialCode: "public class Main {\n    public static void main(String[] args) {\n        double price = 10.50;\n        // Print formatted\n    }\n}"
            }
        ],
        challenge: {
            id: "ch_java_basics",
            title: "Bio Data Generator",
            difficulty: "Easy",
            definition: "Take name (string), age (int), and salary (double) and print a formatted profile card.",
            initialCode: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        String name = \"James\";\n        int age = 25;\n        double salary = 5000.50;\n        // Print Logic\n    }\n}",
            test_case: {
                input: "None",
                output: "Name: James | Age: 25"
            }
        }
    },
    {
        id: "java_control",
        topic_name: "Module 2: Control Flow",
        progress_status: "not_started",
        concept: {
            theory: "Decision making with if-else, switch-case. Loops: for, while, do-while. Break and Continue statements.",
            real_life_example: "Switch Case is like a vending machine selection. Press 1 -> Coke, 2 -> Pepsi, Default -> Water.",
            syntax: "switch(expression) {\n  case x:\n    // code\n    break;\n  default:\n    // code\n}"
        },
        example_code: {
            language: "java",
            code: "public class Main {\n    public static void main(String[] args) {\n        for(int i=1; i<=5; i++) {\n            if(i==3) continue;\n            System.out.println(\"Step \" + i);\n        }\n    }\n}"
        },
        practice_questions: [
            {
                id: "java_c1",
                title: "Grade Calculator",
                difficulty: "Easy",
                definition: "Use if-else to print grade based on marks (90+ A, etc).",
                initialCode: "int marks = 85;\n// Logic"
            }
        ],
        challenge: {
            id: "ch_java_prime",
            title: "Prime Series",
            difficulty: "Medium",
            definition: "Print all prime numbers up to N.",
            initialCode: "public class Main {\n    public static void main(String[] args) {\n        int N = 20;\n        // Print primes up to 20\n    }\n}",
            test_case: {
                input: "None",
                output: "2 3 5 7 11 13 17 19"
            }
        }
    },
    {
        id: "java_methods",
        topic_name: "Module 3: Methods",
        progress_status: "not_started",
        concept: {
            theory: "Methods are code blocks that run when called. Covers return types, parameters, method overloading, and recursion.",
            real_life_example: "A function is like a juicer. Input: Fruits (params). Process: Blending. Output: Juice (return value).",
            syntax: "static int myMethod(int x) {\n  return 5 + x;\n}"
        },
        example_code: {
            language: "java",
            code: "public class Main {\n    static void greet(String name) {\n        System.out.println(\"Hello \" + name);\n    }\n    public static void main(String[] args) {\n        greet(\"Alice\");\n    }\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_java_method",
            title: "Overloading Calculator",
            difficulty: "Medium",
            definition: "Create two `add` methods: one for 2 integers, one for 3 integers.",
            initialCode: "public class Main {\n    // Define methods\n    public static void main(String[] args) {\n        // Call methods\n    }\n}",
            test_case: {
                input: "None",
                output: "sum2: 10, sum3: 15"
            }
        }
    },
    {
        id: "java_arrays",
        topic_name: "Module 4: Arrays & Strings",
        progress_status: "not_started",
        concept: {
            theory: "Arrays are fixed-size collections. Strings are immutable objects in Java. Covers String pool, StringBuilder, and multi-dimensional arrays.",
            real_life_example: "A hotel floor (Array) has a fixed number of rooms. Modifying a string is like demolishing a house and rebuilding it (immutable), vs StringBuilder which is renovating.",
            syntax: "int[] myNum = {10, 20};\nString txt = \"Ali\";"
        },
        example_code: {
            language: "java",
            code: "public class Main {\n    public static void main(String[] args) {\n        String[] cars = {\"Volvo\", \"BMW\"};\n        System.out.println(cars[0]);\n    }\n}"
        },
        practice_questions: [
            {
                id: "java_str1",
                title: "Palindrome Check",
                difficulty: "Medium",
                definition: "Check if string is palindrome.",
                initialCode: "String s = \"madam\";"
            }
        ],
        challenge: {
            id: "ch_java_matrix",
            title: "Matrix Addition",
            difficulty: "Hard",
            definition: "Add two 2x2 matrices.",
            initialCode: "public class Main {\n    public static void main(String[] args) {\n        int[][] a = {{1,2},{3,4}};\n        int[][] b = {{5,6},{7,8}};\n        // Logic\n    }\n}",
            test_case: {
                input: "None",
                output: "6 8 \n10 12"
            }
        }
    },
    {
        id: "java_oop_core",
        topic_name: "Module 5: OOP Core",
        progress_status: "not_started",
        concept: {
            theory: "The heart of Java. Classes, Objects, Constructors (\"default\", \"parameterized\"), `this` keyword, and Encapsulation (Getters/Setters).",
            real_life_example: "Blueprint (Class) vs Building (Object). `this` refers to the specific building you are standing in.",
            syntax: "class MyClass {\n  private int x;\n  public int getX() { return x; }\n}"
        },
        example_code: {
            language: "java",
            code: "class Person {\n    private String name;\n    public Person(String name) { this.name = name; }\n    public String getName() { return name; }\n}\npublic class Main {\n    public static void main(String[] args) { \n        Person p = new Person(\"John\");\n        System.out.println(p.getName());\n    }\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_java_encap",
            title: "Bank Account Encapsulation",
            difficulty: "Medium",
            definition: "Create a class Account with private balance. Only allow deposit/withdraw via methods.",
            initialCode: "class Account {\n    private double balance;\n    // methods\n}",
            test_case: {
                input: "None",
                output: "Success"
            }
        }
    },
    {
        id: "java_oop_adv",
        topic_name: "Module 6: OOP Advanced",
        progress_status: "not_started",
        concept: {
            theory: "Inheritance (`extends`), Polymorphism (Overriding), Abstraction (`abstract` classes, `interfaces`), and `super` keyword.",
            real_life_example: "A Smartphone `extends` Phone. It inherits calling but overrides `camera()`.",
            syntax: "class Car extends Vehicle {\n  @Override\n  void honk() { ... }\n}"
        },
        example_code: {
            language: "java",
            code: "class Animal {\n    void sound() { System.out.println(\"...\"); }\n}\nclass Dog extends Animal {\n    void sound() { System.out.println(\"Bark\"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Animal a = new Dog();\n        a.sound();\n    }\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_java_poly",
            title: "Shape Area",
            difficulty: "Hard",
            definition: "Create abstract class Shape with abstract method area(). Implement for Circle and Rectangle.",
            initialCode: "abstract class Shape { abstract double area(); }\n// Implement child classes",
            test_case: {
                input: "None",
                output: "Circle Area: ..."
            }
        }
    },
    {
        id: "java_collections",
        topic_name: "Module 7: Collections",
        progress_status: "not_started",
        concept: {
            theory: "The Collections framework provides architecture to store and manipulate groups of objects. List (ArrayList, LinkedList), Set (HashSet), Map (HashMap).",
            real_life_example: "A playlist is a List (order matters). A bag of marbles is a Set (order doesn't matter, unique). Dictionary is a Map.",
            syntax: "ArrayList<String> list = new ArrayList<>();\nlist.add(\"A\");"
        },
        example_code: {
            language: "java",
            code: "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, String> cities = new HashMap<>();\n        cities.put(\"UK\", \"London\");\n        System.out.println(cities.get(\"UK\"));\n    }\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_java_col",
            title: "Unique Word Counter",
            difficulty: "Medium",
            definition: "Given a list of words with duplicates, print only unique words using a HashSet.",
            initialCode: "import java.util.*;\npublic class Main { \n    // Logic\n}",
            test_case: {
                input: "None",
                output: "Unique count: ..."
            }
        }
    },
    {
        id: "java_except",
        topic_name: "Module 8: Exception Handling",
        progress_status: "not_started",
        concept: {
            theory: "Handling runtime errors using try-catch blocks. Checked vs Unchecked exceptions. `finally` block and `throws` keyword.",
            real_life_example: "Driving with a spare tire. If a flat tire happens (Exception), you switch to the spare (catch) and reach destination (flow continues).",
            syntax: "try {\n  // code\n} catch(Exception e) {\n  // handle\n}"
        },
        example_code: {
            language: "java",
            code: "public class Main {\n    public static void main(String[] args) {\n        try {\n            int d = 10/0;\n        } catch(ArithmeticException e) {\n             System.out.println(\"Cannot divide by zero\");\n        }\n    }\n}"
        },
        practice_questions: [],
        challenge: {
            id: "ch_java_ex",
            title: "Custom Exception",
            difficulty: "Hard",
            definition: "Create `InvalidAgeException`. Throw it if age < 18.",
            initialCode: "class InvalidAgeException extends Exception { ... }\n// Driver",
            test_case: {
                input: "15",
                output: "Exception: Invalid Age"
            }
        }
    }
];
