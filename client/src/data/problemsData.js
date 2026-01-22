export const PROBLEMS_DATA = [
    {
        id: "p1",
        title: "Even or Odd",
        definition: "A number perfectly divisible by 2 is Even. (Telugu: Oka number 2 tho divide chesthe remainder 0 vasthe adhi Even number, lekapothe Odd number.)",
        logic: [
            "1. Read integer input 'n'.",
            "2. Check if n % 2 == 0.",
            "3. If true, print 'Even'. Else print 'Odd'."
        ],
        sampleInput: "4",
        sampleOutput: "Even",
        initialCode: {
            python: "n = int(input())\nif n % 2 == 0:\n    print(\"Even\")\nelse:\n    print(\"Odd\")",
            java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if(n % 2 == 0) System.out.println(\"Even\");\n        else System.out.println(\"Odd\");\n    }\n}"
        }
    },
    {
        id: "p2",
        title: "Factorial of a Number",
        definition: "Factorial is the product of all positive integers less than or equal to n. (Telugu: Factorial ante 1 nundi aa number varaku unna anni onkelanu multiply cheyadam.)",
        logic: [
            "1. Initialize fact = 1.",
            "2. Loop from i = 1 to n.",
            "3. Multiply fact = fact * i.",
            "4. Print fact."
        ],
        sampleInput: "5",
        sampleOutput: "120",
        initialCode: {
            python: "n = int(input())\nfact = 1\nfor i in range(1, n+1):\n    fact *= i\nprint(fact)",
            java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long fact = 1;\n        for(int i=1; i<=n; i++) fact *= i;\n        System.out.println(fact);\n    }\n}"
        }
    },
    {
        id: "p3",
        title: "Palindrome Checker",
        definition: "A number or string that reads the same backward as forward. (Telugu: Palindrome ante reverse chesina kuda adhe number/string ravali.)",
        logic: [
            "1. Read input string/number.",
            "2. Reverse it.",
            "3. Compare original with reversed version.",
            "4. If equal, print 'Palindrome'."
        ],
        sampleInput: "madam",
        sampleOutput: "Palindrome",
        initialCode: {
            python: "s = input().strip()\nif s == s[::-1]:\n    print(\"Palindrome\")\nelse:\n    print(\"Not Palindrome\")",
            java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        String rev = new StringBuilder(s).reverse().toString();\n        if(s.equals(rev)) System.out.println(\"Palindrome\");\n        else System.out.println(\"Not Palindrome\");\n    }\n}"
        }
    },
    {
        id: "p4",
        title: "Prime Number",
        definition: "A number greater than 1 that has no divisors other than 1 and itself. (Telugu: Prime number ante 1 mariyu adhe number thappa vere numbers tho divide avvani number.)",
        logic: [
            "1. Read n.",
            "2. If n < 2, not prime.",
            "3. Loop from 2 to sqrt(n).",
            "4. If n is divisible by any i, not prime.",
            "5. Else, it is prime."
        ],
        sampleInput: "7",
        sampleOutput: "Prime",
        initialCode: {
            python: "n = int(input())\nis_prime = True\nif n < 2:\n    is_prime = False\nelse:\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0:\n            is_prime = False\n            break\nif is_prime: print(\"Prime\")\nelse: print(\"Not Prime\")",
            java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        boolean isPrime = true;\n        if(n < 2) isPrime = false;\n        for(int i=2; i*i<=n; i++) {\n            if(n % i == 0) { isPrime = false; break; }\n        }\n        if(isPrime) System.out.println(\"Prime\");\n        else System.out.println(\"Not Prime\");\n    }\n}"
        }
    },
    {
        id: "p5",
        title: "Fibonacci Series",
        definition: "A series where the next number is the sum of the previous two numbers. (Telugu: Mundu rendu numbers kalipithe vache number next vasthundi sequence lo.)",
        logic: [
            "1. Initialize t1=0, t2=1.",
            "2. Print t1, t2.",
            "3. Loop n-2 times.",
            "4. nextTerm = t1 + t2.",
            "5. Update t1=t2, t2=nextTerm."
        ],
        sampleInput: "5",
        sampleOutput: "0 1 1 2 3",
        initialCode: {
            python: "n = int(input())\nt1, t2 = 0, 1\nfor _ in range(n):\n    print(t1, end=' ')\n    t1, t2 = t2, t1+t2",
            java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int t1 = 0, t2 = 1;\n        for(int i=0; i<n; i++) {\n            System.out.print(t1 + \" \");\n            int sum = t1 + t2;\n            t1 = t2;\n            t2 = sum;\n        }\n    }\n}"
        }
    },
    {
        id: "p6",
        title: "Matrix Addition",
        definition: "Addition of two matrices of same dimensions. (Telugu: Rendu matrices ni add cheyadam, same position lo unna elements ni kalapadam.)",
        logic: [
            "1. Initialize two matrices A and B.",
            "2. Create result matrix C.",
            "3. Loop through rows and columns.",
            "4. C[i][j] = A[i][j] + B[i][j]."
        ],
        sampleInput: "A=[[1,1],[1,1]], B=[[2,2],[2,2]]",
        sampleOutput: "[[3,3],[3,3]]",
        initialCode: {
            python: "# Basic 2x2 addition for demo\nA = [[1,2],[3,4]]\nB = [[5,6],[7,8]]\nC = [[0,0],[0,0]]\n\nfor i in range(2):\n    for j in range(2):\n        C[i][j] = A[i][j] + B[i][j]\n\nfor row in C:\n    print(row)",
            java: "public class Main {\n    public static void main(String[] args) {\n        int A[][]={{1,2},{3,4}};\n        int B[][]={{5,6},{7,8}};\n        int C[][] = new int[2][2];\n        for(int i=0;i<2;i++){\n            for(int j=0;j<2;j++){\n                C[i][j]=A[i][j]+B[i][j];\n                System.out.print(C[i][j]+\" \");\n            }\n            System.out.println();\n        }\n    }\n}"
        }
    },
    {
        id: "p7",
        title: "Binary Search",
        definition: "Search a sorted array by repeatedly dividing the search interval in half. (Telugu: Sorted list lo sagam chesthu vethike paddhati.)",
        logic: [
            "1. Sorted array required.",
            "2. Set low=0, high=len-1.",
            "3. While low <= high:",
            "4. mid = (low+high)//2.",
            "5. If arr[mid] == target, return mid. Else adjust low/high."
        ],
        sampleInput: "arr=[1,2,3,4,5], target=4",
        sampleOutput: "Index 3",
        initialCode: {
            python: "arr = [1, 2, 3, 4, 5]\ntarget = 4\nlow, high = 0, len(arr)-1\nfound = False\n\nwhile low <= high:\n    mid = (low + high) // 2\n    if arr[mid] == target:\n        print(f\"Found at index {mid}\")\n        found = True\n        break\n    elif arr[mid] < target:\n        low = mid + 1\n    else:\n        high = mid - 1\n\nif not found: print(\"Not Found\")",
            java: "public class Main {\n    public static void main(String[] args) {\n        int arr[] = {1,2,3,4,5};\n        int target = 4;\n        int low=0, high=arr.length-1;\n        boolean found = false;\n        while(low <= high) {\n            int mid = low + (high-low)/2;\n            if(arr[mid] == target) {\n                System.out.println(\"Found at index \" + mid);\n                found = true;\n                 break;\n            } else if(arr[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        if(!found) System.out.println(\"Not Found\");\n    }\n}"
        }
    }
];
