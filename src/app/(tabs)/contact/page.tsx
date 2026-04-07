"use client";

import { useState, useRef } from "react";
import { MailCheck, MailX, Mail, Send, Rocket } from 'lucide-react';
import { FiGithub, FiLinkedin } from "react-icons/fi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

import StarBackground from "@/app/(tabs)/_components/StarBackground";
import { MessagesSquare } from 'lucide-react';

export default function Contacts() {
    const textContainer = useRef<HTMLDivElement>(null);
    const formContainer = useRef<HTMLFormElement>(null);
    const socialContainer = useRef<HTMLDivElement>(null);
    /*
    useGSAP(() => {
        if (!textContainer.current) return;

        gsap.fromTo(".rocket",
            { x: 0, y: -30, opacity: 0 },
            {
                x: 0,
                y: textContainer.current.offsetHeight,
                duration: 1.25,
                ease: "power2.inOut",
                delay: 1,
                keyframes: {
                    opacity: [0, 1, 1, 0],  // invisible → visible → visible → invisible
                    easeEach: "none"
                }
            }
        );

        tl.from(".intro-text", {
            x: 0,
            y: -20,
            opacity: 0,
            duration: 0.65,
            ease: "power2.inOut",
            stagger: {
                from: "start",
                amount: 0.65
            },
            delay: 1.05,
        });

        tl.from(".form-container", {
            x: 0,
            y: -20,
            opacity: 0,
            duration: 0.75,
            ease: "power2.inOut"
        });

        tl.fromTo(".form",
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
                    amount: 0.75
                }
            }
        );

        tl.from(".social-container", {
            x: 0,
            y: -20,
            opacity: 0,
            duration: 0.75,
            ease: "power2.inOut"
        });

        tl.from(".social", {
            x: -30,
            y: 30,
            opacity: 0,
            duration: 0.75,
            ease: "power2.inOut",
            stagger: {
                from: "start",
                amount: 0.75
            }
        });

    }, {});
    */
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
    .fromTo(
      ".form",
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
    );

  const socialTl = gsap.timeline({ paused: true });
  socialTl
    .from(socialContainer.current, {
      y: -20,
      opacity: 0,
      duration: 0.75,
      ease: "power2.inOut",
    })
    .from(
      ".social",
      {
        x: -30,
        y: 30,
        opacity: 0,
        duration: 0.75,
        ease: "power2.inOut",
        stagger: {
          from: "start",
          amount: 0.75,
        },
      },
      "-=0.25"
    );

  const playOrTrigger = (el: HTMLElement, tl: gsap.core.Timeline) => {
    if (ScrollTrigger.isInViewport(el, 0.2)) {
      tl.play();
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => tl.play(),
      });
    }
  };

  const introTl = gsap.timeline({
    onComplete: () => {
      playOrTrigger(formContainer.current as HTMLElement, formTl);
      playOrTrigger(socialContainer.current as HTMLElement, socialTl);
    },
  });

  introTl
    .fromTo(
      ".rocket",
      {
        x: 0,
        y: -30,
        opacity: 0,
      },
      {
        x: 0,
        y: textContainer.current.offsetHeight,
        duration: 1.25,
        ease: "power2.inOut",
        keyframes: {
          opacity: [0, 1, 1, 0],
          easeEach: "none",
        },
      },
      0
    )
    .from(
      ".intro-text",
      {
        y: -20,
        opacity: 0,
        duration: 0.65,
        ease: "power2.inOut",
        stagger: {
          from: "start",
          amount: 0.65,
        },
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
        <div className="w-full max-w-[1080px] h-full flex flex-col justify-start md:justify-center items-center p-10 gap-10">
            <StarBackground/>

            {/* Contact Intro */}
            <div ref={textContainer} className="relative flex flex-col justify-center items-center text-center">

                {/* Rocket */}
                <div className='rocket absolute top-0 left-[48%] z-20 rotate-135 opacity-100'>
                    <Rocket size={20}/>
                </div>

                <div className="intro-text w-fit mx-auto md:mx-0 flex flex-row justify-center md:justify-start items-center gap-2 px-3 py-2 text-[0.75rem] md:text-[1rem] bg-highlight/20 backdrop-blur-xs text-highlight border border-highlight rounded-full">
                    <MessagesSquare className='w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]'/>
                    <span>Let's Connect</span>
                </div>
                
                <div className="intro-text flex flex-row justify-center items-center md:justify-center md:items-start tracking-tight gap-[2ch]">
                    <span className="text-[2.5rem] md:text-[3.5rem]">Get In</span>
                    <span className="text-[2.5rem] md:text-[3.5rem] bg-gradient-to-r from-highlight via-tertiary to-highlight bg-clip-text text-transparent">
                        Touch
                    </span>
                </div>

                <span className="intro-text text-[1rem] md:text-[1.5rem] text-white/80">Have a project in mind or just want to chat? I would love to hear from you!</span>
            </div>

            
            <div className="flex flex-col w-full lg:flex-row gap-5">
                {/* Email Form */}
                <form 
                    ref={formContainer}
                    className="form-container flex flex-col justify-start items-start w-full gap-5 bg-primary/60 border border-primary p-10 rounded-md"
                    onSubmit={handleSubmit}
                >
                    <span className="form text-[1rem] md:text-[1.25rem]">Send A Message</span>
                    {/* Name */}
                    <div className="form flex flex-col w-full gap-1">
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
                    <div className="form flex flex-col w-full gap-1">
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
                    <div className="form flex flex-col w-full gap-1">
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
                    <div className="form flex flex-col w-full gap-1">
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
                        className="form group w-full px-5 py-3 text-[0.75rem] md:text-[1rem] rounded-md cursor-pointer text-white tracking-widest bg-highlight backdrop-blur-xs border-none shadow-[0_0_25px] shadow-highlight hover:shadow-[0_0_5px,_0_0_20px,_0_0_50px] hover:shadow-highlight hover:scale-105 transition-all ease-in-out duration-500"
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
                <div ref={socialContainer} className="social-container self-start flex flex-col justify-start items-start gap-5 w-full bg-primary/60 border border-primary p-10 rounded-md">
                    <span className="social text-[1rem] md:text-[1.25rem]">Connect On Socials</span>

                    <div 
                        className="social group flex flex-row items-center gap-4 text-[0.75rem] md:text-[1rem] text-white/80"
                    >
                        <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-tertiary/60 border border-tertiary group-hover:border-highlight rounded-md text-tertiary group-hover:text-highlight transition-colors ease-in-out duration-300">
                            <Mail className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                        </div>
                        <div className="flex flex-col justify-center items-start">
                            <span className="group-hover:text-white transition-colors ease-in-out duration-300">Email</span>
                            <span className="text-white/60 group-hover:text-white transition-colors ease-in-out duration-300">Chan Hen</span>
                        </div>
                    </div>

                    <a 
                        className="social group flex flex-row items-center gap-4 text-[0.75rem] md:text-[1rem] text-white/80"
                        href="https://github.com/OfficialChanHen" target="_blank" rel="noopener noreferrer"
                    >
                        <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-tertiary/60 border border-tertiary group-hover:border-highlight rounded-md text-tertiary group-hover:text-highlight transition-colors ease-in-out duration-300">
                            <FiGithub className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                        </div>
                        <div className="flex flex-col justify-center items-start">
                            <span className="group-hover:text-white transition-colors ease-in-out duration-300">Github</span>
                            <span className="text-white/60 group-hover:text-white transition-colors ease-in-out duration-300">OfficialChanHen</span>
                        </div>
                    </a>

                    <a 
                        className="social group flex flex-row items-center gap-4 text-[0.75rem] md:text-[1rem] text-white/80"
                        href="https://www.linkedin.com/in/chan-hen-13727b233/" target="_blank" rel="noopener noreferrer"
                    >
                        <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-tertiary/60 border border-tertiary group-hover:border-highlight rounded-md text-tertiary group-hover:text-highlight transition-colors ease-in-out duration-300">
                            <FiLinkedin className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                        </div>
                        <div className="flex flex-col justify-center items-start">
                            <span className="group-hover:text-white transition-colors ease-in-out duration-300">Linkedin</span>
                            <span className="text-white/60 group-hover:text-white transition-colors ease-in-out duration-300">Chan Hen</span>
                        </div>
                        
                    </a>
                </div>
            </div>
        </div>
    );
}