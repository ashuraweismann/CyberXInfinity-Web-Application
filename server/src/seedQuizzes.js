import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Lab from "./models/Lab.js";
import QuizQuestion from "./models/QuizQuestion.js";

dotenv.config();

const quizData = {
  "introduction-to-cybersecurity": [
    {
      question: "What does the CIA Triad stand for?",
      options: [
        "Confidentiality, Integrity, Availability",
        "Control, Inspection, Authentication",
        "Confidentiality, Inspection, Authorization",
        "Control, Integrity, Authentication",
      ],
      correctOption: 0,
      explanation:
        "The CIA Triad represents Confidentiality, Integrity, and Availability.",
      difficulty: "Beginner",
      topic: "CIA Triad",
    },
    {
      question:
        "Which security property prevents unauthorized users from viewing information?",
      options: [
        "Availability",
        "Confidentiality",
        "Integrity",
        "Non-repudiation",
      ],
      correctOption: 1,
      explanation:
        "Confidentiality protects information from unauthorized disclosure.",
      difficulty: "Beginner",
      topic: "CIA Triad",
    },
    {
      question:
        "Which security property focuses on preventing unauthorized modification of data?",
      options: [
        "Integrity",
        "Availability",
        "Confidentiality",
        "Authentication",
      ],
      correctOption: 0,
      explanation:
        "Integrity helps ensure information is accurate and has not been improperly modified.",
      difficulty: "Beginner",
      topic: "CIA Triad",
    },
    {
      question: "What is a vulnerability?",
      options: [
        "A security control",
        "A weakness that can be exploited",
        "A type of password",
        "A backup mechanism",
      ],
      correctOption: 1,
      explanation:
        "A vulnerability is a weakness that may be exploited by a threat.",
      difficulty: "Beginner",
      topic: "Vulnerabilities",
    },
    {
      question: "What is a threat?",
      options: [
        "A potential cause of harm",
        "A password policy",
        "A security patch",
        "A network protocol",
      ],
      correctOption: 0,
      explanation:
        "A threat is a potential event, condition, or actor that can cause harm.",
      difficulty: "Beginner",
      topic: "Threats",
    },
    {
      question:
        "Which term describes verifying the identity of a user?",
      options: [
        "Authorization",
        "Authentication",
        "Accounting",
        "Encryption",
      ],
      correctOption: 1,
      explanation:
        "Authentication verifies who a user or system is.",
      difficulty: "Beginner",
      topic: "Authentication",
    },
    {
      question:
        "Which term determines what an authenticated user is allowed to access?",
      options: [
        "Authorization",
        "Authentication",
        "Hashing",
        "Identification",
      ],
      correctOption: 0,
      explanation:
        "Authorization determines the permissions available to an authenticated identity.",
      difficulty: "Beginner",
      topic: "Authorization",
    },
    {
      question: "What is risk generally associated with?",
      options: [
        "A threat exploiting a vulnerability and causing impact",
        "Only installing software",
        "Only creating backups",
        "Changing a username",
      ],
      correctOption: 0,
      explanation:
        "Cybersecurity risk considers the possibility and impact of threats exploiting weaknesses.",
      difficulty: "Beginner",
      topic: "Risk",
    },
    {
      question:
        "Which action is an example of improving availability?",
      options: [
        "Adding redundant infrastructure",
        "Publishing passwords",
        "Disabling backups",
        "Removing access controls",
      ],
      correctOption: 0,
      explanation:
        "Redundancy can help keep services available when one component fails.",
      difficulty: "Beginner",
      topic: "Availability",
    },
    {
      question:
        "Which practice is most directly related to access control?",
      options: [
        "Giving every user administrator privileges",
        "Applying appropriate permissions to users",
        "Sharing one password with everyone",
        "Disabling authentication",
      ],
      correctOption: 1,
      explanation:
        "Access control should grant users only the permissions they require.",
      difficulty: "Beginner",
      topic: "Access Control",
    },
  ],

  "network-security": [
    {
      question: "What is the primary purpose of an IP address?",
      options: [
        "Identify a network interface for communication",
        "Encrypt a password",
        "Compress network traffic",
        "Store a web cookie",
      ],
      correctOption: 0,
      explanation:
        "IP addresses identify network interfaces and support packet delivery.",
      difficulty: "Beginner",
      topic: "IP Addresses",
    },
    {
      question: "What does TCP provide?",
      options: [
        "Reliable, ordered data delivery",
        "Password hashing",
        "File encryption only",
        "Domain registration",
      ],
      correctOption: 0,
      explanation:
        "TCP provides reliable, ordered transport of data between endpoints.",
      difficulty: "Beginner",
      topic: "TCP/IP",
    },
    {
      question:
        "What does a network port help identify?",
      options: [
        "A service or application endpoint",
        "A user's password",
        "A file's checksum",
        "A physical monitor",
      ],
      correctOption: 0,
      explanation:
        "Ports identify logical service endpoints on networked hosts.",
      difficulty: "Beginner",
      topic: "Ports",
    },
    {
      question: "Which device commonly filters traffic based on rules?",
      options: [
        "Firewall",
        "Keyboard",
        "Monitor",
        "Printer",
      ],
      correctOption: 0,
      explanation:
        "Firewalls control network traffic according to configured rules.",
      difficulty: "Beginner",
      topic: "Firewalls",
    },
    {
      question: "Which protocol is commonly associated with secure web traffic?",
      options: [
        "HTTPS",
        "FTP",
        "TELNET",
        "HTTP only",
      ],
      correctOption: 0,
      explanation:
        "HTTPS uses TLS to protect HTTP communication in transit.",
      difficulty: "Beginner",
      topic: "Protocols",
    },
    {
      question:
        "Which activity involves identifying open network services?",
      options: [
        "Port scanning",
        "Hashing",
        "Data compression",
        "Password salting",
      ],
      correctOption: 0,
      explanation:
        "Port scanning can identify network ports and potentially exposed services.",
      difficulty: "Beginner",
      topic: "Network Scanning",
    },
    {
      question:
        "What is the primary purpose of network segmentation?",
      options: [
        "Limit the spread of attacks and control communication",
        "Make every system publicly accessible",
        "Remove authentication",
        "Disable monitoring",
      ],
      correctOption: 0,
      explanation:
        "Segmentation separates network areas and can limit lateral movement and exposure.",
      difficulty: "Intermediate",
      topic: "Network Segmentation",
    },
    {
      question:
        "Which attack attempts to make a service unavailable by overwhelming it?",
      options: [
        "Denial-of-service",
        "Hashing",
        "Authentication",
        "Encryption",
      ],
      correctOption: 0,
      explanation:
        "Denial-of-service attacks attempt to reduce or prevent service availability.",
      difficulty: "Beginner",
      topic: "Network Attacks",
    },
    {
      question:
        "Why is monitoring network traffic useful for security teams?",
      options: [
        "It can help identify suspicious activity",
        "It guarantees no attack can happen",
        "It removes the need for authentication",
        "It disables all network protocols",
      ],
      correctOption: 0,
      explanation:
        "Network monitoring can reveal unusual traffic patterns and indicators of compromise.",
      difficulty: "Beginner",
      topic: "Monitoring",
    },
    {
      question:
        "Which principle means users should receive only the access they need?",
      options: [
        "Least privilege",
        "Maximum privilege",
        "Open access",
        "Default administrator",
      ],
      correctOption: 0,
      explanation:
        "Least privilege limits access to what is necessary for the user's role.",
      difficulty: "Beginner",
      topic: "Access Control",
    },
  ],

  "web-security": [
    {
      question: "What does HTTP primarily define?",
      options: [
        "Communication between web clients and servers",
        "A method for encrypting hard drives",
        "A database storage engine",
        "A password hashing algorithm",
      ],
      correctOption: 0,
      explanation:
        "HTTP defines request and response communication used by web applications.",
      difficulty: "Beginner",
      topic: "HTTP",
    },
    {
      question: "Which HTTP method is commonly used to submit data?",
      options: [
        "POST",
        "GET",
        "TRACE",
        "HEAD only",
      ],
      correctOption: 0,
      explanation:
        "POST is commonly used to submit data to a server.",
      difficulty: "Beginner",
      topic: "HTTP Methods",
    },
    {
      question: "What is a cookie?",
      options: [
        "Small data stored by the browser and associated with a website",
        "A database server",
        "A firewall rule",
        "A cryptographic algorithm",
      ],
      correctOption: 0,
      explanation:
        "Cookies are small pieces of data that browsers store and send with applicable requests.",
      difficulty: "Beginner",
      topic: "Cookies",
    },
    {
      question: "What is the main purpose of a session?",
      options: [
        "Maintain state across multiple requests",
        "Replace all authentication controls",
        "Encrypt the operating system",
        "Scan open ports",
      ],
      correctOption: 0,
      explanation:
        "Sessions allow servers to maintain state across multiple requests.",
      difficulty: "Beginner",
      topic: "Sessions",
    },
    {
      question: "What is SQL injection?",
      options: [
        "A database-related injection vulnerability",
        "A network cable problem",
        "A type of firewall",
        "A hashing algorithm",
      ],
      correctOption: 0,
      explanation:
        "SQL injection can occur when untrusted input is incorporated into database queries unsafely.",
      difficulty: "Intermediate",
      topic: "SQL Injection",
    },
    {
      question:
        "Which practice helps prevent SQL injection?",
      options: [
        "Parameterized queries",
        "Building SQL with string concatenation",
        "Disabling input validation",
        "Giving users database administrator access",
      ],
      correctOption: 0,
      explanation:
        "Parameterized queries keep data separate from SQL instructions.",
      difficulty: "Intermediate",
      topic: "SQL Injection",
    },
    {
      question: "What is XSS?",
      options: [
        "A vulnerability involving untrusted script execution in a user's browser",
        "A network routing protocol",
        "A database backup format",
        "A disk encryption method",
      ],
      correctOption: 0,
      explanation:
        "XSS can cause attacker-controlled script to execute in a victim's browser context.",
      difficulty: "Intermediate",
      topic: "XSS",
    },
    {
      question:
        "Which approach helps reduce many XSS risks?",
      options: [
        "Context-appropriate output encoding",
        "Rendering all input as executable HTML",
        "Disabling authentication",
        "Using shared administrator accounts",
      ],
      correctOption: 0,
      explanation:
        "Appropriate output encoding helps prevent untrusted data from being interpreted as executable markup or script.",
      difficulty: "Intermediate",
      topic: "XSS",
    },
    {
      question: "What is authentication used for?",
      options: [
        "Verifying identity",
        "Granting every permission",
        "Encrypting databases automatically",
        "Blocking all HTTP traffic",
      ],
      correctOption: 0,
      explanation:
        "Authentication verifies the identity associated with a login attempt.",
      difficulty: "Beginner",
      topic: "Authentication",
    },
    {
      question:
        "Why should session identifiers be protected?",
      options: [
        "An attacker who obtains one may be able to impersonate a user",
        "They are required for DNS resolution",
        "They replace TLS",
        "They prevent SQL queries",
      ],
      correctOption: 0,
      explanation:
        "A stolen session identifier can allow unauthorized access to an authenticated session.",
      difficulty: "Intermediate",
      topic: "Session Security",
    },
  ],

  cryptography: [
    {
      question: "What is encryption primarily used to provide?",
      options: [
        "Confidentiality",
        "Port scanning",
        "Database normalization",
        "Network routing",
      ],
      correctOption: 0,
      explanation:
        "Encryption transforms plaintext into ciphertext to protect confidentiality.",
      difficulty: "Beginner",
      topic: "Encryption",
    },
    {
      question: "What does decryption do?",
      options: [
        "Transforms ciphertext back into readable plaintext",
        "Creates a network port",
        "Generates an IP address",
        "Deletes a database",
      ],
      correctOption: 0,
      explanation:
        "Decryption reverses encryption when the appropriate key is available.",
      difficulty: "Beginner",
      topic: "Encryption",
    },
    {
      question:
        "What is a key characteristic of symmetric cryptography?",
      options: [
        "The same secret key is used for encryption and decryption",
        "It never uses keys",
        "It only uses public keys",
        "It cannot protect data",
      ],
      correctOption: 0,
      explanation:
        "Symmetric cryptography uses a shared secret key for cryptographic operations.",
      difficulty: "Beginner",
      topic: "Symmetric Cryptography",
    },
    {
      question:
        "How does asymmetric cryptography differ from symmetric cryptography?",
      options: [
        "It uses a public/private key pair",
        "It does not use mathematics",
        "It only works on images",
        "It cannot provide authentication",
      ],
      correctOption: 0,
      explanation:
        "Asymmetric cryptography uses mathematically related public and private keys.",
      difficulty: "Beginner",
      topic: "Asymmetric Cryptography",
    },
    {
      question: "Which key should normally remain secret in public-key cryptography?",
      options: [
        "Private key",
        "Public key",
        "Certificate name",
        "Algorithm name",
      ],
      correctOption: 0,
      explanation:
        "The private key must be protected by its owner.",
      difficulty: "Beginner",
      topic: "Public and Private Keys",
    },
    {
      question: "What is a cryptographic hash designed to produce?",
      options: [
        "A fixed-length digest of input data",
        "A network route",
        "A reversible encrypted file",
        "A TCP connection",
      ],
      correctOption: 0,
      explanation:
        "A cryptographic hash function produces a fixed-length digest from input data.",
      difficulty: "Beginner",
      topic: "Hashing",
    },
    {
      question: "Why are password hashes commonly stored instead of plaintext passwords?",
      options: [
        "They reduce the need to store the original password",
        "They make passwords publicly readable",
        "They disable authentication",
        "They turn passwords into IP addresses",
      ],
      correctOption: 0,
      explanation:
        "Proper password hashing avoids storing the original password directly.",
      difficulty: "Beginner",
      topic: "Password Hashing",
    },
    {
      question: "What does a digital signature help provide?",
      options: [
        "Authenticity and integrity",
        "Network segmentation",
        "Port forwarding",
        "Data compression",
      ],
      correctOption: 0,
      explanation:
        "Digital signatures can help verify who signed data and whether it was altered.",
      difficulty: "Intermediate",
      topic: "Digital Signatures",
    },
    {
      question:
        "What can a public key generally be used for in an asymmetric system?",
      options: [
        "Verification or encryption depending on the scheme",
        "Replacing the private key",
        "Storing plaintext passwords",
        "Changing an IP address",
      ],
      correctOption: 0,
      explanation:
        "The exact use depends on the cryptographic scheme, including encryption or signature verification.",
      difficulty: "Intermediate",
      topic: "Asymmetric Cryptography",
    },
    {
      question:
        "Which property is most associated with a secure cryptographic hash?",
      options: [
        "Difficulty of finding a practical input that produces a desired digest",
        "Easy reversal into the original message",
        "Guaranteed data compression",
        "Automatic network routing",
      ],
      correctOption: 0,
      explanation:
        "Cryptographic hashes are designed to resist attacks such as preimage and collision attacks.",
      difficulty: "Intermediate",
      topic: "Hashing",
    },
  ],
};

const seedQuizzes = async () => {
  try {
    await connectDB();

    await QuizQuestion.deleteMany({});

    const documents = [];

    for (const [slug, questions] of Object.entries(quizData)) {
      const lab = await Lab.findOne({ slug });

      if (!lab) {
        throw new Error(`Lab not found: ${slug}`);
      }

      questions.forEach((question, index) => {
        documents.push({
          lab: lab._id,
          ...question,
          order: index + 1,
        });
      });
    }

    await QuizQuestion.insertMany(documents);

    console.log(
      `Quiz questions seeded successfully ✅ (${documents.length} questions)`
    );

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Quiz seeding failed ❌");
    console.error(error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedQuizzes();