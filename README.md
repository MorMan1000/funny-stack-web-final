# FunnyStack - Dynamic Media Platform

A full-stack web application that allows users to create, manage, and share dynamic media collections and memes. 

**Live Demo:** [https://funny-stack.pro](https://funny-stack.pro)

### 🔐 Demo Credentials
* **Email:** funny.stack1@gmail.com
* **Password:** Aa123456

---

### 🏗️ Architecture & Infrastructure (Production Setup)
This project was built and deployed with a strong focus on scalable architecture and production-grade infrastructure:

* **Compute & OS:** Provisioned and managed on a **DigitalOcean Droplet** running **Ubuntu Linux**.
* **Web Server & Security:** Configured using **Apache** as the web server. Production traffic is fully secured via HTTPS, utilizing **Let's Encrypt / Certbot** for SSL/TLS certificate provisioning and auto-renewal.
* **Cloud Storage:** User-generated media assets are entirely decoupled from the application server and offloaded to **AWS S3**, ensuring high availability, reduced server load, and scalability.
* **Integrations:** Utilizes the **Mailgun API** for robust transactional email delivery.

### 💻 Tech Stack
* **Infrastructure & Cloud:** DigitalOcean, AWS S3, Apache, Linux, SSL/TLS
* **Backend:** PHP, Laravel, MySQL
* **Frontend:** React, JavaScript, HTML/CSS

### ✨ Key Application Features
* Secure user authentication and session management.
* Dynamic media creation and editing tools.
* Decoupled storage architecture for media persistence.
* Sharing capabilities and collection management.