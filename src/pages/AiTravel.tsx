// src/pages/AiTravel.tsx

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChatAI } from "@/hooks/useChatAI";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDestinations, type Destination } from "@/hooks/useDestinations";
import { SEOHead } from "@/components/SEOHead";
import LoginCard from "@/components/LoginCard";
import keilaCompassIcon from "@/assets/keila-compass-icon.png";
import UtrippinLogo from "@/components/UtrippinLogo";
import { FiltersSidebar } from "@/components/FiltersSidebar";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { TravelHeader } from "@/components/TravelHeader";
import { DestinationGrid } from "@/components/DestinationGrid";
import { AnimatedKeila } from "@/components/AnimatedKeila";
import { SimpleChatInput } from "@/components/SimpleChatInput";
import { GlobalKeilaBubble } from "@/components/GlobalKeilaBubble";
import { ReligionTravelCards } from "@/components/ReligionTravelCards";
import { NatureTravelCards } from "@/components/NatureTravelCards";
import { AdventureTravelCards } from "@/components/AdventureTravelCards";
import { FestivalTravelCards } from "@/components/FestivalTravelCards";
import { CultureTravelCards } from "@/components/CultureTravelCards";
import { RomanticTravelCards } from "@/components/RomanticTravelCards";
import { FamilyTravelCards } from "@/components/FamilyTravelCards";
import { FoodTravelCards } from "@/components/FoodTravelCards";
import { WildlifeTravelCards } from "@/components/WildlifeTravelCards";
import { ShoppingTravelCards } from "@/components/ShoppingTravelCards";
import { BeachTravelCards } from "@/components/BeachTravelCards";
import { HiddenGemTravelCards } from "@/components/HiddenGemTravelCards";
import { LuxuryTravelCards } from "@/components/LuxuryTravelCards";
import { HistoricalTravelCards } from "@/components/HistoricalTravelCards";
import { MountainTravelCards } from "@/components/MountainTravelCards";
import { NightSkiesTravelCards } from "@/components/NightSkiesTravelCards";
import { OutdoorTravelCards } from "@/components/OutdoorTravelCards";
import { MelaninCompassTravelCards } from "@/components/MelaninCompassTravelCards";
import { NightlifeTravelCards } from "@/components/NightlifeTravelCards";
import { SportsTravelCards } from "@/components/SportsTravelCards";
import { WellnessTravelCards } from "@/components/WellnessTravelCards";
import { SoloTravelCards } from "@/components/SoloTravelCards";
import { TravelTypeSelector } from "@/components/TravelTypeSelector";
// No need to import DesktopTravelPlanner or MobileTravelInterface here,
// as their implementations are now included below or adapted.

// --- START: Internal Components (moved/adapted from previous iterations) ---
// These components are now defined within or alongside AiTravel.tsx
// or are simplified/adapted for this single file.


