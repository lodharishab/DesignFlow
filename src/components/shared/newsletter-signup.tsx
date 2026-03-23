'use client';

import React, { useState, useTransition } from 'react';
import { Input } from '@heroui/react';
import { Button } from '@heroui/react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { subscribeToNewsletter } from '@/lib/newsletter-db';
import { toast } from 'sonner';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    startTransition(async () => {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setSubscribed(true);
        setEmail('');
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <motion.div variants={fadeInUp} className="space-y-3">
      <h3 className="font-semibold font-headline text-sm tracking-wider text-foreground uppercase">
        Stay in the Loop
      </h3>
      <p className="text-sm text-default-500 leading-relaxed">
        Design tips, new services & exclusive offers — straight to your inbox.
      </p>

      {subscribed ? (
        <div className="flex items-center gap-2 text-sm text-success">
          <CheckCircle className="h-4 w-4" />
          <span>You&apos;re subscribed!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="bordered"
            radius="full"
            size="sm"
            startContent={<Mail className="h-4 w-4 text-default-400" />}
            classNames={{
              inputWrapper: 'border-default-200 data-[hover=true]:border-primary data-[focus=true]:border-primary h-9',
              input: 'text-sm',
            }}
            isRequired
            aria-label="Email address"
          />
          <Button
            type="submit"
            color="primary"
            variant="shadow"
            radius="full"
            size="sm"
            isLoading={isPending}
            isIconOnly
            aria-label="Subscribe"
            className="min-w-9 h-9"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}
    </motion.div>
  );
}
