# 💻 Aiken Smart Contracts Module
This repository contains a learning module designed to introduce you to the fundamentals of writing smart contracts using Aiken, a modern and efficient language for smart contracts on the Cardano blockchain.


## Main Goal
The primary goal of this module is to equip you with the practical experience to **learn to write smart contracts in Aiken.** Through a series of progressive examples, you will gain an understanding of Aiken's syntax and core concepts and learn how to deploy basic functionalities on the Cardano network.


## Module Content
Each section below corresponds to a specific example within this module, illustrating different aspects of Aiken smart contract development.


### [1. Installation](https://github.com/iohkedu/cardano-developer-course-online/blob/main/01-async-lessons/00-welcome/02-course-tools.md)
This section guides you through the process of setting up your development environment to work with Aiken. It covers the necessary tools and steps to get Aiken installed and ready for use on your system.
#### **Key Learning Points:**
* Prerequisites for Aiken development.
* Steps to install the Aiken toolchain.
* Verifying your installation.


### [2. Always True](https://github.com/iohkedu/aiken-module/tree/main/examples/always-true)
The "Always True" contract is a foundational example that demonstrates the simplest possible valid smart contract in Aiken. It's often used as a "hello world" for contract validation, where the script always succeeds, regardless of input.
#### **Key Learning Points:**
* Basic Aiken contract structure.
* Understanding the validator function.
* The concept of an always-succeeding script.


### 3. Hello World
This example builds upon the basic structure to introduce simple data handling or interaction. While not a traditional "Hello World" in the sense of printing text, it serves as an introduction to passing and validating simple parameters within a contract.
#### **Key Learning Points:**
* Defining custom types in Aiken.
* Passing parameters to a validator.
* Basic conditional logic within a contract.


### [4. Signature](https://github.com/iohkedu/aiken-module/tree/main/examples/signature)
The "Signature" example explores a key aspect of smart contract security: verifying digital signatures. This contract will demonstrate how to ensure that a specific public key authorizes a transaction.
#### **Key Learning Points:**
* Working with public keys and signatures in Aiken.
* Using built-in functions for signature verification.
* Implementing basic access control.


### [5. Vesting](https://github.com/iohkedu/aiken-module/tree/main/examples/vesting)
The "Vesting" contract is a more practical example. It illustrates how to create a time-locked contract where funds can only be released after a certain time period has passed, or under specific conditions, often involving a beneficiary's signature. This is a common pattern for token distribution or employee compensation.
#### **Key Learning Points:**
* Handling time-based conditions (e.g., POSIXTime).
* Combining multiple conditions for contract validation.
* Developing a multi-party contract scenario.
* Understanding the concepts of datum and redeemer in a practical context.



