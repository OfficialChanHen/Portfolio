"use client";

import { useState } from "react";
import { MailCheck, MailX } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};


import StarBackground from "@/app/(tabs)/_components/StarBackground";
import { MessagesSquare } from 'lucide-react';

export default function Contacts() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("sending");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to send");

            setStatus("success");
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch {
            setStatus("error");
        }
    }

    return(
        <div className="relative w-full max-w-[1080px] h-full flex flex-col justify-start md:justify-center items-center p-10 gap-10">
            <StarBackground/>

            {/* Contact Intro */}
            <div className="flex flex-col justify-center items-center text-center">
                <div className="intro-text w-fit mx-auto md:mx-0 flex flex-row justify-center md:justify-start items-center gap-2 px-3 py-2 text-[0.75rem] md:text-[1rem] bg-highlight/20 backdrop-blur-xs text-highlight border border-highlight rounded-full">
                    <MessagesSquare className='w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]'/>
                    <span>Let's Connect</span>
                </div>
                
                <div className="flex flex-row justify-center items-center md:justify-center md:items-start tracking-tight gap-[2ch]">
                    <span className="intro-text text-[2.5rem] md:text-[3.5rem]">Get In</span>
                    <span className="intro-text text-[2.5rem] md:text-[3.5rem] bg-gradient-to-r from-highlight via-tertiary to-highlight bg-clip-text text-transparent">
                        Touch
                    </span>
                </div>

                <span className="text-[1rem] md:text-[1.5rem] text-white/80">Have a project in mind or just want to chat? I would love to hear from you!</span>
            </div>

            
            <div className="flex flex-col w-full xl:flex-row">
                {/* Email Form */}
                <form 
                    className="flex flex-col justify-start items-start w-full md:max-w-[50%] gap-5 bg-primary/60 border border-primary p-10 rounded-md"
                    onSubmit={handleSubmit}
                >
                    <span className="text-[1rem] md:text-[1.25rem]">Send A Message</span>
                    {/* Name */}
                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor="name" className="text-[0.75rem] md:text-[1rem] text-white/80">Name</label>
                        <input 
                            id="name"
                            name="name" 
                            type="text"
                            className="p-2 text-[0.75rem] md:text-[1rem] bg-tertiary/60 border border-tertiary rounded-md focus:outline-none focus:ring-2 focus:ring-highlight/60" 
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        >  
                        </input>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor="email" className="text-[0.75rem] md:text-[1rem] text-white/80">Email</label>
                        <input 
                            id="email"
                            name="email" 
                            type="Your Email"
                            className="p-2 text-[0.75rem] md:text-[1rem] bg-tertiary/60 border border-tertiary rounded-md focus:outline-none focus:ring-2 focus:ring-highlight/60" 
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        >  
                        </input>
                    </div>
                    
                    {/* Subject */}
                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor="subject" className="text-[0.75rem] md:text-[1rem] text-white/80">Subject</label>
                        <input 
                            id="subject"
                            name="subject" 
                            type="text"
                            className="p-2 text-[0.75rem] md:text-[1rem] bg-tertiary/60 border border-tertiary rounded-md focus:outline-none focus:ring-2 focus:ring-highlight/60" 
                            placeholder="Your Subject"
                            value={formData.subject}
                            onChange={handleChange}
                        >  
                        </input>
                    </div>
                    
                    {/* Message */}
                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor="message" className="text-[0.75rem] md:text-[1rem] text-white/80">Message</label>
                        <textarea 
                            id="message"
                            name="message" 
                            className="min-h-30 p-2 text-[0.75rem] md:text-[1rem] bg-tertiary/60 border border-tertiary rounded-md focus:outline-none focus:ring-2 focus:ring-highlight/60" 
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        >  
                        </textarea>
                    </div>

                    {/* Submit Button*/}
                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full px-5 py-3 text-[0.75rem] md:text-[1rem] rounded-md cursor-pointer text-white tracking-widest transition-[box-shadow] duration-500 bg-highlight backdrop-blur-xs border-none shadow-[0_0_25px] shadow-highlight hover:shadow-[0_0_5px,_0_0_25px,_0_0_50px,_0_0_100px] hover:shadow-highlight active:scale-[0.97] disabled:opacity-50"
                    >
                        {status === "sending" ? "Sending..." : "Send Message"}
                    </button>

                    {status === "success" && (
                        <div className="inline-flex flex-row justify-start items-center gap-2 text-green-400 text-[0.75rem] md:text-[1rem]"> 
                            <MailCheck className="w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                            <span className="">Your message was sent successfully.</span>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="inline-flex flex-row justify-start items-center gap-2 text-red-400 text-[0.75rem] md:text-[1rem]"> 
                            <MailCheck className="w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                            <span className="">Something went wrong. Please try again.</span>
                        </div>
                    )}

                </form>
                <div>test2</div>
            </div>
        </div>
    );
}