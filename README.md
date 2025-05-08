<h1>Domain Films</h1>
Made with

![React Native](https://img.shields.io/badge/-React%20Native-61DAFB?logo=react&logoColor=black)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
![Expo](https://img.shields.io/badge/-Expo-000020?logo=expo&logoColor=white)
![Vercel](https://img.shields.io/badge/-Vercel-000000?logo=vercel&logoColor=white)
![AWS Amplify](https://img.shields.io/badge/-AWS%20Amplify-FF9900?logo=amazonaws&logoColor=white)
![Jellyfin](https://img.shields.io/badge/-Jellyfin-30106B?logo=jellyfin&logoColor=white)
![Cloudflare](https://img.shields.io/badge/-Cloudflare-F38020?logo=cloudflare&logoColor=white)
![Ubuntu](https://img.shields.io/badge/-Ubuntu-E95420?logo=ubuntu&logoColor=white)

### 📽️ Functions

**Domain Films** is a full-stack movie streaming platform developed as part of the **CS 4800 – Software Engineering** course at **Cal Poly Pomona**. The project features both web and mobile interfaces, allowing users to browse, search, and stream movies and shows seamlessly across devices.

> This application was created for educational purposes only. All media content used in the project is for demonstration and learning, and all rights to the media belong to their respective owners.

This project was developed by a student team from Cal Poly Pomona. (Team members listed below.)
> Ali Momennasab, Ethan Ngo, Joseph Moran, Joshua Yi, Zihao Luo.

---

<h2>🌐 Tech Stack Overview</h2>

### 🔧 Backend and Middleware

Our backend architecture supports both user authentication and media streaming functionality:

- **User & Metadata Backend**: Built using **Node.js**, **Express.js**, and **MongoDB Atlas**, deployed on **Vercel**.
  - Handles user registration, authentication, session management, and stores user data such as watch history and preferences.
  - Stores media metadata such as titles, descriptions, thumbnails, genres, and watch progress in a flexible NoSQL structure.
  - Exposes RESTful API endpoints used by both the web and mobile frontends.

- **Media Streaming Backend**:
  - Hosted on an **Ubuntu 22.04.5** server with **Nginx** configured as a reverse proxy.
  - Utilizes **Jellyfin**, an open-source media server, to manage and stream video content.
  - Protected and accelerated using **Cloudflare** for CDN caching, HTTPS, DNS routing, and DDoS protection.

- **Static Asset Storage**:
  - Media thumbnails and user-uploaded images are stored on **AWS S3**, chosen for efficient delivery of large assets and to reduce load on the database.

---

### 💻 Frontend (React Native for Web-Focused)

The entire frontend of Domain Films is built using **React Native**, primarily targeting the **web platform** via **React Native for Web** through **Expo**:

- Hosted on **AWS Amplify**, providing scalable, secure deployment and integration with the backend.
- Developed with **React Native**, designed for seamless use in desktop and mobile browsers.
- Key features include:
  - Movie/show search and filtering by title, genre, and popularity
  - Rich media pages with metadata and embedded **Jellyfin** streaming support
  - Authentication, profile management, watchlists, and viewing history
  - Fully responsive UI with dark mode and adaptive layouts

---

### 📱 Mobile App (React Native via Expo)

The same React Native codebase powers a cross-platform mobile app:

- Developed using **Expo**, enabling easy builds and deployment for both iOS and Android.
- Mirrors the web functionality:
  - Secure login and user profile handling
  - Browsing and streaming movies/shows via native Jellyfin integration
- Offers an optimized mobile experience for on-the-go streaming.

---

### 📁 Media & Streaming Docs
- Jellyfin Media Streaming: https://jellyfin.org/docs/
- MongoDB Atlas: https://www.mongodb.com/atlas/database

---

### 🎬 Showcase

Below is a demo of Domain Films in action

![DFShowcase1-ezgif com-video-to-gif-converter (1)](https://github.com/user-attachments/assets/b1173744-ab73-4bae-bdb7-b68712eea9e8)



