'use client'
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/message.json"
import Autoplay from 'embla-carousel-autoplay' 
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
export default function Home() {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-8">
      <section className="text-center mb-8 md:mb-12" >
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the World of Anonymous Conversations.
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Explore Mystry Message - Where identity remains a secret.
        </p>
      </section>
      <Carousel plugins={[Autoplay({delay:2000})]} className="w-full max-w-sm">
      <CarouselContent>
        {messages.map((message,index)=>( 
          
          <CarouselItem key={index}>
            <div className="p-1">
              <Card >
                <CardHeader>{message.title}</CardHeader>
                <CardContent className="flex  items-center justify-center p-6 ">
                  <span className="text-lg font-semibold">{message.content}</span>
                </CardContent>
                <CardFooter>{message.received}</CardFooter>
              </Card>
            </div>
          </CarouselItem>
        
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
    <footer className="text-center p-4 md:p-6 text-white bg-blue-300"> 
      &copy; 2025 Mystry Message. All right reserved.
    </footer>
    
    </>
  );
}
