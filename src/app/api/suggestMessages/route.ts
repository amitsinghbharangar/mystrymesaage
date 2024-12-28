import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
interface ProcessEnv {
    GEMINI_API_KEY: string; // Mark as required
}
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};
const apiKey = getEnv("GEMINI_API_KEY");

export async function POST(request: Request) {
  
  try {

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Parse the request body
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.mq, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

    // Validate input
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Generate content using the AI model
    const result = await model.generateContent(prompt);

    // Return the response
    return NextResponse.json({ response: result.response.text() }, { status: 200 });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}







// export default async function POST() {
//   const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.mq, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

//   try {
//       const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//         },
//         body: JSON.stringify({
//           inputs: prompt,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Hugging Face API error: ${response.statusText}`);
//       }

//       const data = await response.json();
//       const generatedText = data?.[0]?.generated_text
//       console.log(generatedText);
//       return Response.json(
//         {
//           success:true,
//           message:"Message generated successfully"
//         }
//       )
//       //res.status(200).json({ text: data[0].generated_text });
//     } catch (error) {
//       console.error('Error:', error);
//       return Response.json(
//         {
//           success:false,
//           message:"Failed to generate text"
//         },
//         {status:500}
//       )
//       //res.status(500).json({ error: 'Failed to generate text' });
//     }
// }






//import OpenAI from 'openai';

// const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY})

// export const runtime = 'edge';

// export async function POST(req:Request) {

//   try{
//     const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo', // Choose your desired model
//     stream:true,
//     prompt: prompt
//   });

//   return response.data.choices[0].text;
//   }catch (error){
//     if (condition) {
      
//     } else {
//       console.error("An expected error")
//     }
//   }

// }


// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages } = await req.json();
 
//   const result = streamText({
//     model: openai('gpt-4o'),
//     messages,
//   });

//   return result.toDataStreamResponse();
// }