// New Keila Mini Chat Bar Component - Now receives props directly from AiTravel.tsx
const KeilaMiniChat = ({ onOpenChat, onSendMessage, messages, isLoading }) => {
    const [miniInput, setMiniInput] = useState('');
    const lastMessage = messages[messages.length - 1];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { // <--- Changed type here
        e.preventDefault();
        const form = e.currentTarget; // Or e.target as HTMLFormElement;
        const inputElement = form.elements[0] as HTMLInputElement; // <--- Cast here

        if (inputElement.value.trim()) {
            onSendMessage(inputElement.value);
            setMiniInput('');
            onOpenChat(); // Open full chat when message is sent from mini chat
        }
    };

    const displayMessage = messages.length > 0
        ? (lastMessage.response ? `Keila: ${lastMessage.response}` : `You: ${lastMessage.question}`)
        : "Hi there! How can I help you plan your next adventure?";

    return (
        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-3 flex items-center space-x-2 z-40 w-80">
            <div className="scale-75 cursor-pointer animate-bounce" onClick={onOpenChat}>
                <img src={keilaCompassIcon} alt="Keila AI" className="w-8 h-8 rounded-full" />
            </div>
            <div className="flex-grow">
                <p className="text-xs text-gray-600 truncate cursor-pointer mb-1" onClick={onOpenChat}>
                    {displayMessage}
                </p>
                <form onSubmit={handleSubmit} className="flex">
                    <input
                        type="text"
                        value={miniInput}
                        onChange={(e) => setMiniInput(e.target.value)}
                        placeholder="Chat with Keila..."
                        className="flex-grow p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        disabled={isLoading}
                    />
                    <button type="submit" className="ml-2 text-blue-600 hover:text-blue-800" disabled={isLoading}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.169.409l5 1.429a1 1 0 001.169-1.409l-7-14z"></path></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};


// Main Desktop Layout Component - Replicating ixigo's UI
// This component now receives its necessary state/handlers from AiTravel.tsx
const DesktopTravelPlanner = ({ onClearChat, chatMessages, isLoading, onSendMessage, onStartNewTrip }) => {
    console.log('🚀 DesktopTravelPlanner COMPONENT IS LOADING!');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDestinations, setShowDestinations] = useState(false); // State for conditional photos
    const [selectedBudget, setSelectedBudget] = useState(null); // State for selected budget filter
    const [selectedWeather, setSelectedWeather] = useState(null); // State for selected weather filter
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Use the destinations hook for real data
    const { destinations, loading: destinationsLoading, error: destinationsError, fetchDestinations } = useDestinations();

    // Fetch all destinations on component mount
    useEffect(() => {
        fetchDestinations();
    }, []);

    // Category data with enhanced icons (Lucide React placeholders or custom SVGs)
    const categories = [
        { name: 'All', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> },
        { name: 'Religious', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-church"><path d="M18 8a3 3 0 0 0-3-3h-2V2h-2v3H9a3 3 0 0 0-3 3v7H3v4h18v-4h-3Z"/><path d="M8 11h8"/><path d="M12 15v6"/></svg> },
        { name: 'Cultural', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette"><circle cx="12" cy="12" r="10"/><path d="M16.5 8.5L12 13L13.5 14.5L18 10L16.5 8.5Z"/><path d="M10 12.5L12 14.5L10 16.5L8 14.5L10 12.5Z"/><path d="M7.5 7.5L9.5 9.5L7.5 11.5L5.5 9.5L7.5 7.5Z"/></svg> },
        { name: 'Nature', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 18 2c1 1.5 1.77 2.98 2 4.5A7 7 0 0 1 13 20H11z"/><path d="M12 13H4s-2 1-4 0c0 0 0 1 0 2s1 1 3 1c2 0 5-1 3-2Z"/></svg> },
        { name: 'Food', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2h-2c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v1"/></svg> },
        { name: 'Festivals', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-party-popper"><path d="M5.8 11.3 2 13.5l3.8 2.2 2.2 3.8 2.2-3.8 3.8-2.2-3.8-2.2-2.2-3.8z"/><path d="M19 12a7 7 0 1 0 0 14h0a7 7 0 0 0 0-14Z"/><path d="M19 12a7 7 0 1 0 0 14h0a7 7 0 0 0 0-14Z"/><path d="M22 4L12 14"/><path d="M12 8l4.2-4.2"/><path d="M21.2 13.2l-4.2 4.2"/></svg> },
        { name: 'Shopping', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2L3 7v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-5Z"/><path d="M3 7h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
        { name: 'Beaches', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="8"/><line x1="12" x2="12" y1="2" y2="4"/><line x1="12" x2="12" y1="20" y2="22"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="2" x2="4" y1="12" y2="12"/><line x1="20" x2="22" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/></svg> },
        { name: 'Mountains', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mountain"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg> },
        { name: 'Outdoors', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tent"><path d="M10 13l-7 8h18l-7-8"/><path d="M10 13L2 3h20l-8 10"/><path d="M12 22V3"/></svg> },
        { name: 'Nightlife', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wine"><path d="M8 22h8"/><path d="M7 17c3 0 5-2 5-5V2H9v10c0 3-2 5-5 5Z"/><path d="M12 2a4 4 0 0 0 4 4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2a4 4 0 0 0 4-4Z"/></svg> },
        { name: 'Luxury', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gem"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M12 22 20 9 6 3 12 22Z"/><path d="M2 9h20"/></svg> },
        { name: 'Romance', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5L12 22Z"/></svg> },
        { name: 'NightSkies', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon-stars"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v2"/><path d="M14 10h2"/><path d="M17 17v2"/><path d="M10 4h2"/><path d="M21 10h2"/></svg> },
        { name: 'Sports', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5h15a2.5 2.5 0 0 1 0 5H18"/><path d="M6 9v14l3-3 3 3 3-3 3 3V9"/><path d="M12 15V9"/></svg> },
        { name: 'Offbeat', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg> },
        { name: 'Melanin Compass', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> }, // Replaced with a simpler globe icon
    ];


    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => { // <--- Changed type here
        e.preventDefault();
        const form = e.currentTarget;
        const inputElement = form.elements[0] as HTMLInputElement; // <--- Cast here

        if (inputElement.value.trim()) {
            // Fetch destinations based on search query
            fetchDestinations(undefined, inputElement.value.trim());
            onSendMessage(`Plan a trip to ${inputElement.value}`);
            setShowDestinations(true); // Show destinations after a search
            setSearchQuery(''); // Clear search query after submission
        }
    };

    const handleCategoryClick = (categoryName: string) => {
        console.log('🔍 Category clicked:', categoryName);
        console.log('🔍 Current selectedCategory:', selectedCategory);
        
        if (categoryName === 'Melanin Compass') {
            console.log('🌍 MELANIN COMPASS CLICKED! Setting state...');
        }
        
        setSelectedCategory(categoryName);
        
        console.log('🔍 After setState, selectedCategory should be:', categoryName);
        
        // Fetch destinations for the selected category
        fetchDestinations(categoryName === 'All' ? undefined : categoryName);
        setShowDestinations(true); // Show destinations after category click
    };

    const handleDestinationCardClick = (destinationName: string) => {
        onSendMessage(`Generate a complete itinerary for ${destinationName}, focusing on unique experiences and local insights.`);
    };

    const handleBudgetClick = (budget: string) => {
        setSelectedBudget(budget);
        onSendMessage(`Find trips with a ${budget} budget.`);
        setShowDestinations(true);
    };

    const handleWeatherClick = (weather: string) => {
        setSelectedWeather(weather);
        onSendMessage(`Find trips with ${weather} weather.`);
        setShowDestinations(true);
    };

    const handleClearAllFilters = () => {
        setSelectedBudget(null);
        setSelectedWeather(null);
        setSearchQuery('');
        setShowDestinations(false); // Hide destinations when filters are cleared
        onClearChat(); // Clear Keila's chat as well
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Bar - Mimicking ixigo's header */}
            <header className="bg-white shadow-sm p-4 flex items-center justify-between relative z-10">
                <TravelTypeSelector 
                    onSelect={(type) => {
                        console.log('Selected travel type:', type);
                        // Handle the selection - could trigger different UI flows
                    }}
                />
                
                <form onSubmit={handleSearchSubmit} className="flex-grow max-w-xl mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </form>

                <button
                    onClick={() => { onStartNewTrip(); }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out flex items-center"
                >
                    <img src={keilaCompassIcon} alt="Keila Icon" className="w-6 h-6 mr-2 rounded-full"/>
                    Start New Trip
                    Start New Trip
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex">
                {/* Left Sidebar - Categories and Filters */}
                <aside className="w-64 bg-white shadow-md p-6 overflow-y-auto custom-scrollbar flex-shrink-0 max-h-screen">
                    <button onClick={() => console.log('TEST BUTTON WORKS')} className="mb-4 p-2 bg-red-500 text-white">TEST CLICK</button>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
                    <div className="grid grid-cols-1 gap-2 mb-8">{/* Changed to single column */}
                        {categories.map((category, index) => {
                            console.log(`Rendering category ${index}:`, category.name);
                            return (
                                <button
                                    key={category.name}
                                    onClick={() => handleCategoryClick(category.name)}
                                    className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition duration-200 text-gray-700 text-sm font-medium"
                                >
                                    {category.icon}
                                    <span className="mt-2 text-center">{category.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
                    <div className="space-y-4">
                        {/* Budget Filter */}
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Budget</h4>
                            <div className="flex flex-wrap gap-2">
                                {['Budget', 'Mid-range', 'Luxury'].map((budget) => (
                                    <button
                                        key={budget}
                                        onClick={() => handleBudgetClick(budget)}
                                        className={`px-3 py-1 border rounded-full text-sm ${
                                            selectedBudget === budget
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                        }`}
                                    >
                                        {budget}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Weather Filter */}
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Weather</h4>
                            <div className="flex flex-wrap gap-2">
                                {['Warm', 'Cold', 'Mild'].map((weather) => (
                                    <button
                                        key={weather}
                                        onClick={() => handleWeatherClick(weather)}
                                        className={`px-3 py-1 border rounded-full text-sm ${
                                            selectedWeather === weather
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                        }`}
                                    >
                                        {weather}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear All Filters Button */}
                        {(selectedBudget || selectedWeather || searchQuery) && (
                            <button
                                onClick={handleClearAllFilters}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg mt-4 shadow-md transition duration-300 ease-in-out"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </aside>

                {/* Central Content - Destinations or Chat Placeholder */}
                <section className="flex-grow p-6 bg-gray-50 overflow-y-auto">
                    {(() => {
                        console.log('🚨 DEBUG: Rendering logic - selectedCategory:', selectedCategory);
                        console.log('🚨 DEBUG: Rendering logic - showDestinations:', showDestinations);
                        
                        if (selectedCategory === 'Religious' || selectedCategory === 'religious') {
                            console.log('🚨 DEBUG: RELIGIOUS CATEGORY IS SELECTED - RENDERING CARDS');
                            return (
                                <div style={{border: '5px solid red', padding: '20px', backgroundColor: 'yellow'}}>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">🚨 TEST: Religious & Spiritual Destinations 🚨</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { title: "Vatican City", imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73042?w=400&h=300&fit=crop" },
                                            { title: "Mecca", imageUrl: "https://images.unsplash.com/photo-1564769662080-ec2544481688?w=400&h=300&fit=crop" },
                                            { title: "Jerusalem", imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop" },
                                        ].map((card, index) => (
                                            <div
                                                key={index}
                                                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-64 bg-gray-800"
                                                onClick={() => {
                                                    console.log('🚨 CARD CLICKED!!! Title:', card.title);
                                                    alert(`🚨 SUCCESS!!! You clicked: ${card.title}`);
                                                    console.log('🚨 This should show an alert!');
                                                }}
                                                style={{border: '3px solid lime'}}
                                            >
                                                <div className="absolute inset-0">
                                                    <img
                                                        src={card.imageUrl}
                                                        alt={card.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50"></div>
                                                </div>
                                                
                                                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                                                    <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                                                        {card.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        } else if (selectedCategory === 'Melanin Compass') {
                            console.log('🔍 Should show Melanin Compass cards');
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Melanin Compass Destinations</h2>
                                    <MelaninCompassTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Cultural') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Cultural Destinations</h2>
                                    <CultureTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Nature') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Nature Destinations</h2>
                                    <NatureTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Food') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Food & Culinary Destinations</h2>
                                    <FoodTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Festivals') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Festival Destinations</h2>
                                    <FestivalTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Beaches') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Beach Destinations</h2>
                                    <BeachTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Mountains') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Mountain Destinations</h2>
                                    <MountainTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Outdoors') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Outdoor Adventure Destinations</h2>
                                    <OutdoorTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'NightSkies') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Stargazing Destinations</h2>
                                    <NightSkiesTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Luxury') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Luxury Destinations</h2>
                                    <LuxuryTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Romance') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Romantic Destinations</h2>
                                    <RomanticTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Shopping') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Shopping Destinations</h2>
                                    <ShoppingTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Offbeat') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Hidden Gem Destinations</h2>
                                    <HiddenGemTravelCards />
                                </div>
                            );
                        } else if (selectedCategory === 'Melanin Compass') {
                            return (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Melanin Compass Destinations</h2>
                                    <MelaninCompassTravelCards />
                                </div>
                            );
                        } else if (showDestinations) {
                            console.log('🔍 Should show regular destinations');
                            return (
                                <div>
                                    {/* Category filter indicator */}
                                    {selectedCategory !== 'All' && (
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {selectedCategory} Destinations
                                            </h2>
                                            <span className="text-sm text-gray-600">
                                                {destinations.length} destinations found
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Loading state */}
                                    {destinationsLoading ? (
                                        <div className="flex items-center justify-center h-64">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span className="ml-2 text-gray-600">Loading destinations...</span>
                                        </div>
                                    ) : destinationsError ? (
                                        <div className="flex flex-col items-center justify-center h-64 text-red-500">
                                            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <p className="text-lg font-medium">Error loading destinations</p>
                                            <p className="text-sm mt-1">{destinationsError}</p>
                                            <button 
                                                onClick={() => fetchDestinations()}
                                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    ) : destinations.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.007-5.824-2.448M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            <p className="text-lg font-medium">No destinations found</p>
                                            <p className="text-sm mt-1">Try adjusting your search or filters</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {destinations.map((destination) => (
                                                <div
                                                    key={destination.id}
                                                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
                                                    onClick={() => handleDestinationCardClick(destination.name)}
                                                >
                                                    <img
                                                        src={destination.img || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop'}
                                                        alt={destination.name}
                                                        className="w-full h-40 object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop';
                                                        }}
                                                    />
                                                    <div className="p-4">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{destination.name}</h3>
                                                        {destination.country && (
                                                            <p className="text-sm text-gray-500 mb-2">{destination.country}</p>
                                                        )}
                                                        {destination.description && (
                                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{destination.description}</p>
                                                        )}
                                                        {destination.price && (
                                                            <p className="text-blue-600 font-semibold">
                                                                From ${destination.price} {destination.per || 'night'}
                                                            </p>
                                                        )}
                                                        {destination.category && (
                                                            <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                {destination.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        } else {
                            return (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                                    <svg className="w-32 h-32 mb-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    <p className="text-lg font-medium">Start by searching for a destination or picking a category!</p>
                                    <p className="text-sm mt-2">Keila, your AI travel planner, is here to help.</p>
                                    <button 
                                        onClick={() => handleCategoryClick('All')}
                                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Browse All Destinations
                                    </button>
                                </div>
                            );
                        }
                    })()}
                </section>

                {/* Right Sidebar - Keila Chat */}
                <aside className="w-96 bg-white shadow-md flex-shrink-0 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <img src={keilaCompassIcon} alt="Keila Icon" className="w-8 h-8 mr-2 rounded-full"/>
                            Keila AI Chat
                        </h3>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col space-y-4">
                        {chatMessages.length === 0 && !isLoading && (
                            <div className="flex justify-center items-center h-full text-gray-500">
                                <p>No messages yet. Ask Keila anything!</p>
                            </div>
                        )}
                        {/* Adapt chatMessages to match { sender: 'user' | 'ai', text: string } */}
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                // Assuming your useChatAI `messages` array has `sender` and `text` properties
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-xl shadow-sm ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] p-3 rounded-xl shadow-sm bg-gray-200 text-gray-800 rounded-bl-none">
                                    <div className="flex items-center">
                                        <span className="animate-pulse text-xl">...</span>
                                        <span className="ml-2 text-sm">Keila is typing</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={useRef(null)} /> {/* This ref likely belongs in a real scrollable chat component */}
                    </div>
                    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { // <--- Changed type here
                        e.preventDefault();
                        const form = e.currentTarget;
                        const inputElement = form.elements[0] as HTMLInputElement; // <--- Cast here
                        if (inputElement.value.trim()) {
                            onSendMessage(inputElement.value);
                            inputElement.value = '';
                        }
                    }} className="p-4 border-t border-gray-200 flex items-center">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2 text-gray-800"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            Send
                        </button>
                    </form>
                    <div className="p-2 flex justify-center">
                        <button onClick={onClearChat} className="text-sm text-blue-600 hover:underline">Start New Conversation</button>
                    </div>
                </aside>
            </main>

        </div>
    );
};

// Simplified MobileTravelInterface based on your existing props
// This will replace your original MobileTravelInterface component for now.
const MobileTravelInterface = ({ onSearch, onCategorySelect, onDestinationClick, onChatStart, onSendMessage, messages, isLoading }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { name: 'Hotels', key: 'hotels' },
        { name: 'Flights', key: 'flights' },
        { name: 'Packages', key: 'packages' },
        { name: 'Trains', key: 'trains' },
        { name: 'Rentals', key: 'rentals' },
        { name: 'Attractions', key: 'attractions' },
        { name: 'Cars', key: 'cars' },
        { name: 'Transfers', key: 'transfers' },
    ];

    const popularDestinations = [
        "Miami", "New York", "Los Angeles", "Chicago", "Orlando", "Las Vegas"
    ];

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => { // <--- Changed type here
        e.preventDefault();
        const form = e.currentTarget;
        const inputElement = form.elements[0] as HTMLInputElement; // <--- Cast here

        if (inputElement.value.trim()) {
            onSearch(inputElement.value);
            setSearchQuery('');
        }
    };

    const handleChatInputSubmit = (e: React.FormEvent<HTMLFormElement>) => { // <--- Changed type here
      e.preventDefault();
      const form = e.currentTarget;
      const inputElement = form.elements[0] as HTMLInputElement; // <--- Cast here
      if (inputElement.value.trim()) {
          onSendMessage(inputElement.value);
          inputElement.value = '';
      }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-blue-600 text-white p-4 text-center text-xl font-bold">
                Utrippin.ai - Mobile
            </header>
            <main className="flex-grow p-4 flex flex-col space-y-4">
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for destinations..."
                        className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-lg">Search</button>
                </form>

                {/* Categories */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.key}
                                onClick={() => onCategorySelect(category.key)}
                                className="bg-white p-3 rounded-lg shadow-sm text-center text-blue-600 font-medium hover:bg-blue-50"
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Popular Destinations */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Popular Destinations</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {popularDestinations.map((dest) => (
                            <button
                                key={dest}
                                onClick={() => onDestinationClick(dest)}
                                className="bg-white p-3 rounded-lg shadow-sm text-center text-gray-700 hover:bg-gray-50"
                            >
                                {dest}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Simplified Chat Interface for Mobile */}
                <div className="flex-grow border border-gray-200 rounded-lg p-3 flex flex-col bg-white shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Chat with Keila</h3>
                  <div className="flex-grow overflow-y-auto custom-scrollbar mb-2 space-y-2">
                    {messages.length === 0 && !isLoading ? (
                      <div className="text-center text-gray-500">Tap to start a chat!</div>
                    ) : (
                      messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-2 rounded-lg text-sm ${
                              msg.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] p-2 rounded-lg bg-gray-200 text-gray-800">
                            <span className="animate-pulse">...</span> Keila is typing
                          </div>
                        </div>
                    )}
                  </div>
                  <form onSubmit={handleChatInputSubmit} className="flex">
                    <input
                      type="text"
                      placeholder="Ask Keila..."
                      className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                      disabled={isLoading}
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-lg" disabled={isLoading}>Send</button>
                  </form>
                </div>

                <button
                    onClick={onChatStart}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mt-4"
                >
                    Start Chat with Keila
                </button>
            </main>
        </div>
    );
};

// --- END: Internal Components ---


const AiTravel = () => {
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  // Ensure useChatAI returns objects with a 'sender' property for messages,
  // typically 'user' or 'ai'. If not, you'll need to adapt the mapping logic
  // within KeilaChatModal and DesktopTravelPlanner's chat sections.
  const { messages, sendMessage, resetSession, loading } = useChatAI();
  const hasStartedChat = messages.length > 0;
  
  // State management for new layout
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filters, setFilters] = useState({
    budget: [0, 10000],
    travelTime: [0, 100],
    weather: [],
    pollution: [],
    temperature: []
  });
  
  // Get destinations data
  const { destinations, loading: destinationsLoading } = useDestinations();

  // Filter destinations based on category and filters - MOVED BEFORE CONDITIONAL RETURNS
  const filteredDestinations = useMemo(() => {
    let filtered = destinations;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => 
        dest.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply additional filters based on filters state
    // Add more filter logic here as needed
    
    return filtered;
  }, [destinations, selectedCategory, filters]);


  console.log('[AiTravel Page] Rendering. State:', {
    isAuthLoading: authLoading,
    isUser: !!user,
    isMobile,
    isChatLoading: loading,
    hasStartedChat,
    messagePairsCount: messages.length,
    messagesArray: messages
  });

  useEffect(() => {
    if (user) {
      // console.log('User detected, you can reset session here if needed.');
    }
  }, [user]);

  // Unified sendMessage handler for all components to use the useChatAI sendMessage
  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  // Handler for starting a new trip, which clears chat and sends initial message
  const handleStartNewTrip = useCallback(() => {
    resetSession(); // Use resetSession from useChatAI
    sendMessage("I want to plan a new trip."); // Initial message for new trip
  }, [resetSession, sendMessage]);


  // Handlers for mobile interface (if you keep it separate, otherwise you can remove)
  const handleMobileSearch = (query: string) => {
    sendMessage(`I want to plan a trip to ${query}`);
  };

  const handleMobileCategorySelect = (category: string) => {
    const categoryMessages = {
      hotels: "I'm looking for hotel recommendations",
      flights: "I need help finding flights",
      packages: "I want to book a flight and hotel package",
      trains: "I'm interested in train travel",
      rentals: "I need a vacation rental",
      attractions: "Show me popular attractions",
      cars: "I need to rent a car",
      transfers: "I need airport transfer options"
    };
    const message = categoryMessages[category] || `Help me with ${category}`;
    sendMessage(message);
  };

  const handleMobileDestinationClick = (destination: string) => {
    sendMessage(`I want to visit ${destination}. Can you help me plan a trip?`);
  };

  const handleMobileChatStart = () => {
    if (!hasStartedChat) {
      sendMessage("Keila, can you help me plan a trip?");
    }
  };


  if (authLoading) {
    return <div className="flex items-center justify-center h-dvh bg-black text-white">Loading Authentication...</div>;
  }

  if (!user) {
    return <LoginCard />;
  }

  if (isMobile) {
    return (
      <>
        <SEOHead title="AI Travel Planner | Utrippin" description="Your personal AI travel assistant, Keila." canonical="https://utrippin.ai/ai-travel" />
        <MobileTravelInterface
          onSearch={handleMobileSearch}
          onCategorySelect={handleMobileCategorySelect}
          onDestinationClick={handleMobileDestinationClick}
          onChatStart={handleMobileChatStart}
          onSendMessage={handleSendMessage} // Pass the unified sendMessage handler
          messages={messages}
          isLoading={loading}
        />
      </>
    );
  }

  console.log('[AiTravel Page] Passing props to DesktopTravelPlanner:', {
    hasStartedChat, // No longer directly used in DesktopTravelPlanner props, but kept for context
    chatMessages: messages,
    isLoading: loading,
  });

  const handleCreateTripWithAI = () => {
    if (!hasStartedChat) {
      sendMessage("I want to create a trip with AI assistance.", false, true); // Use Gemini
    }
  };

  return (
    <>
      <SEOHead 
        title="AI Travel Planner - Smart Trip Planning with Personalized Recommendations"
        description="Plan your perfect trip with our AI-powered travel assistant. Get personalized destination recommendations, itineraries, and travel tips based on your preferences."
        canonical="https://utrippin.ai/ai-travel"
        keywords="AI travel planner, trip planning, travel recommendations, personalized travel, smart travel assistant"
      />
      
      {/* New Layout */}
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <TravelHeader onCreateTripWithAI={handleCreateTripWithAI} />
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <FiltersSidebar onFiltersChange={setFilters} />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Category Carousel */}
            <CategoryCarousel 
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            
            {/* Destinations Grid or Welcome Content */}
            <div className="flex-1 overflow-y-auto">
              {selectedCategory === 'religious' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Religious & Spiritual Destinations</h2>
                  <ReligionTravelCards />
                </div>
              ) : selectedCategory === 'nature' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Nature & Wildlife Destinations</h2>
                  <NatureTravelCards />
                </div>
              ) : selectedCategory === 'outdoors' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Adventure & Outdoor Activities</h2>
                  <AdventureTravelCards />
                </div>
              ) : selectedCategory === 'festivals' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Festivals & Cultural Celebrations</h2>
                  <FestivalTravelCards />
                </div>
              ) : selectedCategory === 'cultural' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Cultural Heritage & Historical Sites</h2>
                  <CultureTravelCards />
                </div>
              ) : selectedCategory === 'romance' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Romantic Getaways & Couple Destinations</h2>
                  <RomanticTravelCards />
                </div>
              ) : selectedCategory === 'wellness' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Wellness & Retreats - Peaceful Destinations</h2>
                  <WellnessTravelCards />
                </div>
              ) : selectedCategory === 'family' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Family & Kids - Perfect Destinations for All Ages</h2>
                  <FamilyTravelCards />
                </div>
              ) : selectedCategory === 'solo' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Solo Travel - Independent Adventure Destinations</h2>
                  <SoloTravelCards />
                </div>
              ) : selectedCategory === 'food' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Culinary Adventures & Food Destinations</h2>
                  <FoodTravelCards />
                </div>
              ) : selectedCategory === 'nightskies' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Night Skies & Stargazing Destinations</h2>
                  <NightSkiesTravelCards />
                </div>
              ) : selectedCategory === 'wildlife' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Wildlife & Safari Adventures</h2>
                  <WildlifeTravelCards />
                </div>
              ) : selectedCategory === 'shopping' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Shopping & Market Destinations</h2>
                  <ShoppingTravelCards />
                </div>
              ) : selectedCategory === 'beaches' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Beach Paradise & Coastal Destinations</h2>
                  <BeachTravelCards />
                </div>
              ) : selectedCategory === 'luxury' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Luxury Travel & Premium Destinations</h2>
                  <LuxuryTravelCards />
                </div>
              ) : selectedCategory === 'mountains' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Mountain Adventures & Alpine Escapes</h2>
                  <MountainTravelCards />
                </div>
              ) : selectedCategory === 'outdoors' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Outdoor Adventures & Nature Escapes</h2>
                  <OutdoorTravelCards />
                </div>
              ) : selectedCategory === 'historical' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Historical Sites & Ancient Wonders</h2>
                  <HistoricalTravelCards />
                </div>
              ) : selectedCategory === 'offbeat' || selectedCategory === 'hidden' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Hidden Gems & Off-Beat Destinations</h2>
                  <HiddenGemTravelCards />
                </div>
              ) : selectedCategory === 'sports' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Adventure Sports & Outdoor Activities</h2>
                  <SportsTravelCards />
                </div>
              ) : selectedCategory === 'nightlife' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Nightlife & Entertainment Destinations</h2>
                  <NightlifeTravelCards />
                </div>
              ) : selectedCategory === 'melanin-compass' ? (
                (() => {
                  console.log('🌍 Rendering Melanin Compass category');
                  return (
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-6 text-center">Melanin Compass - Black Heritage & Culture Travel</h2>
                      <MelaninCompassTravelCards />
                    </div>
                  );
                })()
              ) : hasStartedChat ? (
                <div className="flex h-full">
                  {/* Chat Interface - Full Width */}
                  <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm m-4">
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold">Chat with Keila</h2>
                      <button 
                        onClick={() => {
                          resetSession();
                          setSelectedCategory('all');
                        }}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        New Chat
                      </button>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message, index) => (
                        <div key={message.id || index} className="space-y-4">
                          {/* User Message */}
                          <div className="flex justify-end">
                            <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                              {message.question}
                            </div>
                          </div>
                          
                          {/* AI Response */}
                          {message.response && (
                            <div className="flex justify-start">
                              <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 max-w-full lg:max-w-4xl">
                                <div className="prose prose-sm max-w-none">
                                  {message.response.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Loading indicator */}
                          {message.loading && (
                            <div className="flex justify-start">
                              <div className="bg-gray-100 rounded-lg px-4 py-2">
                                <div className="flex items-center space-x-2">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  </div>
                                  <span className="text-sm text-gray-600">Keila is thinking...</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Chat Input */}
                    <div className="border-t border-gray-200 p-4">
                      <SimpleChatInput
                        onSendMessage={(message) => {
                          sendMessage(message, false, true); // Use Gemini
                        }}
                        placeholder="Ask me to plan your next adventure..."
                        isLoading={loading}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  {/* Welcome Section */}
                  <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto text-center">
                    <div className="flex justify-center mb-6 scale-[3]">
                      <AnimatedKeila />
                    </div>
                    <h1 className="text-3xl font-bold mt-4 text-gray-900">Hi, I'm Keila!</h1>
                    <p className="text-gray-600 mt-2 mb-8">Select a category above to start planning your trip, or ask me anything!</p>
                    
                    {/* Chat Input */}
                    <SimpleChatInput
                      onSendMessage={(message) => {
                        sendMessage(message, false, true); // Use Gemini
                      }}
                      placeholder="Ask me to plan your next adventure..."
                      isLoading={loading}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiTravel;