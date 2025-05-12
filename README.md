# Street-Food-Finder – Frontend

**Street-Food** is a secure and intuitive web platform for creating, managing, and sharing street food with optional subscription fees Go Premium users .As you become a premium users you can find all premium post that is made by our admin . This repository contains the **frontend** built with **Next.js** and **Tailwind CSS**, providing a responsive, user-friendly interface integrated with a backend API.

---

## 📃 Documentation

* **Live Site:** [Street-Food Frontend](https://street-bite-frontend.vercel.app/)
* **Backend Live API:** [Street-Food Server](https://street-food-finder-backend.vercel.app/)

---

## 🛠 Tech Stack

* **Next.js** – React Framework (Server-Side Rendering and Static Site Generation)
* **Tailwind CSS** – Utility-First Styling Framework
* **React Query** – Efficient Data Fetching and State Management
* **JWT** – Client-Side Authentication Handling
* **Vercel** – Deployment Platform

---

## 📦 Features

### 🎨 Responsive User Interface

* Global navigation with links: Home, Go-Premium Login/Signup, Dashboard
* Mobile-first design adapting to all screen sizes
* Accessible footer 

### 🔎 Post Discover and Create Post

* Hero section you can see Trending posts and then you can go see all page .
* In this page you can create a post that send admin dashboard for approval .
* After Approving by admin every user can find this post 
* User can upvote and downvote . 
* User can comment here but this comment will send for approval for admin . 
* After Approval you will find all comment 
* Admin can Approve or reject post and comment also . 
* Admin can make a normal post premium. This premium post is only for premium users
  * Search post by title.

### 🛠️ Premium Users Management 

* Admin Create Subscription Plan and admin provide it for users Subscribe 
* When a users get or payment subscription plan they are called premium users .

### 🧹 Participation Workflows

* **user free posts:** Instant join
* **Premiumm users Paid Posts:** Payment integration (SSLCommerz/ShurjoPay) with Premium  status

### 🢑 Users Management

* Active or Blocked By admin
* Block Users if necessary
* View Users with status (ACTIVE,Blocked)

### 🛡️ User Dashboard

* **Post Activity:** CRUD operations, Post management 
* **Payment History:** If users buy subscription plan their payment history is here
* **Settings:** Profile updates, notifications, and account management

### ⭐ Reviews and Ratings

* Post review and rating system
* Aggregated reviews displayed on Posts pages

### 🛠 Admin Controls

* Delete inappropriate Posts comment or users
* Admin dashboard with activity logs for monitoring

---

## 📁 Project Setup

### Clone the Repository

```bash
git clone https://github.com/Th3At0nic/Street-Food-Finder-Frontend.git
cd Street-Food-Finder-Frontend
```

### Install Dependencies

```bash
bun install
```

### Configure Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_API_URL=""
NEXT_PUBLIC_PAYMENT_GATEWAY_PUBLIC_KEY=your_payment_gateway_public_key
```

(Refer to `.env.example` for additional configs.)

### Run Development Server

```bash
bun dev
```

> App runs at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
bun run build
bun run start
```

---

## 📋 Additional Notes

* **Testing Admin Features:**
  Email: `admin@gmail.com`
  Password: `AdminPassword`

* **Deployment:**
  Deployed on [Vercel](https://vercel.com). Set environment variables in Vercel’s dashboard.

* **Styling:**
  Tailwind CSS is used. Customize via `tailwind.config.js`.

* **Linting & Formatting:**
  ESLint and Prettier are configured.
  Run:

  ```bash
  bun run lint
  ```

---

## 📬 Contact

For issues or inquiries, please contact:
📧 **[iftakharalamshuvo@gmail.com](iftakharalamshuvo@gmail.com)**

---


---

## 🧰 Repository Stats

| Info            | Status         |
| --------------- | -------------- |
| 🌟 Stars        | 1              |
| 👀 Watchers     | 1              |
| 🍜 Forks        | 0           |
| 🚀 Contributors | 4            |
| 📦 Releases     | None Published |
| 📦 Packages     | None Published |

---

## 👥 Contributors

* [@alamshuvo](https://github.com/alamshuvo)


---

## 🛠️ Languages Used

* **TypeScript** – 99.1%
* **Other** – 0.9%

---

# ✅ Done!
