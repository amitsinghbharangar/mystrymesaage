'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { messageSchema } from '@/schemas/messageSchema';
import { useRouter } from 'next/navigation';

export default function VerifyAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const username = params.username as string;
  const { toast } = useToast();
  const router = useRouter();

  const [messages, setMessages] = useState(
    "What's a skill you'd love to learn, and why?||If you could travel anywhere in the world right now, where would you go and what would you do?||What's a book, movie, or song that has recently impacted you, and how?"
  );
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  // Function to auto-resize textarea height
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
  };

  // Effect to auto-resize textareas when suggestedMessages change
  useEffect(() => {
    const textareas = document.querySelectorAll('textarea.auto-resize');
    textareas.forEach((textarea) => {
      autoResizeTextarea(textarea as HTMLTextAreaElement);
    });
  }, [suggestedMessages]);

  const suggestMessage = async () => {
    try {
      const sentences = messages.split('||').map((s) => s.trim());
      setSuggestedMessages([]); // Clear previous suggestions

      // Simulate streaming-like output for each sentence
      for (let i = 0; i < sentences.length; i++) {
        let currentSentence = '';
        for (let j = 0; j < sentences[i].length; j++) {
          currentSentence += sentences[i][j];
          setSuggestedMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[i] = currentSentence;
            return updatedMessages;
          });
          await new Promise((resolve) => setTimeout(resolve, 10)); // Adjust speed
        }
      }
    } catch (error) {
      console.error('Error suggesting messages:', error);
    }
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sendMessage', {
        username,
        content: data.content,
      });
      toast({
        title: response.data.message,
        description: '',
      });
      form.reset({ content: '' }); // Clear the form
    } catch (error) {
      console.error('Error sending message:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Failed',
        description: axiosError.response?.data.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="sm:max-w-2xl md:max-w-6xl p-4 sm:p-8 space-y-6 bg-white rounded-lg shadow-lg mx-auto">
        <h1 className="text-lg font-semibold text-gray-800">
          Send Anonymous Message to <span className="text-blue-500">@{username}</span>
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter message here"
                      {...field}
                      rows={4}
                      className="resize-none w-full sm:w-3/4 md:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Send'
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="w-full max-w-2xl md:max-w-6xl bg-white rounded-lg max-h-fit mt-8 mx-auto px-4 sm:px-8">
        <Button className="bg-blue-500 hover:bg-blue-800 text-center" onClick={suggestMessage}>
          Suggest Messages with AI
        </Button>
        <div className="p-4 sm:p-6 shadow-md mt-3">
          <h1 className="text-lg font-bold">Messages</h1>
          {suggestedMessages.map((message, index) => (
            <Textarea
              key={index}
              className="auto-resize w-full my-4 p-2 border rounded-md cursor-pointer hover:bg-blue-50 resize-none overflow-hidden"
              value={message}
              readOnly
              onClick={() => {
                form.setValue('content', message);
              }}
              rows={1} // Start with 1 row
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={() => router.push(`/allReplies/${username}`)}>View all replies</Button>
      </div>
      <div className="text-center my-6 text-lg font-semibold">Get Your Message Board</div>
      <div className="flex justify-center mb-8">
        <Button onClick={() => router.push('/sign-up')}>Create your Account</Button>
      </div>
    </>
  );
}