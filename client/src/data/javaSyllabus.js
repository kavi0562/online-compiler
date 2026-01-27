export const JAVA_SYLLABUS = [
    {
        "topic_name": "1. Introduction to Java",
        "programs": [
            {
                "id": "java_intro_1",
                "title": "Welcome to Java!",
                "definition": "Print 'Hello, World.' on the first line and 'Hello, Java.' on the second line.",
                "logic": ["Use System.out.println() combined with string literals."],
                "sampleInput": "None",
                "sampleOutput": "Hello, World.\nHello, Java.",
                "initialCode": { "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World.\");\n        System.out.println(\"Hello, Java.\");\n    }\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "java_intro_2",
                "title": "Stdin and Stdout",
                "definition": "Read an integer, a double, and a String from standard input, then print them.",
                "logic": ["Use Scanner class.", "Handle newline buffer issues after reading numbers."],
                "sampleInput": "42\n3.1415\nWelcome to HackerMode",
                "sampleOutput": "String: Welcome to HackerMode\nDouble: 3.1415\nInt: 42",
                "initialCode": { "java": "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int i = sc.nextInt();\n        double d = sc.nextDouble();\n        sc.nextLine(); // clear buffer\n        String s = sc.nextLine();\n\n        System.out.println(\"String: \" + s);\n        System.out.println(\"Double: \" + d);\n        System.out.println(\"Int: \" + i);\n    }\n}" },
                "difficulty": "Easy"
            }
        ]
    },
    {
        "topic_name": "2. Control Flow Statements",
        "programs": [
            {
                "id": "java_flow_1",
                "title": "Java If-Else",
                "definition": "If n is odd, print Weird. If even and 2-5, Not Weird. If even and 6-20, Weird. If even > 20, Not Weird.",
                "logic": ["Modulo operator %", "Nested if-else or compound conditions"],
                "sampleInput": "3",
                "sampleOutput": "Weird",
                "initialCode": { "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Logic\n    }\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "java_flow_2",
                "title": "Loops II (Series)",
                "definition": "For queries, print the series: (a + 2^0*b), (a + 2^0*b + 2^1*b), ... (a + ... + 2^n-1*b).",
                "logic": ["Loop through queries q", "Inner loop for n terms", "Maintain current val and add powers of 2"],
                "sampleInput": "2\n0 2 10\n5 3 5",
                "sampleOutput": "2 6 14 30 62 126 254 510 1022 2046\n8 14 26 50 98",
                "initialCode": { "java": "import java.util.*;\nimport java.lang.Math;\npublic class Main {\n    public static void main(String[] args) {\n        // Your code\n    }\n}" },
                "difficulty": "Medium"
            }
        ]
    },
    {
        "topic_name": "3. Strings",
        "programs": [
            {
                "id": "java_str_1",
                "title": "String Reverse (Palindrome)",
                "definition": "Check if a string is a palindrome.",
                "logic": ["Two pointers or StringBuilder reverse()"],
                "sampleInput": "madam",
                "sampleOutput": "Yes",
                "initialCode": { "java": "import java.io.*;\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String A=sc.next();\n        /* Enter your code here. Print Yes or No. */\n    }\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "java_str_2",
                "title": "Anagrams",
                "definition": "Check if two strings are anagrams (contain same characters with same frequencies).",
                "logic": ["Frequency array [26] or HashMap", "Case insensitive"],
                "sampleInput": "anagram\nmargana",
                "sampleOutput": "Anagrams",
                "initialCode": { "java": "import java.util.Scanner;\npublic class Main {\n    static boolean isAnagram(String a, String b) {\n        // Complete the function\n        return false;\n    }\n    public static void main(String[] args) {\n    \t// Driver code\n    }\n}" },
                "difficulty": "Medium"
            },
            {
                "id": "java_str_3",
                "title": "String Tokens",
                "definition": "Split a string by non-alphabetic characters and print tokens.",
                "logic": ["String.split(\"[^A-Za-z]+\")", "Regex handling"],
                "sampleInput": "He is a very very good boy, isn't he?",
                "sampleOutput": "10\nHe\nis\na\nvery\nvery\ngood\nboy\nisn\nt\nhe",
                "initialCode": { "java": "import java.io.*;\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scan = new Scanner(System.in);\n        String s = scan.nextLine();\n        // Write your code here.\n        scan.close();\n    }\n}" },
                "difficulty": "Medium"
            }
        ]
    },
    {
        "topic_name": "4. Data Structures",
        "programs": [
            {
                "id": "java_ds_1",
                "title": "Subarray",
                "definition": "Find the number of subarrays having negative sum.",
                "logic": ["Nested loops for subarrays", "Calculate sum", "Count negative sums"],
                "sampleInput": "5\n1 -2 4 -5 1",
                "sampleOutput": "9",
                "initialCode": { "java": "import java.io.*;\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        // Your code\n    }\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "java_ds_2",
                "title": "Java List",
                "definition": "Perform Insert and Delete operations on a List.",
                "logic": ["Use ArrayList or LinkedList", "Parse queries (Insert x y, Delete x)"],
                "sampleInput": "5\n12 0 1 78 12\n2\nInsert\n5 23\nDelete\n0",
                "sampleOutput": "0 1 78 12 23",
                "initialCode": { "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        // List operations\n    }\n}" },
                "difficulty": "Medium"
            },
            {
                "id": "java_ds_3",
                "title": "Java Map",
                "definition": "Implement a PhoneBook using HashMap. Look up names.",
                "logic": ["HashMap<String, Integer>", "Check containsKey"],
                "sampleInput": "3\nunclevanya 99912222\narrear 11223344\nunclevanya",
                "sampleOutput": "unclevanya=99912222\nNot found",
                "initialCode": { "java": "import java.util.*;\nclass Main{\n   public static void main(String []argh){\n      Scanner in = new Scanner(System.in);\n      int n=in.nextInt();\n      in.nextLine();\n      // Map implementation\n   }\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "java_ds_4",
                "title": "Java Stack",
                "definition": "Check for balanced parentheses in a string.",
                "logic": ["Stack<Character>", "Push on open, Pop on close", "Check empty at end"],
                "sampleInput": "({()})",
                "sampleOutput": "true",
                "initialCode": { "java": "import java.util.*;\nclass Main{\n   public static void main(String []argh){\n      Scanner sc = new Scanner(System.in);\n      while (sc.hasNext()) {\n         String input=sc.next();\n         // Complete the code\n      }\n   }\n}" },
                "difficulty": "Medium"
            }
        ]
    },
    {
        "topic_name": "5. Object Oriented Programming",
        "programs": [
            {
                "id": "java_oop_1",
                "title": "Java Inheritance II",
                "definition": "Write a class Adder that inherits from Arithmetic which has an add method.",
                "logic": ["class Arithmetic { int add(int a, int b) }", "class Adder extends Arithmetic"],
                "sampleInput": "None",
                "sampleOutput": "MySuperclass Name: Arithmetic\n42 13 20",
                "initialCode": { "java": "class Arithmetic {\n    // code\n}\nclass Adder extends Arithmetic {\n    // code\n}\npublic class Main { public static void main(String []args){ Adder a = new Adder(); System.out.println(\"MySuperclass Name: \" + a.getClass().getSuperclass().getName()); System.out.print(a.add(10,32) + \" \" + a.add(10,3) + \" \" + a.add(10,10) + \"\\n\"); } }" },
                "difficulty": "Easy"
            },
            {
                "id": "java_oop_2",
                "title": "Java Interface",
                "definition": "Implement an interface AdvancedArithmetic with method divisor_sum(n).",
                "logic": ["Calculate sum of all divisors of n", "Implement interface in MyCalculator"],
                "sampleInput": "6",
                "sampleOutput": "I implemented: AdvancedArithmetic\n12",
                "initialCode": { "java": "import java.util.*;\ninterface AdvancedArithmetic{\n  int divisor_sum(int n);\n}\nclass MyCalculator implements AdvancedArithmetic {\n    // Implement here\n}\nclass Main{ public static void main(String[] args){ /* Driver */ } }" },
                "difficulty": "Medium"
            },
            {
                "id": "java_oop_3",
                "title": "Java Abstract Class",
                "definition": "Extend abstract class Book to MyBook and implement setTitle.",
                "logic": ["Override abstract method"],
                "sampleInput": "A Tale of Two Cities",
                "sampleOutput": "The title is: A Tale of Two Cities",
                "initialCode": { "java": "abstract class Book { String title; abstract void setTitle(String s); String getTitle(){ return title; } }\n// MyBook class\n" },
                "difficulty": "Easy"
            }
        ]
    },
    {
        "topic_name": "6. Advanced Java",
        "programs": [
            {
                "id": "java_adv_1",
                "title": "Java Varargs",
                "definition": "Create a class with a method add that accepts variable number of integers and sums them.",
                "logic": ["public void add(int... args)", "Loop and accumulate"],
                "sampleInput": "1\n2\n3\n4\n5\n6",
                "sampleOutput": "1+2=3\n1+2+3=6\n...",
                "initialCode": { "java": "import java.io.*;\nimport java.util.*;\nclass Add {\n    // Implementation\n}\npublic class Main { public static void main(String[] args) { /* Driver */ } }" },
                "difficulty": "Easy"
            },
            {
                "id": "java_adv_2",
                "title": "Can You Access?",
                "definition": "Use Reflection to create an instance of a private inner class Inner.",
                "logic": ["Inner class is private", "Use .getDeclaredConstructors()", "setAccessible(true)"],
                "sampleInput": "100",
                "sampleOutput": "100 is power of 2\nAn instance of class: Solution$Inner has been created",
                "initialCode": { "java": "import java.io.*;\nimport java.security.*;\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        // Reflection logic here\n    }\n    static class Inner {\n        private class Private {\n            private String powerof2(int num) {\n                return ((num & num - 1) == 0) ? \"power of 2\" : \"not a power of 2\";\n            }\n        }\n    }\n}" },
                "difficulty": "Hard"
            },
            {
                "id": "java_adv_3",
                "title": "Java Singleton",
                "definition": "Design a class that allows only a single instance of itself to be created.",
                "logic": ["Private constructor", "Public static method getSingleInstance()", "Private static variable instance"],
                "sampleInput": "hello world",
                "sampleOutput": "Hello I am a singleton! Let me say hello world to you",
                "initialCode": { "java": "import java.io.*;\nimport java.util.*;\nclass Singleton{\n    // Complete singleton class\n}\npublic class Main {\n   public static void main(String[] args) {\n       // Driver code\n   }\n}" },
                "difficulty": "Medium"
            }
        ]
    },
    {
        "topic_name": "7. Exception Handling",
        "programs": [
            {
                "id": "java_ex_1",
                "title": "Try-Catch",
                "definition": "Prevent application crash using Try-Catch on division by zero.",
                "logic": ["Wrap code in try", "Catch ArithmeticException", "Catch InputMismatchException"],
                "sampleInput": "10\n0",
                "sampleOutput": "java.lang.ArithmeticException: / by zero",
                "initialCode": { "java": "import java.util.*;\npublic class Main {\n    // Code\n}" },
                "difficulty": "Easy"
            },
            {
                "id": "java_ex_2",
                "title": "Java Exception Handling",
                "definition": "Create a custom calculator that throws exceptions for non-positive inputs.",
                "logic": ["Throw Exception(\"n and p should be non-negative\") if n<0 or p<0", "Throw Exception(\"n and p should not be zero\") if n=0 and p=0"],
                "sampleInput": "3 5",
                "sampleOutput": "243",
                "initialCode": { "java": "class MyCalculator {\n    /*\n    * Create the method long power(int, int) here.\n    */\n}\npublic class Main {\n    public static final MyCalculator my_calculator = new MyCalculator();\n    public static void main(String[] args) {\n        // Driver\n    }\n}" },
                "difficulty": "Medium"
            }
        ]
    }
];
