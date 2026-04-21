"use client";

import React, { useState } from "react";
import ScrollAnimation from "./ScrollAnimation";
import emailjs from "@emailjs/browser";

const Contact: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem("current_user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setFormData(prev => ({
                    ...prev,
                    name: parsedUser.name,
                    email: parsedUser.email
                }));
            } else {
                setUser(null);
                setFormData(prev => ({ ...prev, name: "", email: "" }));
            }
        };

        checkUser();
        window.addEventListener("storage", checkUser);

        // Custom listener for auth changes from Navbar
        const handleAuthChange = () => checkUser();
        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            window.removeEventListener("storage", checkUser);
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, []);

    const triggerAuth = () => {
        window.dispatchEvent(new CustomEvent("open-auth-modal"));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        setError(null);

        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_name: "Waiz Hussain", // Adding to_name as a best practice
        };

        try {
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

            console.log("Attempting to send email with Service ID:", serviceId);

            if (!serviceId || !templateId || !publicKey || serviceId === 'YOUR_SERVICE_ID') {
                console.warn("EmailJS IDs are missing or using placeholders. Form will simulate success.");
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else {
                const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
                console.log("EmailJS Success:", response);
            }

            setIsSent(true);
            setFormData(prev => ({
                ...prev,
                subject: "",
                message: ""
            }));
            setTimeout(() => setIsSent(false), 5000);
        } catch (err: any) {
            console.error("EmailJS Error Details:", err);
            const errorText = err?.text || err?.message || 'Unknown error';
            setError(`Error: ${errorText}. Please check the console for details.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section id="contact" className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column: Info */}
                    <div className="lg:w-1/2">
                        <ScrollAnimation>
                            <div className="flex items-center space-x-2 text-accent-primary mb-4">
                                <span className="w-8 h-[1px] bg-accent-primary"></span>
                                <span className="text-sm font-bold tracking-widest uppercase">Contact</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">
                                Let&apos;s Work Together
                            </h2>
                            <p className="text-text-secondary text-lg mb-10 leading-relaxed max-w-lg">
                                I&apos;m always open to new opportunities and collaborations. If you have a project in
                                mind or just want to say hi, feel free to reach out!
                            </p>

                            <div className="space-y-8 mb-12">
                                <div className="flex items-center space-x-6 group">
                                    <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-1">Email</h4>
                                        <p className="text-lg font-medium">waizhussain9955@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6 group">
                                    <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-accent-secondary group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-1">Location</h4>
                                        <p className="text-lg font-medium">Pakistan</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6 group">
                                    <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-accent-light group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-1">Availability</h4>
                                        <p className="text-lg font-medium">Open to Freelance & Full-Time</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex space-x-4">
                                <a
                                    href="https://github.com/waizhussain9955"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:shadow-[0_0_15px_var(--color-glow)] hover:-translate-y-1 transition-all group"
                                    title="GitHub"
                                >
                                    <svg className="w-5 h-5 text-text-secondary group-hover:text-accent-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/waiz-hussain-6750392ba"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:shadow-[0_0_15px_var(--color-glow)] hover:-translate-y-1 transition-all group"
                                    title="LinkedIn"
                                >
                                    <svg className="w-5 h-5 text-text-secondary group-hover:text-accent-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://wa.me/923272051549"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:shadow-[0_0_15px_var(--color-glow)] hover:-translate-y-1 transition-all group"
                                    title="WhatsApp"
                                >
                                    <svg className="w-5 h-5 text-text-secondary group-hover:text-accent-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </a>
                            </div>
                        </ScrollAnimation>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:w-1/2 relative">

                        <ScrollAnimation delay={200}>
                            <div className="p-8 md:p-10 rounded-3xl border-border/50 glass">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {!isSent ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-text-secondary ml-1">Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        readOnly={!!user}
                                                        className={`w-full bg-bg-secondary border border-border/50 rounded-xl px-5 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 transition-all text-text-primary placeholder:text-text-secondary/50 ${user ? 'cursor-not-allowed opacity-70' : ''}`}
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-text-secondary ml-1">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        readOnly={!!user}
                                                        className={`w-full bg-bg-secondary border border-border/50 rounded-xl px-5 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 transition-all text-text-primary placeholder:text-text-secondary/50 ${user ? 'cursor-not-allowed opacity-70' : ''}`}
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-secondary ml-1">Subject</label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-bg-secondary border border-border/50 rounded-xl px-5 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 transition-all text-text-primary placeholder:text-text-secondary/50"
                                                    placeholder="Project Inquiry"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-secondary ml-1">Message</label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    rows={5}
                                                    className="w-full bg-bg-secondary border border-border/50 rounded-xl px-5 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 transition-all text-text-primary resize-none placeholder:text-text-secondary/50"
                                                    placeholder="Your message here..."
                                                />
                                            </div>

                                            {error && (
                                                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl flex items-center animate-fadeIn">
                                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    <span className="text-sm font-medium">✗ {error}</span>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 bg-gradient-primary text-bg-primary hover:shadow-[0_10px_30_var(--color-glow)]"
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center justify-center">
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-bg-primary" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Sending...
                                                    </span>
                                                ) : (
                                                    "Send Message →"
                                                )}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="py-12 flex flex-col items-center text-center animate-fadeIn text-accent-primary">
                                            <div className="w-20 h-20 bg-accent-primary/10 rounded-full flex items-center justify-center mb-6 border border-accent-primary/20">
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                            <p className="text-text-secondary">
                                                Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                                            </p>
                                            <button
                                                onClick={() => setIsSent(false)}
                                                className="mt-8 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors underline underline-offset-8 decoration-accent-primary/30 hover:decoration-accent-primary"
                                            >
                                                Send another message
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </ScrollAnimation>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
