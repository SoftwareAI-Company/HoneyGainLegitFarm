// src/components/modals/HoneygainClaimPotModal.tsx
import React from 'react';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogPortal
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DockerManager } from '@/components/DockerManager';

interface HoneygainClaimPotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HoneygainClaimPotModal: React.FC<HoneygainClaimPotModalProps> = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogPortal>
      <DialogOverlay className="fixed inset-0 bg-black/80" />
      <DialogContent
        className={
          'fixed top-1/2 left-1/2 max-w-xl w-full ' +
          '-translate-x-1/2 -translate-y-1/2 bg-honeygain-card ' +
          'text-honeygain-text p-6 rounded-lg shadow-lg border-[#2d3749]'
        }
      >
        <DialogHeader>
          <DialogTitle>Claim Pot Automation</DialogTitle>
          <DialogDescription className="text-honeygain-muted">
            Automatize a reivindicação de potes de recompensas com Honeygain.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <DockerManager context="claimpot" />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-honeygain text-white hover:bg-honeygain-dark border-transparent"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
);
