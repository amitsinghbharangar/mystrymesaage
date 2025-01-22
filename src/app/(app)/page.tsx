'use client';
import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/message.json";
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SignUpModal from '@/components/SignUpModal'; // Import the modal component
import Image from 'next/image';

export default function Home() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8">
        {/* Hero Section */}
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Dive into the World of Anonymous Conversations.
          </h1>
          <p className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg">
            Explore Mystry Message - Where identity remains a secret.
          </p>
        </section>

        {/* Carousel Section */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader className="text-sm sm:text-base md:text-lg font-semibold">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-4 sm:p-6">
                      <span className="text-sm sm:text-base md:text-lg font-semibold">
                        {message.content}
                      </span>
                    </CardContent>
                    <CardFooter className="text-xs sm:text-sm md:text-base">
                      {message.received}
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>

        {/* Sign-Up Button */}
        <div className="mt-8">
          <Button
            onClick={() => setIsSignUpModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Sign Up Now
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 text-white bg-blue-300">
        <p>&copy; 2025 Mystry Message. All rights reserved.</p>
        <div className="mt-2 space-y-1">
          <p>
            Contact Support:{" "}
            <a
              href="mailto:support@mystrymessage.com"
              className="underline hover:text-blue-100"
            >
              support@mystrymessage.com
            </a>
          </p>
          <p>
            Call Us:{" "}
            <a
              href="tel:+1234567890"
              className="underline hover:text-blue-100"
            >
              +1 (234) 567-890
            </a>
          </p>
        </div>
      </footer>

      {/* Sign-Up Modal */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
    </div>
  );
}