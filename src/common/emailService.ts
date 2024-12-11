import * as nodemailer from 'nodemailer';

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail', // Use your email provider
            auth: {
                user: process.env.EMAIL_USER, // Email address
                pass: process.env.EMAIL_PASSWORD, // Email password or app-specific password
            },
        });
    }

    async sendEmail(to: string, subject: string, html: string) {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        });
    }
}