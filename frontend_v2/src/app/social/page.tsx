"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Star,
  Trophy,
  Smile,
  BookOpen,
  Users,
  Filter,
  Search,
} from "lucide-react";
import Navbar from "@/components/Navbar";

// Mock stories data
const mockStories = [
  {
    id: 1,
    author: "Emma's Mom",
    childName: "Emma",
    age: 12,
    condition: "ASD Level 1",
    title: "Emma's First Day at Middle School Success! 🎒",
    content:
      "Today Emma completed her first full day at middle school using her visual schedule! She was nervous about the new routine, but we practiced with her social story cards for a week. She even made a new friend during lunch who also loves drawing! Emma told me 'Mom, I did it all by myself!' I'm so proud of her courage.",
    image: "🎨",
    likes: 24,
    comments: 8,
    tags: ["school", "routine", "friendship"],
    timeAgo: "2 hours ago",
    achievement: "First Week Champion",
    difficulty: "Big Challenge",
  },
  {
    id: 2,
    author: "Alex",
    childName: "Alex",
    age: 14,
    condition: "ADHD",
    title: "I Finished My First Book! 📚",
    content:
      "Hi everyone! I'm Alex and I have ADHD. Reading was always hard for me because I couldn't sit still. But my therapist taught me to use fidget toys while reading, and I just finished 'Wonder'! It took me 3 weeks, but I did it! Now I want to read the whole series. To other kids like me - you can do hard things too!",
    image: "📚",
    likes: 31,
    comments: 12,
    tags: ["reading", "focus", "achievement"],
    timeAgo: "5 hours ago",
    achievement: "Reading Star",
    difficulty: "Medium Challenge",
  },
  {
    id: 3,
    author: "Sarah's Family",
    childName: "Sarah",
    age: 10,
    condition: "Sensory Processing",
    title: "Movie Theater Success Story! 🎬",
    content:
      "Sarah has sensory sensitivities and loud noises used to be really overwhelming. We've been working on this for months! Today she watched a whole movie at the theater with her noise-reducing headphones and weighted lap pad. She was so excited to see the new Disney movie with her cousins. Small steps lead to big victories!",
    image: "🎬",
    likes: 19,
    comments: 6,
    tags: ["sensory", "family-time", "breakthrough"],
    timeAgo: "1 day ago",
    achievement: "Brave Explorer",
    difficulty: "Big Challenge",
  },
  {
    id: 4,
    author: "Jake",
    childName: "Jake",
    age: 13,
    condition: "Social Anxiety",
    title: "I Joined the Art Club! 🎨",
    content:
      "I'm Jake and I get really anxious talking to new people. But I love art so much! My mom helped me practice what to say, and today I finally joined the art club at school. The teacher was super nice and there are other quiet kids there too. We're making a mural together! Sometimes scary things turn out to be the best things.",
    image: "🎨",
    likes: 27,
    comments: 9,
    tags: ["social-skills", "art", "clubs"],
    timeAgo: "2 days ago",
    achievement: "Social Butterfly",
    difficulty: "Medium Challenge",
  },
  {
    id: 5,
    author: "Maya's Support Team",
    childName: "Maya",
    age: 11,
    condition: "Dyslexia",
    title: "Maya's Poetry Reading Performance! 📝",
    content:
      "Maya has dyslexia and reading aloud used to make her feel scared. But she loves poetry! We found audio books and she practiced for weeks. Today she performed her own poem about friendship at the school talent show. The whole audience clapped and cheered! Maya proved that everyone learns differently, and that's perfectly okay.",
    image: "📝",
    likes: 35,
    comments: 14,
    tags: ["dyslexia", "performance", "poetry"],
    timeAgo: "3 days ago",
    achievement: "Poetry Star",
    difficulty: "Big Challenge",
  },
  {
    id: 6,
    author: "Ben's Dad",
    childName: "Ben",
    age: 9,
    condition: "ASD Level 1",
    title: "Ben's First Sleepover Adventure! 🏠",
    content:
      "Ben has always found sleepovers overwhelming because of routine changes. We created a 'sleepover survival kit' with his comfort items and a visual schedule. Last weekend, he successfully stayed at his best friend's house for the first time! He even helped make pancakes in the morning. These moments remind us how far he's come.",
    image: "🏠",
    likes: 22,
    comments: 7,
    tags: ["sleepover", "routine", "friendship"],
    timeAgo: "4 days ago",
    achievement: "Adventure Seeker",
    difficulty: "Big Challenge",
  },
];

