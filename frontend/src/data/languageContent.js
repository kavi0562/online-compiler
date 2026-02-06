export const languageContent = {
    python: {
        title: "Online Python Compiler",
        heroText: "Write, Run, and Share Python Code Instantly",
        content: `
            <article class="prose lg:prose-xl max-w-none">
                <h2>Why Use Our Online Python Compiler?</h2>
                <p>
                    Our <strong>Online Python Compiler</strong> is the fastest and most secure way to run Python scripts directly in your browser. 
                    Whether you are a student learning Python 3 basics, a data scientist testing a quick snippet, or a developer debugging code on the go, 
                    our tool provides a seamless coding environment without any installation.
                </p>
                
                <h3>Key Features</h3>
                <ul>
                    <li><strong>Zero Setup:</strong> Start coding immediately. No need to install Python, pip, or set up virtual environments.</li>
                    <li><strong>Latest Python 3 Support:</strong> We support the latest stable version of Python, ensuring you have access to modern features like f-strings, type hinting, and async/await.</li>
                    <li><strong>Standard Library Included:</strong> Import <code>math</code>, <code>random</code>, <code>datetime</code>, and other standard modules effortlessly.</li>
                    <li><strong>Fast Execution:</strong> Your code runs in a high-performance isolated sandbox, delivering results in milliseconds.</li>
                </ul>

                <h2>How to Compile Python Online</h2>
                <ol>
                    <li>Type your Python code in the editor on the left.</li>
                    <li>Click the <strong>Run</strong> button.</li>
                    <li>View the output instantly in the console on the right.</li>
                    <li>Download your source code using the download button if needed.</li>
                </ol>

                <h3>Python Code Example</h3>
                <pre><code class="language-python">
# A simple Python program to calculate Fibonacci sequence
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

n = 10
print(f"Fibonacci sequence for {n}:")
for i in range(n):
    print(fibonacci(i), end=" ")
                </code></pre>

                <h2>Frequently Asked Questions</h2>
                <h3>Can I use external libraries like NumPy or Pandas?</h3>
                <p>Currently, our environment supports the robust Python Standard Library. We are working on adding support for popular data science packages in future updates.</p>

                <h3>Is my code private?</h3>
                <p>Yes. Your code is executed in an ephemeral container and is destroyed after execution. We do not store your code unless you explicitly choose to save or share it (feature coming soon).</p>
            </article>
        `
    },
    java: {
        title: "Online Java Compiler",
        heroText: "Compile and Execute Java Code in the Browser",
        content: `
            <article class="prose lg:prose-xl max-w-none">
                <h2>The Best Online Java Compiler</h2>
                <p>
                    Experience the power of Java without the heaviness of an IDE. Our <strong>Online Java Compiler</strong> allows you to write public classes, main methods, and object-oriented code instantly. 
                    Perfect for learning Java syntax, testing algorithms, or practicing for coding interviews.
                </p>

                <h3>Features</h3>
                <ul>
                    <li><strong>JDK 17+ Support:</strong> Run modern Java code with the latest language features.</li>
                    <li><strong>Fast Compilation:</strong> We optimize the javac compilation process to give you near-instant feedback.</li>
                    <li><strong>Error Highlighting:</strong> clear standard error output helps you debug compilation issues quickly.</li>
                </ul>

                <h2>Basic Java Syntax Guide</h2>
                <p>In our online environment, you don't need to wrap everything in a package provided you keep the class structure valid. Here is a simple "Hello World":</p>
                
                <pre><code class="language-java">
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World! Welcome to Online Java Compiler.");
    }
}
                </code></pre>

                <h2>Java Compilation FAQ</h2>
                <h3>Do I need to install the JDK?</h3>
                <p>No! Our cloud-based environment handles the JDK installation and classpath configuration for you.</p>
                
                <h3>How do I handle user input?</h3>
                <p>Currently, this compiler supports non-interactive execution (standard output). Interactive input support (stdin) is in development.</p>
            </article>
        `
    },
    cpp: {
        title: "Online C++ Compiler",
        heroText: "High-Performance C++ GCC Compiler Online",
        content: `
            <article class="prose lg:prose-xl max-w-none">
                <h2>Master C++ with Our Online IDE</h2>
                <p>
                     C++ is renowned for its speed and control. Our <strong>Online C++ Compiler</strong> gives you a lightweight yet powerful environment to run C++17 and C++20 code. 
                     It utilizes the robust GCC compiler backend to ensure standard compliance and performance.
                </p>

                <h3>Why Code C++ Online?</h3>
                <ul>
                    <li><strong>Algorithm Practice:</strong> Perfect for competitive programmers practicing on LeetCode or CodeForces problems.</li>
                    <li><strong>Learn Pointers & Memory:</strong> safe environment to experiment with memory management without crashing your local machine.</li>
                    <li><strong>Standard Template Library (STL):</strong> Full support for vectors, maps, algorithms, and more.</li>
                </ul>

                <h3>Example: Using Vectors in C++</h3>
                <pre><code class="language-cpp">
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {5, 2, 9, 1, 5, 6};
    
    // Sorting the vector
    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "Sorted numbers: ";
    for(int n : numbers) {
        std::cout << n << " ";
    }
    
    return 0;
}
                </code></pre>
            </article>
        `
    },
    javascript: {
        title: "Online JavaScript Compiler",
        heroText: "Run Node.js Code in Your Browser",
        content: `
             <article class="prose lg:prose-xl max-w-none">
                <h2>Run Modern JavaScript (Node.js) Online</h2>
                <p>
                    Test ES6+ syntax, promise chains, and async functions instantly. Our <strong>Online JavaScript Compiler</strong> runs on a Node.js runtime, 
                    making it different from the browser console by allowing file system access simulation and server-side logic testing.
                </p>
                <h3>Features</h3>
                <ul>
                    <li><strong>ES6+ Support:</strong> Arrow functions, destructuring, and async/await are fully supported.</li>
                    <li><strong>Fast Execution:</strong> Powered by the V8 engine via Node.js.</li>
                </ul>
            </article>
        `
    },
    c: {
        title: "Online C Compiler",
        heroText: "Standard C Compiler (GCC)",
        content: `
            <article class="prose lg:prose-xl max-w-none">
                <h2>Learn C Programming Online</h2>
                <p>
                    The mother of all modern languages. Our <strong>Online C Compiler</strong> provides a pure, standard-compliant environment to learn structs, pointers, and memory manipulation. 
                    Uses GCC for reliable compilation.
                </p>
            </article>
        `
    }
};
