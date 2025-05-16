"use client";

import { useActionState, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteAccountAction } from "@/actions/auth/deleteAccountAction";
import { donorInformationStore } from "@/lib/stores/donor/getInformation";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import removeGlobalData from "@/components/CommanComponents/RemoveGlobalData";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export function DeleteAccountMenuItem({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, formDelete, isPending] = useActionState(
    deleteAccountAction,
    null
  );
  const { session } = useAuthStore();
  const accessToken = session?.token;

  useEffect(() => {
    const handleDeleteAccount = async () => {
      if (state?.success) {
        toast.success(state?.message);
        await signOut({ redirect: true, callbackUrl: "/signIn" });
        removeGlobalData();
      }
      if (state?.success === false) {
        toast.error(state?.message);
      }
    };
    handleDeleteAccount();
  }, [state]);

  const handleDeleteAccount = async () => {};
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {/* <motion.div
          className="flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-md hover:bg-destructive/10 focus:bg-destructive/10 focus:outline-none text-destructive w-full"
          whileHover={{ x: 2 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenChange(true);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete Account</span>
        </motion.div> */}
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Delete Your Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. All your data will be permanently
            removed from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            You'll lose all your profile information, donation history, and
            account access immediately.
          </p>
        </div>
        <form action={formDelete}>
          <input type="hidden" name="accessToken" value={accessToken} />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