// Mock filter options
const filterOptions = {
  ages: ["8-10", "11-13", "14-16"],
  conditions: [
    "ASD",
    "ADHD",
    "Dyslexia",
    "Social Anxiety",
    "Sensory Processing",
  ],
  tags: [
    "school",
    "friendship",
    "family-time",
    "achievement",
    "breakthrough",
    "social-skills",
  ],
};

const StoryCard = ({ story }) => {
  const [liked, setLiked] = useState(false);

  const difficultyColors = {
    "Big Challenge": "bg-red-100 text-red-700",
    "Medium Challenge": "bg-yellow-100 text-yellow-700",
    "Small Challenge": "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-200">
            
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                {story.childName[0]}
            </div>
            <div>
                <h3 className="font-semibold text-gray-800">{story.author}</h3>
                <p className="text-sm text-gray-600">
                {story.childName}, age {story.age} • {story.condition}
                </p>
            </div>
            </div>
            <div className="text-right">
            <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[story.difficulty]}`}
            >
                {story.difficulty}
            </div>
            <p className="text-xs text-gray-500 mt-1">{story.timeAgo}</p>
            </div>
        </div>

        {/* Achievement Badge */}
        <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
            {story.achievement}
            </span>
        </div>

        {/* Story Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-3">{story.title}</h2>

        {/* Story Image/Emoji */}
        <div className="text-6xl mb-4 text-center">{story.image}</div>

        {/* Story Content */}
        <p className="text-gray-700 leading-relaxed mb-4">{story.content}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
            {story.tags.map((tag, index) => (
            <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
            >
                #{tag}
            </span>
            ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-6">
            <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 transition-colors ${
                liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
            >
                <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                <span className="text-sm font-medium">
                {liked ? story.likes + 1 : story.likes}
                </span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{story.comments}</span>
            </button>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Encourage {story.childName} →
            </button>
        </div>
        </div>
    );
    };

    const FilterButton = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        }`}
    >
        {children}
    </button>
    );

    export default function SocialStoryLibrary() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
        {/* Navbar */}
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Success Stories & Friends
                </h1>
                <Smile className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
                🌟 Celebrate amazing achievements from our NeuroSupport family! Read
                inspiring stories, share your victories, and discover that you're
                never alone on this journey. Every small step is a big win! 🎉
            </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <div className="text-2xl mb-2">🌟</div>
                <div className="text-2xl font-bold text-gray-800">127</div>
                <div className="text-sm text-gray-600">Success Stories</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-2xl font-bold text-gray-800">89</div>
                <div className="text-sm text-gray-600">Amazing Kids</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <div className="text-2xl mb-2">💪</div>
                <div className="text-2xl font-bold text-gray-800">245</div>
                <div className="text-sm text-gray-600">Challenges Conquered</div>
            </div>
            </div>

            {/* Search and Filters */}

            {/* Stories Feed */}
            <div className="space-y-6">
            {mockStories.map((story) => (
                <StoryCard key={story.id} story={story} />
            ))}
            </div>

            {/* Share Your Story CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-center text-white mt-12">
            <div className="text-4xl mb-4">🌈</div>
            <h3 className="text-2xl font-bold mb-3">Share Your Amazing Story!</h3>
            <p className="text-lg mb-6 opacity-90">
                Did something awesome happen today? Big or small, every victory
                matters! Share your story to inspire other kids and families. ✨
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Share My Success Story 📝
            </button>
            </div>

            {/* Encouraging Footer Message */}
            <div className="text-center mt-8 p-6 bg-white/50 rounded-xl">
            <p className="text-gray-700 font-medium">
                🌟 Remember: Every child is unique and amazing in their own way!
                Your journey matters, your progress counts, and you&apos;re doing
                great! 💙💚
            </p>
            </div>
        </div>
    </div>
  );
}
