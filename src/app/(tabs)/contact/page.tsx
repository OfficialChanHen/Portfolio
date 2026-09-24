"use client";

import { useState, useRef } from "react";
import { MailCheck, MailX, Mail, Send, Rocket } from 'lucide-react';
import { FiGithub, FiLinkedin } from "react-icons/fi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessagesSquare } from 'lucide-react';
import playOrTrigger from "@/app/utils/playOrTrigger";
import { useNavigationMode } from "@/providers/NavigationModeProvider";

type FormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export default function Contacts() {
    const textContainer = useRef<HTMLDivElement>(null);
    const formContainer = useRef<HTMLFormElement>(null);
    const socialContainer = useRef<HTMLDivElement>(null);
    
    const navigationMode = useNavigationMode();
    const delayTime = navigationMode === "soft" ? 0.4 : 0.6;
    useGSAP(() => {
        if (!textContainer.current || !formContainer.current || !socialContainer.current) return;

        const formTl = gsap.timeline({ paused: true });
        formTl
            .from(formContainer.current, {
                y: -20,
                opacity: 0,
                duration: 0.75,
                ease: "power2.inOut",
            })
            .fromTo(".form",
                {
                    x: -30,
                    y: 30,
                    opacity: 0,
                },
                {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    ease: "power2.inOut",
                    stagger: {
                        from: "start",
                        amount: 0.75,
                    },
                },
                "-=0.25"
            )

        const socialTl = gsap.timeline({ paused: true });
        socialTl
            .from(socialContainer.current, {
                y: -20,
                opacity: 0,
                duration: 0.75,
                ease: "power2.inOut",
            })
            .from(".social", {
                    x: -30,
                    y: 30,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    stagger: {
                        from: "start",
                        amount: 0.5,
                    },
                },
            );

        const introTl = gsap.timeline({
            onComplete: () => {
                playOrTrigger(formContainer.current as HTMLElement, formTl);
                playOrTrigger(socialContainer.current as HTMLElement, socialTl);
            },
        });

        introTl
            .fromTo(".rocket", {
                    x: 0,
                    y: -30,
                    opacity: 0,
                },
                {
                    x: 0,
                    y: textContainer.current.offsetHeight,
                    duration: 1.6,
                    ease: "power2.inOut",
                    delay: delayTime,
                    keyframes: {
                        opacity: [0, 1, 1, 0],
                        easeEach: "none",
                    },
                },
                0
            )
            .fromTo(".intro-text",
                { y: -20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.65,
                    ease: "power2.inOut",
                    stagger: {
                        from: "start",
                        amount: 0.65,
                    },
                    delay: delayTime + 0.25,
                },
                0
            );
    });

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
        <div className="w-screen min-h-dvh flex flex-col justify-start md:justify-center items-center p-10 pt-[106px] gap-10">
            
            {/* Contact Intro */}
            <div className="max-w-[1080px] gap-5">
                <div ref={textContainer} className="relative flex flex-col justify-center items-center text-center">

                    {/* Rocket */}
                    <div className='rocket absolute top-0 left-[48%] z-20 rotate-135 opacity-100'>
                        <Rocket size={20}/>
                    </div>

                    <div className="intro-text eyebrow mx-auto mb-2">
                        <MessagesSquare className='w-3.5 h-3.5 md:w-4 md:h-4'/>
                        <span>Send A Signal</span>
                    </div>
                    
                    <h2 className="intro-text text-[2.5rem] md:text-[3.5rem]">
                        Get In {" "}
                        <span className="text-gradient">
                            Touch
                        </span>
                    </h2>

                    <span className="intro-text text-[1rem] md:text-[1.35rem] text-white/70">
                        Have a <span className="text-gradient">project in mind</span> or <span className="text-gradient">just want to chat?</span> I would love to hear from you!
                    </span>
                </div>

                
                <div className="flex flex-col w-full md:flex-row gap-5 mt-5">
                    {/* Email Form */}
                    <form 
                        ref={formContainer}
                        className="glass flex flex-col justify-start items-start w-full gap-5 p-8 md:p-10 rounded-3xl"
                        onSubmit={handleSubmit}
                    >
                        <span className="form text-[1.05rem] md:text-[1.3rem] tracking-tight">Send A Message</span>
                        {/* Name */}
                        <div className="form flex flex-col w-full gap-2">
                            <label htmlFor="name" className="text-[0.7rem] md:text-[0.8rem] uppercase tracking-[0.18em] text-white/55">Name</label>
                            <input 
                                id="name"
                                name="name" 
                                type="text"
                                className="px-3.5 py-2.5 text-[0.8rem] md:text-[0.95rem] text-white bg-white/[0.035] border border-white/10 rounded-xl placeholder:text-white/25 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20 focus:outline-none focus:border-highlight/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-highlight/15" 
                                placeholder="Alex Rivera"
                                autoComplete="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            >  
                            </input>
                        </div>

                        {/* Email */}
                        <div className="form flex flex-col w-full gap-2">
                            <label htmlFor="email" className="text-[0.7rem] md:text-[0.8rem] uppercase tracking-[0.18em] text-white/55">Email</label>
                            <input 
                                id="email"
                                name="email" 
                                type="email"
                                autoComplete="email"
                                className="px-3.5 py-2.5 text-[0.8rem] md:text-[0.95rem] text-white bg-white/[0.035] border border-white/10 rounded-xl placeholder:text-white/25 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20 focus:outline-none focus:border-highlight/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-highlight/15" 
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            >  
                            </input>
                        </div>
                        
                        {/* Subject */}
                        <div className="form flex flex-col w-full gap-2">
                            <label htmlFor="subject" className="text-[0.7rem] md:text-[0.8rem] uppercase tracking-[0.18em] text-white/55">Subject</label>
                            <input 
                                id="subject"
                                name="subject" 
                                type="text"
                                className="px-3.5 py-2.5 text-[0.8rem] md:text-[0.95rem] text-white bg-white/[0.035] border border-white/10 rounded-xl placeholder:text-white/25 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20 focus:outline-none focus:border-highlight/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-highlight/15" 
                                placeholder="Freelance project"
                                value={formData.subject}
                                onChange={handleChange}
                            >  
                            </input>
                        </div>
                        
                        {/* Message */}
                        <div className="form flex flex-col w-full gap-2">
                            <label htmlFor="message" className="text-[0.7rem] md:text-[0.8rem] uppercase tracking-[0.18em] text-white/55">Message</label>
                            <textarea 
                                id="message"
                                name="message" 
                                className="min-h-32 resize-y px-3.5 py-2.5 text-[0.8rem] md:text-[0.95rem] text-white bg-white/[0.035] border border-white/10 rounded-xl placeholder:text-white/25 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20 focus:outline-none focus:border-highlight/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-highlight/15" 
                                placeholder="Hi Chan, I'd love to talk about..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                            >  
                            </textarea>
                        </div>

                        {/* Submit Button*/}
                        <div className="form group w-full">
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="btn-primary w-full text-[0.8rem] md:text-[0.95rem] disabled:opacity-60 disabled:pointer-events-none"
                            >
                                {status === "sending" ? (
                                    "Sending..."
                                ) : (
                                    <div className="relative flex items-center justify-center gap-2">
                                        <Send className="w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                                        
                                        <span className="overflow-hidden whitespace-nowrap max-w-[12rem] opacity-100 transition-all duration-400 group-hover:max-w-0 group-hover:opacity-0">
                                            Send Message
                                        </span>
                                    </div>
                                )}
                            </button>
                        </div>
                        

                        {status === "success" && (
                            <div className="inline-flex flex-row justify-start items-center gap-2 text-green-400 text-[0.75rem] md:text-[1rem]"> 
                                <MailCheck className="w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                                <span className="">Your message was sent successfully.</span>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="inline-flex flex-row justify-start items-center gap-2 text-red-400 text-[0.75rem] md:text-[1rem]"> 
                                <MailX className="w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                                <span className="">Something went wrong. Please try again.</span>
                            </div>
                        )}

                    </form>

                    {/* Social Connections */}
                    <div ref={socialContainer} className="glass self-start flex flex-col justify-start items-start gap-3 w-full p-8 md:p-10 rounded-3xl">
                        <span className="social mb-2 text-[1.05rem] md:text-[1.3rem] tracking-tight">Connect On Socials</span>

                        <div 
                            className="social group w-full flex flex-row items-center gap-4 -mx-3 px-3 py-2.5 rounded-xl text-[0.75rem] md:text-[1rem] text-white/85 hover:bg-white/[0.04] transition-colors"
                        >
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-linear-to-br from-tertiary to-highlight text-white rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_-8px] shadow-highlight/70 group-hover:scale-105 transition-all ease-in-out duration-300">
                                <Mail className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                            </div>
                            <div className="flex flex-col justify-center items-start">
                                <span className="group-hover:text-highlight transition-colors ease-in-out duration-300">Email</span>
                                <span className="text-white/45 group-hover:text-white/80 transition-colors ease-in-out duration-300">Chan Hen</span>
                            </div>
                        </div>

                        <a 
                            className="social group w-full flex flex-row items-center gap-4 -mx-3 px-3 py-2.5 rounded-xl text-[0.75rem] md:text-[1rem] text-white/85 hover:bg-white/[0.04] transition-colors"
                            href="https://github.com/OfficialChanHen" target="_blank" rel="noopener noreferrer"
                        >
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-linear-to-br from-tertiary to-highlight text-white rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_-8px] shadow-highlight/70 group-hover:scale-105 transition-all ease-in-out duration-300">
                                <FiGithub className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                            </div>
                            <div className="flex flex-col justify-center items-start">
                                <span className="group-hover:text-highlight transition-colors ease-in-out duration-300">Github</span>
                                <span className="text-white/45 group-hover:text-white/80 transition-colors ease-in-out duration-300">OfficialChanHen</span>
                            </div>
                        </a>

                        <a 
                            className="social group w-full flex flex-row items-center gap-4 -mx-3 px-3 py-2.5 rounded-xl text-[0.75rem] md:text-[1rem] text-white/85 hover:bg-white/[0.04] transition-colors"
                            href="https://www.linkedin.com/in/chan-hen-13727b233/" target="_blank" rel="noopener noreferrer"
                        >
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-linear-to-br from-tertiary to-highlight text-white rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_-8px] shadow-highlight/70 group-hover:scale-105 transition-all ease-in-out duration-300">
                                <FiLinkedin className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                            </div>
                            <div className="flex flex-col justify-center items-start">
                                <span className="group-hover:text-highlight transition-colors ease-in-out duration-300">Linkedin</span>
                                <span className="text-white/45 group-hover:text-white/80 transition-colors ease-in-out duration-300">Chan Hen</span>
                            </div>
                            
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}