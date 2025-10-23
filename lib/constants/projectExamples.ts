// lib/constants/projectExamples.ts

interface ProjectExample {
  short: string;
  full: string;
}

export const EXAMPLE_PROMPTS: ProjectExample[] = [
  {
    short: "E-Commerce Platform",
    full: "An e-commerce platform with user authentication, product catalog, shopping cart, order management, and payment processing. The system should support multiple vendors, customer reviews, wishlists, and promotional codes.",
  },
  {
    short: "Booking & Reservations",
    full: "A restaurant reservation and booking system. Users can search for restaurants by location, cuisine, and available time slots. Restaurants can manage their tables, staff, menus, and receive booking notifications. Needs features for user reviews and loyalty points.",
  },
  {
    short: "Social Media Feed",
    full: "A social media platform for sharing short posts (text and image). Features include user profiles, follow/unfollow functionality, a personalized feed, likes, comments, and direct messaging.",
  },
  {
    short: "Project Management Tool",
    full: "A Kanban-style project management tool. Users can create projects, add tasks, assign tasks to team members, set due dates, and move tasks between status columns (To Do, In Progress, Done). Requires user roles and project permissions.",
  },
];