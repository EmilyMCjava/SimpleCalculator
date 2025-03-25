document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display");
    const buttons = document.querySelectorAll(".btn");

    let expression = "";

    // Keydown event listener
    document.addEventListener("keydown", (event) => {
        const keyMap = {
            "Enter": "equals",
            "Delete": "clear",
            "=": "equals",
            "+": "add",
            "-": "subtract",
            "*": "multiplication",
            "/": "division",
            "0": "0",
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4",
            "5": "5",
            "6": "6",
            "7": "7",
            "8": "8",
            "9": "9",
            ".": "decimal"
        };

        // Prevent multiple consecutive operators
        const operators = ["+", "-", "*", "/"];
        if (operators.includes(event.key)) {
            if (operators.includes(display.value.slice(-1))) {
                event.preventDefault();
                return;
            }
        }

        if (event.key === "Backspace") {
            if (display.value.length > 0) {
                display.value = display.value.slice(0, -1);
            }
            return;
        }

        if (event.key === "." && display.value.includes(".")) {
            event.preventDefault();
            return;
        }

        const buttonId = keyMap[event.key];
        if (buttonId) {
            document.getElementById(buttonId)?.click();
        }

        if (event.key === "Enter" || event.key === "=") {
            try {
                let result = evaluateExpression(display.value);
                display.value = result;
            } catch (error) {
                display.value = "Error";
            }
        }
    });

    // Function to evaluate the mathematical expression
    function evaluateExpression(expr) {
        console.log("Expression before evaluation:", expr);

        // Basic input sanitization
        expr = expr.replace(/[^0-9+\-*/().]/g, "");

        if (/[+\-*/]{2,}/.test(expr) || /^[+\-*/]/.test(expr) || /[+\-*/]$/.test(expr)) {
            throw new Error("Invalid input");
        }

        if (expr.trim() === "") {
            throw new Error("Empty expression");
        }

        try {
            // Use regular expression to calculate basic operations
            let result = calculateExpression(expr);
            return result;
        } catch (e) {
            console.error("Error in expression:", e);
            throw new Error("Invalid expression");
        }
    }

    // Function to safely evaluate arithmetic expressions using regular expressions
    function calculateExpression(expr) {
        // Convert to a format that we can work with, allowing basic arithmetic only
        let sanitizedExpr = expr.replace(/\s+/g, "");

        // Order of operations (PEMDAS) - we use regex to handle simple arithmetic operations

        // Handle multiplication and division first
        sanitizedExpr = sanitizedExpr.replace(/(\d+)\s*([*/])\s*(\d+)/g, (match, num1, operator, num2) => {
            return operator === "*" ? parseFloat(num1) * parseFloat(num2) : parseFloat(num1) / parseFloat(num2);
        });

        // Then handle addition and subtraction
        sanitizedExpr = sanitizedExpr.replace(/(\d+)\s*([+-])\s*(\d+)/g, (match, num1, operator, num2) => {
            return operator === "+" ? parseFloat(num1) + parseFloat(num2) : parseFloat(num1) - parseFloat(num2);
        });

        return parseFloat(sanitizedExpr);
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const value = button.textContent;

            if (value === "=") {
                try {
                    expression = evaluateExpression(expression).toString();
                } catch {
                    expression = "Error";
                }
            } else if (value === "C") {
                expression = "";
            } else {
                expression += value;
            }

            display.value = expression;
        });
    });
});
