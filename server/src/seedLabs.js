import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Lab from "./models/Lab.js";

dotenv.config();

const labs = [
  {
    title: "Introduction to Cybersecurity",
    slug: "introduction-to-cybersecurity",
    description:
      "Learn the fundamental concepts of cybersecurity, common threats, vulnerabilities, and the core principles used to protect information and systems.",
    difficulty: "Beginner",
    estimatedTime: 30,
    order: 1,
    keyConcepts: [
      "CIA Triad",
      "Threats",
      "Vulnerabilities",
      "Risk",
      "Authentication",
      "Authorization",
    ],
    theory: [
      {
        title: "What is Cybersecurity?",
        content:
          "Cybersecurity is the practice of protecting computers, networks, applications, devices, and data from unauthorized access, misuse, disruption, or destruction. It combines technologies, processes, and security practices to reduce cyber risks.",
      },
      {
        title: "The CIA Triad",
        content:
          "The CIA Triad is a fundamental cybersecurity model consisting of Confidentiality, Integrity, and Availability. Confidentiality protects information from unauthorized access. Integrity helps ensure that information is not improperly changed. Availability ensures that authorized users can access systems and information when needed.",
      },
      {
        title: "Threats and Vulnerabilities",
        content:
          "A threat is a potential event or actor that could cause harm to a system. A vulnerability is a weakness that could be exploited by a threat. Risk exists when a threat can take advantage of a vulnerability and cause an impact.",
      },
      {
        title: "Authentication and Authorization",
        content:
          "Authentication verifies who a user is, while authorization determines what that authenticated user is allowed to access. Strong authentication and appropriate authorization are essential parts of access control.",
      },
    ],
  },

  {
    title: "Network Security",
    slug: "network-security",
    description:
      "Understand the basic concepts behind computer networks and learn how security controls help protect network communication and infrastructure.",
    difficulty: "Beginner",
    estimatedTime: 35,
    order: 2,
    keyConcepts: [
      "TCP/IP",
      "IP Addresses",
      "Ports",
      "Protocols",
      "Firewalls",
      "Network Attacks",
    ],
    theory: [
      {
        title: "Introduction to Networks",
        content:
          "A computer network allows devices to communicate and exchange data. Networks use defined protocols and addressing systems to identify devices and control how information is transmitted.",
      },
      {
        title: "TCP/IP",
        content:
          "TCP/IP is a collection of networking protocols used for communication across interconnected networks. IP is responsible for addressing and routing packets, while TCP provides reliable, ordered delivery of data.",
      },
      {
        title: "Ports and Protocols",
        content:
          "Ports help identify network services running on a device. Different services commonly use different port numbers and protocols. Understanding ports can help security professionals identify exposed services and investigate network activity.",
      },
      {
        title: "Firewalls",
        content:
          "A firewall controls network traffic according to defined rules. It can allow or block traffic based on characteristics such as source, destination, port, and protocol.",
      },
      {
        title: "Common Network Attacks",
        content:
          "Network environments can be affected by attacks such as denial-of-service, scanning, spoofing, and unauthorized access attempts. Security monitoring, network segmentation, authentication, and firewalls can reduce exposure to these threats.",
      },
    ],
  },

  {
    title: "Web Security",
    slug: "web-security",
    description:
      "Learn how modern web applications work and explore common web security vulnerabilities such as SQL injection and cross-site scripting.",
    difficulty: "Intermediate",
    estimatedTime: 45,
    order: 3,
    keyConcepts: [
      "HTTP",
      "Cookies",
      "Sessions",
      "SQL Injection",
      "XSS",
      "Authentication",
    ],
    theory: [
      {
        title: "How Web Applications Work",
        content:
          "A web application typically consists of a client, a server, and often a database. The browser sends requests to the server, the server processes those requests, and a response is returned to the client.",
      },
      {
        title: "HTTP",
        content:
          "HTTP is an application-layer protocol used for communication between clients and web servers. Common HTTP methods include GET, POST, PUT, PATCH, and DELETE. Requests and responses contain information such as headers, status codes, and message bodies.",
      },
      {
        title: "Cookies and Sessions",
        content:
          "Cookies are small pieces of data stored by a browser and sent with applicable requests. Sessions provide a way for a server to maintain state across multiple requests, which is commonly used for authenticated users.",
      },
      {
        title: "SQL Injection",
        content:
          "SQL injection can occur when untrusted input is incorporated into database queries without appropriate handling. Parameterized queries and prepared statements are important defenses against this class of vulnerability.",
      },
      {
        title: "Cross-Site Scripting",
        content:
          "Cross-site scripting, commonly called XSS, occurs when an application causes untrusted content to be interpreted as executable script in a user's browser. Input handling, output encoding, and appropriate browser security controls can help reduce the risk.",
      },
    ],
  },

  {
    title: "Cryptography",
    slug: "cryptography",
    description:
      "Explore the fundamentals of cryptography, including encryption, hashing, symmetric and asymmetric cryptography, and digital signatures.",
    difficulty: "Intermediate",
    estimatedTime: 40,
    order: 4,
    keyConcepts: [
      "Encryption",
      "Hashing",
      "Symmetric Cryptography",
      "Asymmetric Cryptography",
      "Public Keys",
      "Digital Signatures",
    ],
    theory: [
      {
        title: "What is Cryptography?",
        content:
          "Cryptography uses mathematical techniques to protect information and communications. Modern cryptographic systems can provide properties such as confidentiality, integrity, authentication, and non-repudiation.",
      },
      {
        title: "Encryption",
        content:
          "Encryption transforms readable plaintext into ciphertext using a cryptographic algorithm and a key. Decryption reverses this process when the appropriate key is available.",
      },
      {
        title: "Symmetric Cryptography",
        content:
          "Symmetric cryptography uses the same secret key, or a closely related secret, for encryption and decryption. It is generally efficient for protecting large amounts of data, but the secret key must be shared securely.",
      },
      {
        title: "Asymmetric Cryptography",
        content:
          "Asymmetric cryptography uses a key pair consisting of a public key and a private key. The public key can be shared openly, while the private key must remain secret.",
      },
      {
        title: "Hashing and Digital Signatures",
        content:
          "A cryptographic hash function produces a fixed-length value from input data and is designed to make finding the original input difficult. Digital signatures use asymmetric cryptography and hashing to help verify authenticity and integrity.",
      },
    ],
  },
];

const seedLabs = async () => {
  try {
    await connectDB();

    await Lab.deleteMany({});

    await Lab.insertMany(labs);

    console.log("Labs seeded successfully ✅");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Lab seeding failed ❌");
    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedLabs();