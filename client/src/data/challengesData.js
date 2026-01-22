export const CHALLENGES_DATA = {
    python: [
        {
            id: "py_01",
            title: "Hello World",
            description: "Write a program that prints 'Hello, World!' to the console.",
            notes: "Use the print() function to output text.",
            sampleInput: "None",
            sampleOutput: "Hello, World!",
            initialCode: "# Write your code below\nprint(\"Hello, World!\")"
        },
        {
            id: "py_02",
            title: "Sum of Two Numbers",
            description: "Read two integers from input and print their sum.",
            notes: "1. Read input using input()\n2. Convert to int using int()\n3. Use + operator",
            sampleInput: "3\n5",
            sampleOutput: "8",
            initialCode: "# Read two inputs\na = int(input())\nb = int(input())\n\n# Calculate sum\n\n# Print result"
        },
        {
            id: "py_03",
            title: "Check Even or Odd",
            description: "Write a program to check if a number is even or odd.",
            notes: "Use the modulus operator %. If n % 2 == 0, it's even.",
            sampleInput: "4",
            sampleOutput: "Even",
            initialCode: "n = int(input())\n\nif n % 2 == 0:\n    print(\"Even\")\nelse:\n    print(\"Odd\")"
        },
        {
            id: "py_04",
            title: "find Maximum of Three",
            description: "Find the largest among three numbers entered by user.",
            notes: "Use if-elif-else logic to compare numbers.",
            sampleInput: "10\n5\n20",
            sampleOutput: "20",
            initialCode: "a = int(input())\nb = int(input())\nc = int(input())\n\n# Write logic to find max"
        },
        {
            id: "py_05",
            title: "Factorial of a Number",
            description: "Calculate the factorial of a given non-negative integer.",
            notes: "Factorial of n (n!) = 1 * 2 * ... * n. Use a loop or recursion.",
            sampleInput: "5",
            sampleOutput: "120",
            initialCode: "n = int(input())\nfact = 1\n\n# Loop to calculate factorial\n\nprint(fact)"
        },
        {
            id: "py_06",
            title: "Palindrome Checker",
            description: "Check if a given string is a palindrome.",
            notes: "A palindrome reads the same backwards. Compare string with its reverse (s[::-1]).",
            sampleInput: "madam",
            sampleOutput: "True",
            initialCode: "s = input().strip()\n\n# Check palindrome\nif s == s[::-1]:\n    print(\"True\")\nelse:\n    print(\"False\")"
        }
    ],
    java: [
        {
            id: "java_01",
            title: "Hello World",
            description: "Print 'Hello, World!' to the console.",
            notes: "Use System.out.println() inside the main method.",
            sampleInput: "None",
            sampleOutput: "Hello, World!",
            initialCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}"
        },
        {
            id: "java_02",
            title: "Add Two Integers",
            description: "Read two integers and print their sum.",
            notes: "Use Scanner class for input.",
            sampleInput: "10\n20",
            sampleOutput: "30",
            initialCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}"
        },
        {
            id: "java_03",
            title: "Even or Odd",
            description: "Check if a given integer is even or odd.",
            notes: "Use if-else statement and modulus operator %.",
            sampleInput: "7",
            sampleOutput: "Odd",
            initialCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Write logic here\n    }\n}"
        },
        {
            id: "java_04",
            title: "Fibonacci Series",
            description: "Print the first n terms of the Fibonacci series.",
            notes: "Start with 0 and 1. Next term = previous + current.",
            sampleInput: "5",
            sampleOutput: "0 1 1 2 3",
            initialCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int t1 = 0, t2 = 1;\n        // Loop to print series\n    }\n}"
        },
        {
            id: "java_05",
            title: "Reverse a String",
            description: "Reverse a given input string.",
            notes: "Use StringBuilder's reverse() method or a loop.",
            sampleInput: "Java",
            sampleOutput: "avaJ",
            initialCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        // Reverse and print\n    }\n}"
        }
    ]
};
