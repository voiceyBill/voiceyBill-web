import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./_components/account-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  useDeleteUserMutation,
  useSendDeleteAccountOtpMutation,
} from "@/features/user/userAPI";
import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { PUBLIC_ROUTES } from "@/routes/common/routePath";
import { toast } from "sonner";

const Account = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleteOtp, setDeleteOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [sendDeleteAccountOtp] = useSendDeleteAccountOtpMutation();
  const [deleteUser] = useDeleteUserMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true);

      await sendDeleteAccountOtp().unwrap();

      toast.success("OTP sent to your email");
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: { message?: string } }).data?.message ===
          "string"
          ? (err as { data?: { message?: string } }).data?.message
          : "Unable to send OTP";

      toast.error(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmText.trim() !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }

    if (!deleteOtp.trim()) {
      toast.error("Enter the OTP sent to your email");
      return;
    }

    try {
      setIsDeleting(true);

      await deleteUser({ otp: deleteOtp.trim() }).unwrap();

      dispatch(logout());

      navigate(PUBLIC_ROUTES.HOME);

      toast.success("Account deleted");
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: { message?: string } }).data?.message ===
          "string"
          ? (err as { data?: { message?: string } }).data?.message
          : "Failed to delete account";

      toast.error(message);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
      setConfirmText("");
      setDeleteOtp("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>

        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </div>

      <Separator />

      <AccountForm />

      <Separator />

      <div className="pt-4">
        <h4 className="text-sm font-medium text-destructive">
          Danger Zone
        </h4>

        <p className="mt-1 text-xs text-muted-foreground">
          Permanently delete your account and data.
        </p>

        <div className="mt-3">
          <Button
            variant="destructive"
            onClick={() => setIsOpen(true)}
          >
            Delete account
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>

            <DialogDescription>
              This action is permanent. Type <strong>DELETE</strong> below to
              confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Type DELETE to confirm"
            />

            <Button
              variant="outline"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
            >
              {isSendingOtp ? "Sending OTP..." : "Send OTP"}
            </Button>

            <input
              value={deleteOtp}
              onChange={(e) => setDeleteOtp(e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Enter OTP code"
              maxLength={6}
            />
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>

            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Account;
