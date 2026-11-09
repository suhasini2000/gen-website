export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const WA = "919866168995";
export const PHONE = "+91 98661 68995";
export const TEL = "tel:+919866168995";
export const EMAIL = "geninfo133@gmail.com";
export const INSTAGRAM_REEL_URL = "https://www.instagram.com/reel/DfPiQJTzI11/";
export const ADDRESS_LINES = ["Geninfotech Computer Centre", "Rama Lakshmi Complex, Main Road", "Opp. Canara Bank, Sajjapuram", "Tanuku, West Godavari, Andhra Pradesh 534211"];
export const MAP_URL = "https://maps.google.com/?q=Geninfotech+Computer+Centre+Rama+Lakshmi+Complex+Main+Road+Sajjapuram+Andhra+Pradesh+534211";

export const STOCK_PHOTOS = [
  "https://images.unsplash.com/photo-1531496730074-83b638c0a7ac?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1563394867331-e687a36112fd?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1664382953647-5c6c76dd63b9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1723987135977-ae935608939e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1653566031471-85365f8d0ae0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1573496774379-b930dba17d8b?auto=format&fit=crop&w=900&q=80",
];

export const CATEGORIES = [
  "Programming Languages",
  "Full Stack & Web Development",
  "AI & Modern Technology",
  "Database & Other Technologies",
  "Office & Business Applications",
  "Graphic Design & Engineering",
  "Kids Programming",
  "Vedic Mathematics",
];

export const UNITS = { main: "Main enquiry", vedic_maths: "Vedic Maths", ai_vista: "AI VISTA 360" };

export const slugify = (name = "") =>
  name.toLowerCase().replaceAll("&", "and").replaceAll("/", " ").replace(/[^a-z0-9.+#]+/g, "-").replace(/^-|-$/g, "");

export const waLink = (text) => `https://wa.me/${WA}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const youtubeId = (url = "") => (url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/) || [])[1];

export const courseText = (course, lang) => (lang === "te" && course.description_te) || course.description;
