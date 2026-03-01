
"use client";

import { Sparkles } from 'lucide-react';
import { useUI } from '@/contexts/ui-context';
import { motion } from 'framer-motion';
import { Tooltip, Button } from '@heroui/react';

export function FloatingKiraButton() {
  const { toggleAiChat } = useUI();

  return (
    <Tooltip content="Ask Kira AI" placement="left" color="primary" showArrow>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 1 }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(79, 70, 229, 0.4)',
              '0 0 0 12px rgba(79, 70, 229, 0)',
              '0 0 0 0 rgba(79, 70, 229, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="rounded-full"
        >
          <Button
            isIconOnly
            color="primary"
            variant="shadow"
            radius="full"
            size="lg"
            onPress={toggleAiChat}
            className="h-14 w-14 text-lg shadow-lg shadow-primary/30"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <Sparkles className="h-7 w-7" />
            </motion.div>
            <span className="sr-only">Ask Kira AI</span>
          </Button>
        </motion.div>
      </motion.div>
    </Tooltip>
  );
}
