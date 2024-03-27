#! /usr/bin/env node
import inquirer from 'inquirer'
import * as readlineSync from 'readline-sync';

// Account class representing a user account
class Account {
    username: string;
    accountNumber: string;
    pin: string;
    balance: number;

    constructor(username: string, accountNumber: string, pin: string, balance: number) {
        this.username = username;
        this.accountNumber = accountNumber;
        this.pin = pin;
        this.balance = balance;
    }

    // Method to deposit funds into the account
    deposit(amount: number) {
        this.balance += amount;
    }

    // Method to withdraw funds from the account
    withdraw(amount: number): boolean {
        if (amount <= this.balance) {
            this.balance -= amount;
            return true; // Withdrawal successful
        } else {
            return false; // Insufficient balance
        }
    }

    // Method to check the account balance
    checkBalance() {
        return this.balance;
    }
}

// ATM class representing the ATM functionality
class ATM {
    accounts: Account[];

    constructor() {
        this.accounts = []; // Initialize with empty array
    }

    // Method to create a new account
    createAccount() {
        console.log("\nWelcome to SecureBank CLI - Create Account");
        const username = readlineSync.question("Enter your username: ");
        const accountNumber = readlineSync.question("Enter account number: ");
        const pin = readlineSync.question("Set your 4-digit PIN: ", { hideEchoBack: true, mask: '*' });
        const initialBalance = parseFloat(readlineSync.question("Enter initial balance: $"));

        const newAccount = new Account(username, accountNumber, pin, initialBalance);
        this.accounts.push(newAccount);
        console.log("\n🎉 Congratulations, " + username + "! Your account has been created successfully!");
    }

    // Method to log in to an existing account
    login(): [Account, number] | undefined {
        console.log("\nWelcome to SecureBank CLI - Login");
        const accountNumber = readlineSync.question("Enter account number: ");
        const index = this.accounts.findIndex(account => account.accountNumber === accountNumber);
        if (index === -1) {
            console.log("\n🚫 Account not found. Please try again.");
            return undefined;
        }
        const account = this.accounts[index];
        const pin = readlineSync.question("Enter PIN: ", { hideEchoBack: true, mask: '*' });
        if (pin !== account.pin) {
            console.log("\n🔒 Incorrect PIN. Please try again.");
            return undefined;
        }
        return [account, index];
    }

    // Method to perform transactions after logging in
    performTransaction(account: Account, index: number) {
        console.log("\nSecureBank CLI - Main Menu");
        console.log("1. Deposit");
        console.log("2. Withdraw");
        console.log("3. Check Balance");
        console.log("4. Logout");

        const choice = readlineSync.question("Enter your choice: ");

        switch (choice) {
            case "1":
                const depositAmount = parseFloat(readlineSync.question("Enter amount to deposit: $"));
                account.deposit(depositAmount);
                console.log("\n💰 Deposit successful. Current balance: $" + account.checkBalance());
                break;
            case "2":
                const withdrawAmount = parseFloat(readlineSync.question("Enter amount to withdraw: $"));
                if (account.withdraw(withdrawAmount)) {
                    console.log("\n💸 Withdrawal successful. Current balance: $" + account.checkBalance());
                } else {
                    console.log("\n❌ Insufficient balance. Withdrawal failed.");
                }
                break;
            case "3":
                console.log("\n💳 Current balance: $" + account.checkBalance());
                break;
            case "4":
                console.log("\n👋 Logged out successfully.");
                this.accounts.splice(index, 1); // Remove the logged-out account from the array
                break;
            default:
                console.log("\n❗ Invalid choice. Please try again.");
        }
    }
}

// Main function to interact with the ATM
function main() {
    const atm = new ATM();

    while (true) {
        console.log("\n🏦 Welcome to SecureBank CLI 🏦");
        console.log("1. Create Account");
        console.log("2. Login");
        console.log("3. Exit");

        const choice = readlineSync.question("Enter your choice: ");

        switch (choice) {
            case "1":
                atm.createAccount();
                break;
            case "2":
                const loginResult = atm.login();
                if (loginResult) {
                    const [account, index] = loginResult;
                    console.log("\n🔓 Login successful, " + account.username + "!");
                    atm.performTransaction(account, index);
                }
                break;
            case "3":
                console.log("\n👋 Thank you for using SecureBank CLI. Goodbye!");
                process.exit(0);
            default:
                console.log("\n❗ Invalid choice. Please try again.");
        }
    }
}

// Run the main function
main();